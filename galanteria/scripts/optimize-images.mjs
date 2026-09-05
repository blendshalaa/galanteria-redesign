#!/usr/bin/env node
/**
 * Downscales and re-encodes oversized images in src/assets in place.
 *
 * Photos here were committed straight from a camera: twelve of them were 7-8 MB
 * JPEGs, and they were served to browsers unchanged, inside grid tiles a few
 * hundred pixels wide. That is the single largest thing making the site slow,
 * and it also made `dist/` too big to deploy comfortably.
 *
 * This is a one-off repair for the images already in the repository. Images
 * added from now on go through the admin panel, which compresses them in the
 * browser before upload (src/utils/imageProcessing.js), so this should not need
 * running again.
 *
 * File names and extensions are preserved, because ~344 `import` statements
 * refer to them by name. A .jpg stays a .jpg — just a much smaller one.
 *
 *   node scripts/optimize-images.mjs            # report only
 *   node scripts/optimize-images.mjs --apply    # rewrite files in place
 */

import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const ASSETS = join(ROOT, 'src', 'assets');

const MAX_EDGE = 1800;          // plenty for a full-bleed hero on a 2x display
const JPEG_QUALITY = 80;
const PNG_QUALITY = 80;
const THRESHOLD = 400 * 1024;   // leave anything already under 400 KB alone

const apply = process.argv.includes('--apply');

const bytes = (n) =>
  n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`;

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = await walk(ASSETS);

const candidates = [];
for (const file of files) {
  const ext = extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

  const { size } = await stat(file);
  if (size < THRESHOLD) continue;

  candidates.push({ file, size, ext });
}

candidates.sort((a, b) => b.size - a.size);

console.log(
  `\n${candidates.length} images over ${bytes(THRESHOLD)} ` +
  `(${bytes(candidates.reduce((sum, c) => sum + c.size, 0))} total)\n`
);

let before = 0;
let after = 0;
let rewritten = 0;

for (const candidate of candidates) {
  const input = await readFile(candidate.file);

  let pipeline = sharp(input, { failOn: 'none' })
    // `withoutEnlargement` means a small image is re-encoded but never upscaled.
    .rotate() // honour EXIF orientation before we strip the metadata
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true });

  pipeline =
    candidate.ext === '.png'
      ? pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9, palette: true })
      : pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true });

  const output = await pipeline.toBuffer();

  before += candidate.size;

  // Never make a file bigger. Some already-optimised images come back larger
  // after a re-encode; keep the original in that case.
  if (output.length >= candidate.size) {
    after += candidate.size;
    continue;
  }

  after += output.length;
  rewritten += 1;

  const name = candidate.file.slice(ASSETS.length + 1);
  const saved = ((1 - output.length / candidate.size) * 100).toFixed(0);
  console.log(
    `  ${bytes(candidate.size).padStart(8)} → ${bytes(output.length).padStart(8)}` +
    `  (−${saved}%)  ${name}`
  );

  if (apply) await writeFile(candidate.file, output);
}

console.log(
  `\n${rewritten} images ${apply ? 'rewritten' : 'would be rewritten'}: ` +
  `${bytes(before)} → ${bytes(after)} (saves ${bytes(before - after)})`
);

if (!apply) console.log('\nDry run. Re-run with --apply to write the files.\n');
else console.log('');
