/**
 * Join class names, dropping anything falsy.
 *
 * Deliberately not `clsx` — this is the whole of what the project needs from
 * it, and it keeps the dependency list to the three packages the site actually
 * runs on.
 */
export function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}
