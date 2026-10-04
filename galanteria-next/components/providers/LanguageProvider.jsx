'use client';

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { SUPPORTED_LANGS, t as translate } from '@/i18n/ui';

/* `useLayoutEffect` warns ("does nothing on the server") if it runs during
   SSR, but on the client it fires before the browser paints the frame —
   which is the difference between the stored language being applied
   invisibly and a flash of English on every reload. */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * The visitor's language.
 *
 * This replaces the useReducer context in Components/Context/Products.jsx. The
 * reducer had exactly one action and one field, and its `LANG` case read
 * `action.payland?.lang` — a typo for `payload` — which is why so much of the
 * old codebase guarded every lookup with `language[lang]?.…`.
 *
 * WHY THIS ALSO WRITES A COOKIE
 * ------------------------------
 * The choice used to live only in localStorage, which a server component
 * cannot read — so the HTML that arrived over the wire was always English,
 * corrected client-side after mount. A layout effect (see below) made that
 * correction happen before the browser's *next* paint, but it could not
 * undo the very first paint: the browser renders the HTML it received as
 * soon as it has it, before React's bundle has even finished downloading,
 * and that first frame was already English. On a slow connection that is a
 * real, visible flash, not a theoretical one.
 *
 * `app/layout.js` now reads a `lang` cookie — which *does* travel with the
 * request — and renders the right language into the HTML directly, so
 * there is nothing left to correct. `initialLang` below is that
 * server-resolved value. `setLang` keeps the cookie and localStorage in
 * sync so the next request (and the next tab) gets it right too.
 */

const LanguageContext = createContext(null);

export function LanguageProvider({ children, initialLang = 'en' }) {
  const [lang, setLangState] = useState(initialLang);

  // Covers a visitor who picked a language before this cookie existed —
  // their choice is only in localStorage, not yet in the cookie the server
  // reads. Migrates it into the cookie so the next request renders right.
  useIsomorphicLayoutEffect(() => {
    try {
      const stored = localStorage.getItem('lang');
      if (SUPPORTED_LANGS.includes(stored) && stored !== initialLang) {
        setLangState(stored);
        writeLangCookie(stored);
      }
    } catch {
      /* Private browsing, or storage disabled. The server-resolved value stands. */
    }
  }, [initialLang]);

  // Keep the document language in sync. index.html hardcoded `lang="en"` on a
  // trilingual site, which misleads screen readers about pronunciation and
  // search engines about the page's language.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    if (!SUPPORTED_LANGS.includes(next)) return;
    try {
      localStorage.setItem('lang', next);
    } catch {
      /* Not fatal — the choice simply will not survive a reload. */
    }
    writeLangCookie(next);
    setLangState(next);
  }, []);

  const value = useMemo(
    () => ({ lang, setLang, t: (key) => translate(lang, key) }),
    [lang, setLang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/** `{ lang, t, setLang }` — `t` is already bound to the current language. */
export function useLang() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLang must be used inside <LanguageProvider>');
  }
  return context;
}

/** A year, not a session cookie — a language choice should survive the
 *  browser closing, same as the localStorage copy already did. */
function writeLangCookie(value) {
  try {
    document.cookie = `lang=${value}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    /* Cookies disabled — localStorage is still the client-side fallback. */
  }
}
