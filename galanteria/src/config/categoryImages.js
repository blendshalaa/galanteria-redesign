/**
 * Cover photos for the ten seeded categories, keyed by slug.
 *
 * WHY THIS IS SHARED
 * ------------------
 * `003_categories.sql` creates the categories but does not fill in
 * `image_url`, so every row still has `image_url = null`. The homepage papered
 * over that with its own private copy of this map, while the admin panel had no
 * equivalent and fell back to `placehold.co/52x52?text=?`.
 *
 * The result was that the same category showed a real photograph on the public
 * site and a question mark in the panel that is supposed to manage it — so the
 * client could not tell which categories actually had artwork.
 *
 * Both now read from here. A cover uploaded through the admin writes a real
 * `image_url` and takes precedence; this map is only the fallback for the
 * categories that have never had one uploaded.
 */

import catWorkingTables from '../assets/images/a003.jpg';
import catMeetingTables from '../assets/images/MT003.jpg';
import catDrawers from '../assets/images/ST001.png';
import catOfficeChairs from '../assets/images/li15.jpg';
import catMeetingChairs from '../assets/images/c3.png';
import catWaitingChairs from '../assets/images/b1.jpg';
import catCabinets from '../assets/images/CB006.jpg';
import catWorkstations from '../assets/images/WS005.jpg';
import catOthers from '../assets/images/RD003.jpg';

export const FALLBACK_CATEGORY_IMAGES = {
  'working-tables': catWorkingTables,
  'meeting-tables': catMeetingTables,
  drawers: catDrawers,
  'office-chairs': catOfficeChairs,
  'meeting-chairs': catMeetingChairs,
  'waiting-chairs': catWaitingChairs,
  cabinets: catCabinets,
  workstations: catWorkstations,
  others: catOthers,
};

/** The uploaded cover if there is one, otherwise the bundled fallback. */
export function categoryImage(category) {
  if (!category) return null;
  return category.image_url || FALLBACK_CATEGORY_IMAGES[category.slug] || null;
}
