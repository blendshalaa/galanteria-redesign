import { describe, expect, it } from 'vitest';
import { isValidSlug, slugify, uniqueSlug } from './slugify';

/**
 * This is the function two real incidents came out of: Albanian/German
 * diacritics being deleted rather than transliterated collapsed two
 * differently-named products onto the same slug, which then broke the
 * product page (it looks the row up with `.single()`, which errors on more
 * than one match) — and separately, a batch of projects was seeded with raw,
 * un-slugified titles as their `slug` column (spaces and all), which 404'd
 * on every click. Locking the transliteration table down here is cheaper
 * than re-discovering either bug by hand again.
 */
describe('slugify', () => {
  it('lowercases and hyphenates plain ASCII', () => {
    expect(slugify('Office Chairs')).toBe('office-chairs');
  });

  it('transliterates Albanian diacritics instead of deleting them', () => {
    expect(slugify('Karrigë Zyreje')).toBe('karrige-zyreje');
    expect(slugify('Çelik')).toBe('celik');
  });

  it('expands German umlauts and ß the way German itself does', () => {
    expect(slugify('Schränke')).toBe('schraenke');
    expect(slugify('Büro')).toBe('buero');
    expect(slugify('Straße')).toBe('strasse');
  });

  it('transliterates ë to "e" rather than deleting it outright', () => {
    // The pre-fix regex (`.replace(/[^a-z0-9-]/g, '')`) deleted `ë` with no
    // trace, so "Karrigë Zyreje" slugified to "karrig-zyreje" — the "e" that
    // should have survived the "ë" vanished along with it.
    expect(slugify('Karrigë Zyreje')).toBe('karrige-zyreje');
    expect(slugify('Karrigë Zyreje')).not.toBe('karrig-zyreje');
  });

  it('strips punctuation and collapses whitespace runs to one hyphen', () => {
    expect(slugify('U-Smile Office - Liège')).toBe('u-smile-office-liege');
    expect(slugify('  Extra   Spaces  ')).toBe('extra-spaces');
  });

  it('never leaves a leading or trailing hyphen', () => {
    expect(slugify('--Leading and trailing--')).toBe('leading-and-trailing');
  });

  it('returns an empty string for empty input', () => {
    expect(slugify('')).toBe('');
    expect(slugify(null)).toBe('');
    expect(slugify(undefined)).toBe('');
  });

  it('truncates to 80 characters', () => {
    const long = 'a'.repeat(100);
    expect(slugify(long)).toHaveLength(80);
  });
});

describe('isValidSlug', () => {
  it('accepts a well-formed slug', () => {
    expect(isValidSlug('office-chairs')).toBe(true);
    expect(isValidSlug('a')).toBe(true);
  });

  it('rejects spaces, uppercase, leading/trailing hyphens and empty strings', () => {
    expect(isValidSlug('office chairs')).toBe(false);
    expect(isValidSlug('Office-Chairs')).toBe(false);
    expect(isValidSlug('-office-chairs')).toBe(false);
    expect(isValidSlug('office-chairs-')).toBe(false);
    expect(isValidSlug('')).toBe(false);
    expect(isValidSlug(undefined)).toBe(false);
  });
});

describe('uniqueSlug', () => {
  it('returns the base slug when it is not taken', () => {
    expect(uniqueSlug('chair', ['table', 'sofa'])).toBe('chair');
  });

  it('appends -2, -3, ... until it finds a free slug', () => {
    expect(uniqueSlug('chair', ['chair'])).toBe('chair-2');
    expect(uniqueSlug('chair', ['chair', 'chair-2', 'chair-3'])).toBe('chair-4');
  });
});
