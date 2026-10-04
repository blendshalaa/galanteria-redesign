/**
 * URL-safe slugs that survive Albanian and German.
 *
 * The admin panel previously used:
 *
 *   value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
 *
 * which deletes any character outside a-z. On an Albanian furniture site that
 * is a real problem: "Karrigë Zyreje" became "karrig-zyreje" (the ë silently
 * vanished, taking the "e" with it) and "Çelik" became "elik". Two products
 * whose names differ only by an accented character collapsed onto the same
 * slug, which then broke the product page — it looks the row up with
 * `.single()`, and `.single()` errors when a slug matches more than one row.
 *
 * Transliterate instead of deleting.
 */

const TRANSLITERATIONS = {
  // Albanian
  ë: 'e', Ë: 'e',
  ç: 'c', Ç: 'c',
  // German — expanded the way German itself does it, so "Schränke" becomes
  // "schraenke" rather than "schrnke".
  ä: 'ae', Ä: 'ae',
  ö: 'oe', Ö: 'oe',
  ü: 'ue', Ü: 'ue',
  ß: 'ss',
  // Common leftovers from copy-pasted supplier names
  á: 'a', à: 'a', â: 'a', ã: 'a', å: 'a',
  é: 'e', è: 'e', ê: 'e',
  í: 'i', ì: 'i', î: 'i', ï: 'i',
  ó: 'o', ò: 'o', ô: 'o', õ: 'o', ø: 'o',
  ú: 'u', ù: 'u', û: 'u',
  ñ: 'n', š: 's', ž: 'z', ý: 'y',
};

export function slugify(value) {
  if (!value) return '';

  return String(value)
    // Expand the multi-character cases (ü -> ue, ß -> ss) before anything else.
    .replace(/[ëËçÇäÄöÖüÜßáàâãåéèêíìîïóòôõøúùûñšžý]/g, (ch) => TRANSLITERATIONS[ch] ?? ch)
    // Strip any remaining combining accents (é written as e + U+0301).
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** True if a string is already a well-formed slug. */
export function isValidSlug(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value || '');
}

/**
 * Append -2, -3, ... until the slug is not in `taken`.
 * Used when the live uniqueness check finds a collision.
 */
export function uniqueSlug(base, taken = []) {
  const set = new Set(taken);
  if (!set.has(base)) return base;

  let n = 2;
  while (set.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}
