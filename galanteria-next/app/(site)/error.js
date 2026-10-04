'use client';

import { useEffect } from 'react';
import { useLang } from '@/components/providers/LanguageProvider';
import { ErrorState, quietPillClasses } from '@/components/ui/states';

/**
 * Catches a thrown exception from any page under the `(site)` group — a
 * Supabase call that fails outright rather than returning `{ error }` (a
 * network blip, a DNS hiccup, Supabase itself being down) previously had
 * nowhere to land, so the visitor got Next's bare, unbranded default error
 * screen instead of the site's own chrome.
 *
 * This boundary does not wrap `(site)/layout.js` itself — a failure in
 * `SiteChrome`'s own `getCategories()` call propagates past this file to the
 * root `app/error.js` instead, which is why that one exists too. Reusing
 * `ErrorState` here rather than inventing new markup keeps this looking like
 * the same "something went wrong" card every data-fetching section on the
 * site already shows, just full-page.
 */
export default function SiteError({ error, reset }) {
  const { t } = useLang();

  useEffect(() => {
    console.error('[Galanteria] Page error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center gap-3 px-gutter text-center">
      <ErrorState
        title={t('errorTitle')}
        description={t('errorBody')}
        onRetry={reset}
        retryLabel={t('retry')}
      />
      <a href="/" className={quietPillClasses}>
        {t('backHome')}
      </a>
    </div>
  );
}
