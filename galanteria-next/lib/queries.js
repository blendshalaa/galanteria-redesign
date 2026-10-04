import 'server-only';
import { cache } from 'react';
import { supabaseServer } from './supabase/server';

/**
 * Every read the public site performs, in one place.
 *
 * In the Vite build these queries were scattered through the components that
 * needed them — three of them duplicated with slightly different column lists,
 * and each one wrapped in the `if (!error && data)` pattern that made a failed
 * request look exactly like an empty table. Here a failure is logged and
 * returns the empty value, so a page renders its empty state rather than
 * throwing, and the console says which query went wrong.
 */

function report(what, error) {
  if (error) console.error(`[Galanteria] Failed to load ${what}:`, error.message);
}

/* -------------------------------------------------------------------------- */
/* Categories                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Wrapped in `cache()` because a single page render asks for the category list
 * several times over — the header menu, the footer column, the homepage tiles
 * and the hero's quick links all want it. This collapses those into one query
 * per request; the `revalidate` window in supabase/server.js then collapses the
 * requests themselves.
 */
export const getCategories = cache(async ({ activeOnly = true } = {}) => {
  const { data, error } = await supabaseServer
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  report('categories', error);
  const rows = data || [];
  return activeOnly ? rows.filter((row) => row.is_active !== false) : rows;
});

export async function getCategory(slug) {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug) || null;
}

/* -------------------------------------------------------------------------- */
/* Homepage content                                                            */
/* -------------------------------------------------------------------------- */

/**
 * The hero slideshow. The admin panel's "Hero Slider" tab writes this table;
 * the old homepage rendered hardcoded imports and never read it, so uploads had
 * no visible effect. The bundled photographs are the fallback for an empty
 * table, not the source.
 */
export async function getHeroImages() {
  const { data, error } = await supabaseServer
    .from('hero_images')
    .select('id, url, sort_order')
    .order('sort_order', { ascending: true });

  report('hero images', error);
  return (data || []).map((row) => row.url).filter(Boolean);
}

export async function getTestimonials() {
  const { data, error } = await supabaseServer
    .from('testimonials')
    .select('id, name, company, text')
    .order('created_at', { ascending: true });

  report('testimonials', error);
  return data || [];
}

/** One row out of `settings`, keyed by name. `about_text` holds `{sq,en,de}`. */
export async function getSetting(key, fallback = null) {
  const { data, error } = await supabaseServer
    .from('settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();

  report(`setting "${key}"`, error);
  return data?.value ?? fallback;
}

/* -------------------------------------------------------------------------- */
/* Products                                                                    */
/* -------------------------------------------------------------------------- */

export const PAGE_SIZE = 24;

export const PRODUCT_SORTS = {
  newest: { column: 'created_at', ascending: false, labelKey: 'sortNewest' },
  name_asc: { column: 'name', ascending: true, labelKey: 'sortNameAsc' },
  name_desc: { column: 'name', ascending: false, labelKey: 'sortNameDesc' },
};

/** The card-sized columns. A grid never needs the description or the captions. */
export const PRODUCT_CARD_COLUMNS = 'id, name, slug, images, thumbnails, category_slug';

export async function getProductsByCategory(slug, { sort = 'newest', from = 0 } = {}) {
  const config = PRODUCT_SORTS[sort] ?? PRODUCT_SORTS.newest;

  const { data, error, count } = await supabaseServer
    .from('products')
    .select(PRODUCT_CARD_COLUMNS, { count: 'exact' })
    .eq('category_slug', slug)
    .order(config.column, { ascending: config.ascending })
    .range(from, from + PAGE_SIZE - 1);

  report(`category "${slug}"`, error);
  return { products: data || [], total: count ?? 0, failed: Boolean(error) };
}

/**
 * A handful of real product photos per category, for the homepage's live
 * preview tiles. Distinct from `categoryImage()` in `config/categoryImages.js`,
 * which is a single bundled cover and only ever a fallback for a category
 * that has no products yet — this is the thing that fallback is standing in
 * for.
 */
export async function getCategoryPreviewImages(slugs, limit = 4) {
  const entries = await Promise.all(
    slugs.map(async (slug) => {
      const { data, error } = await supabaseServer
        .from('products')
        .select('slug, images, thumbnails')
        .eq('category_slug', slug)
        .order('created_at', { ascending: false })
        .limit(limit);

      report(`category preview "${slug}"`, error);

      const items = (data || [])
        .map((product) => ({
          slug: product.slug,
          image: product.thumbnails?.[0] || product.images?.[0] || null,
        }))
        .filter((item) => item.image);

      return [slug, items];
    })
  );

  return Object.fromEntries(entries);
}

export async function getProduct(slug) {
  /* `.single()` throws when a slug matches zero *or more than one* row, and the
     latter was reachable: slug generation used to strip Albanian diacritics, so
     two different names could collapse onto one slug. */
  const { data, error } = await supabaseServer
    .from('products')
    .select('*')
    .eq('slug', slug)
    .limit(1)
    .maybeSingle();

  report(`product "${slug}"`, error);
  return data || null;
}

export async function getRelatedProducts(product, limit = 4) {
  if (!product?.category_slug) return [];

  const { data, error } = await supabaseServer
    .from('products')
    .select(PRODUCT_CARD_COLUMNS)
    .eq('category_slug', product.category_slug)
    .neq('id', product.id)
    .limit(limit);

  report('related products', error);
  return data || [];
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

export async function getProjects() {
  const { data, error } = await supabaseServer
    .from('projects')
    .select('id, title, slug, images, thumbnails, location, year')
    .order('created_at', { ascending: false });

  report('projects', error);
  return { projects: data || [], failed: Boolean(error) };
}

export async function getProject(slug) {
  const { data, error } = await supabaseServer
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .limit(1)
    .maybeSingle();

  report(`project "${slug}"`, error);
  return data || null;
}

/* -------------------------------------------------------------------------- */
/* Sitemap                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Everything with a URL. The old sitemap was generated by a build script that
 * read the same tables with a separate Supabase client of its own and had to be
 * run by hand (`npm run sitemap`); app/sitemap.js replaces it, so the sitemap
 * can never again be older than the catalogue.
 */
export async function getSitemapEntries() {
  const [categories, products, projects] = await Promise.all([
    getCategories(),
    supabaseServer.from('products').select('slug, updated_at'),
    supabaseServer.from('projects').select('slug, updated_at'),
  ]);

  report('sitemap products', products.error);
  report('sitemap projects', projects.error);

  return {
    categories,
    products: products.data || [],
    projects: projects.data || [],
  };
}
