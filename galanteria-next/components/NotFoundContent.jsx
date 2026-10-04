'use client';

import Link from 'next/link';
import { useLang } from '@/components/providers/LanguageProvider';

export default function NotFoundContent() {
  const { t } = useLang();

  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center gap-4 px-gutter py-section text-center">
      <p className="font-display text-[clamp(5rem,18vw,11rem)] font-light leading-none text-accent/25">404</p>
      <h1 className="font-display text-2xl font-normal tracking-tight text-ink">{t('notFoundTitle')}</h1>
      <p className="max-w-[46ch] text-md leading-relaxed text-ink-soft">{t('notFoundBody')}</p>
      <Link
        href="/"
        scroll={false}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-6 py-3 text-base font-semibold text-ink transition-colors duration-200 hover:border-accent/45 hover:bg-accent/14"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        {t('backHome')}
      </Link>
    </div>
  );
}
