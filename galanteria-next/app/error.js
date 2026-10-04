'use client';

import { useEffect } from 'react';
import { useLang } from '@/components/providers/LanguageProvider';
import { ErrorState, quietPillClasses } from '@/components/ui/states';

/**
 * The root-level boundary. `app/(site)/error.js` handles a page throwing —
 * this one exists for the narrower, worse case: `(site)/layout.js` itself
 * throwing, which happens when `SiteChrome`'s own `getCategories()` call
 * fails outright rather than returning `{ error }`. A segment's error.js
 * cannot catch an error from the layout.js in that same folder, only from
 * its children, so that failure skips `(site)/error.js` entirely and lands
 * here — without a navbar or footer to render around it, since the thing
 * that broke is what builds them. Bare bones, but still the site's own
 * colours and type rather than Next's default error screen.
 */
export default function RootError({ error, reset }) {
  const { t } = useLang();

  useEffect(() => {
    console.error('[Galanteria] Root error:', error);
  }, [error]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-page px-gutter text-center text-ink">
      <a href="/" className="font-display text-2xl font-semibold tracking-tight text-ink">
        Galanteria <span className="text-accent">Group</span>
      </a>

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
