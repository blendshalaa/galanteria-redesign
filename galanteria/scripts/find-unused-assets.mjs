#!/usr/bin/env node
/**
 * Reports which files in src/assets are referenced by the code, which are not,
 * and which are byte-for-byte duplicates of each other.
 *
 * The assets directory reached 360 MB — including two 36 MB .tif files that no
 * web browser can display, twelve 7-8 MB JPEGs served straight to visitors, and
 * a long tail of images left behind by pages that no longer exist.
 *
 * Read-only by default. Pass --delete to remove the unreferenced files, and
 * --delete-dupes to additionally remove duplicate copies (keeping the one whose
 * name is referenced by the code, or the shortest name if neither is).
 *
 *   node scripts/find-unused-assets.mjs
 *   node scripts/find-unused-assets.mjs --delete
 */

import { readdir, readFile, stat, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src');
const ASSETS = join(SRC, 'assets');

const CODE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.html', '.json']);
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git']);

const args = new Set(process.argv.slice(2));
const doDelete = args.has('--delete');
const doDeleteDupes = args.has('--delete-dupes');

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

const bytes = (n) =>
  n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`;

const files = await walk(SRC);

// Every file that could reference an asset, concatenated. Matching on the bare
// basename is deliberately permissive: an asset is only reported as unused when
// its filename appears nowhere at all, which is the safe direction to err in.
const codeText = (
  await Promise.all(
    files
      .filter((file) => CODE_EXTENSIONS.has(extname(file)))
      .map((file) => readFile(file, 'utf8').catch(() => ''))
  )
).join('\n');

const assets = files.filter((file) => file.startsWith(ASSETS));

const unused = [];
const used = [];
let unusedBytes = 0;
let totalBytes = 0;

const hashes = new Map();

for (const asset of assets) {
  const name = asset.slice(ASSETS.length + 1);
  const base = name.split('/').pop();
  const { size } = await stat(asset);
  totalBytes += size;

  // Match on the encoded form too — filenames here contain spaces and
  // parentheses ("Frame 18 (1).png", "JET (3).jpg").
  const referenced =
    codeText.includes(base) ||
    codeText.includes(encodeURIComponent(base)) ||
    codeText.includes(base.replace(/ /g, '%20'));

  if (referenced) used.push({ asset, name, size });
  else {
    unused.push({ asset, name, size });
    unusedBytes += size;
  }

  const hash = createHash('sha1').update(await readFile(asset)).digest('hex');
  if (!hashes.has(hash)) hashes.set(hash, []);
  hashes.get(hash).push({ asset, name, size, referenced });
}

const duplicates = [...hashes.values()].filter((group) => group.length > 1);

console.log(`\nAssets: ${assets.length} files, ${bytes(totalBytes)} total\n`);

console.log(`── Unreferenced (${unused.length} files, ${bytes(unusedBytes)}) ──`);
for (const file of unused.sort((a, b) => b.size - a.size)) {
  console.log(`  ${bytes(file.size).padStart(8)}  ${file.name}`);
}

console.log(`\n── Duplicate content (${duplicates.length} groups) ──`);
let dupeBytes = 0;
for (const group of duplicates) {
  console.log(`  ${group.map((f) => f.name).join('  ≡  ')}   (${bytes(group[0].size)} each)`);
  dupeBytes += group[0].size * (group.length - 1);
}
console.log(`  Reclaimable by de-duplicating: ${bytes(dupeBytes)}`);

// Files a browser cannot render — no loader handles these, so they can only
// ever be dead weight in the repository.
const unrenderable = used
  .concat(unused)
  .filter((file) => ['.tif', '.tiff', '.psd', '.ai'].includes(extname(file.name).toLowerCase()));

if (unrenderable.length) {
  console.log(`\n── Not web formats (${unrenderable.length} files) ──`);
  for (const file of unrenderable) console.log(`  ${bytes(file.size).padStart(8)}  ${file.name}`);
}

const oversized = used.filter((file) => file.size > 1024 * 1024).sort((a, b) => b.size - a.size);
if (oversized.length) {
  console.log(`\n── Referenced but over 1 MB (${oversized.length} files) ──`);
  console.log('   These are served to browsers as-is. Convert with scripts/optimize-images.mjs.');
  for (const file of oversized.slice(0, 25)) {
    console.log(`  ${bytes(file.size).padStart(8)}  ${file.name}`);
  }
}

// Tolerate a file already removed by an earlier pass in the same run.
const remove = (path) => unlink(path).catch((error) => {
  if (error.code !== 'ENOENT') throw error;
});

if (doDelete) {
  console.log(`\nDeleting ${unused.length} unreferenced files...`);
  for (const file of unused) await remove(file.asset);
  console.log(`Reclaimed ${bytes(unusedBytes)}.`);
}

if (doDeleteDupes) {
  let reclaimed = 0;
  for (const group of duplicates) {
    // Keep a referenced copy if there is one, otherwise the shortest name.
    const keep =
      group.find((file) => file.referenced) ??
      group.slice().sort((a, b) => a.name.length - b.name.length)[0];

    for (const file of group) {
      if (file === keep) continue;
      if (file.referenced) continue; // never delete something the code imports
      await remove(file.asset);
      reclaimed += file.size;
    }
  }
  console.log(`De-duplicated: reclaimed ${bytes(reclaimed)}.`);
}

if (!doDelete && !doDeleteDupes) {
  console.log('\nRead-only run. Re-run with --delete and/or --delete-dupes to apply.');
}

console.log(`\nReferenced files kept: ${relative(ROOT, ASSETS)} (${used.length})\n`);
