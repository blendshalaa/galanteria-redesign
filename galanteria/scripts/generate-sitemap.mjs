#!/usr/bin/env node
/**
 * Writes public/sitemap.xml from the live Supabase catalogue.
 *
 * The site had no sitemap and no robots.txt. It is also a client-rendered SPA,
 * so a crawler that does not execute JavaScript sees an empty shell — which
 * makes an explicit list of every product, project and category URL more
 * valuable here than it would be on a server-rendered site.
 *
 * Run before deploying, whenever the catalogue has changed:
 *
 *   node scripts/generate-sitemap.mjs
 *
 * Reads VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY from the environment or
 * from the .env file next to package.json.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SITE_URL = process.env.SITE_URL || 'https://www.galanteriagroup.com';

// Minimal .env reader — avoids a dependency for a build-time script.
async function loadEnv() {
  try {
    const raw = await readFile(join(ROOT, '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
      }
    }
  } catch {
    // No .env — rely on the ambient environment.
  }
}

await loadEnv();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error(
    'Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
    'Create galanteria/.env (see .env.example) or set them in the environment.'
  );
  process.exit(1);
}

async function select(table, columns) {
  const response = await fetch(`${url}/rest/v1/${table}?select=${columns}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) {
    throw new Error(`${table}: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

const [categories, products, projects] = await Promise.all([
  select('categories', 'slug,is_active,updated_at'),
  select('products', 'slug,updated_at'),
  select('projects', 'slug,updated_at'),
]);

const today = new Date().toISOString().slice(0, 10);
const lastmod = (row) => (row.updated_at ? row.updated_at.slice(0, 10) : today);

const entries = [
  { loc: '/', priority: '1.0', changefreq: 'weekly', lastmod: today },
  { loc: '/Aboutus', priority: '0.6', changefreq: 'monthly', lastmod: today },
  { loc: '/Contact', priority: '0.7', changefreq: 'monthly', lastmod: today },
  { loc: '/Projects', priority: '0.8', changefreq: 'weekly', lastmod: today },

  ...categories
    .filter((category) => category.is_active !== false)
    .map((category) => ({
      loc: `/category/${category.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: lastmod(category),
    })),

  ...products.map((product) => ({
    loc: `/product/${product.slug}`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: lastmod(product),
  })),

  ...projects.map((project) => ({
    loc: `/project/${project.slug}`,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: lastmod(project),
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${SITE_URL}${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

await writeFile(join(ROOT, 'public', 'sitemap.xml'), xml);

console.log(
  `Wrote public/sitemap.xml — ${entries.length} URLs ` +
  `(${categories.length} categories, ${products.length} products, ${projects.length} projects).`
);
