/**
 * Cover photos for the ten seeded categories, keyed by slug.
 *
 * `003_categories.sql` creates the categories but does not fill in
 * `image_url`, so every row still has `image_url = null`. The homepage used to
 * paper over that with its own private copy of this map while the admin panel
 * had no equivalent and fell back to `placehold.co/52x52?text=?` — so the same
 * category showed a photograph on the public site and a question mark in the
 * panel that is supposed to manage it.
 *
 * These are plain `/public` paths rather than bundler imports now: Next serves
 * the folder as-is, and `next/image` can still optimise a static path.
 *
 * A cover uploaded through the admin writes a real `image_url` and takes
 * precedence; this map is only the fallback for categories that never had one.
 */

export const FALLBACK_CATEGORY_IMAGES = {
  'working-tables': '/images/a003.jpg',
  'meeting-tables': '/images/MT003.jpg',
  drawers: '/images/ST001.png',
  'office-chairs': '/images/li02.jpg',
  'meeting-chairs': '/images/c3.png',
  'waiting-chairs': '/images/wch02.png',
  cabinets: '/images/CB006.jpg',
  workstations: '/images/WS005.jpg',
  others: '/images/RD003.jpg',
};

/** The uploaded cover if there is one, otherwise the bundled fallback. */
export function categoryImage(category) {
  if (!category) return null;
  return category.image_url || FALLBACK_CATEGORY_IMAGES[category.slug] || null;
}

/** The homepage slideshow's fallback, used only when `hero_images` is empty. */
export const FALLBACK_HERO_IMAGES = [
  '/images/bottom10.jpg',
  '/images/h1.jpg',
  '/images/h3.jpg',
];
