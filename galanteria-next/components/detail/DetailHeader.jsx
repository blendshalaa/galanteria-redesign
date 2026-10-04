'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLang } from '@/components/providers/LanguageProvider';

/**
 * The back button and breadcrumb shared by the product and project pages.
 *
 * In the SCSS build these three class names were declared in Product1.scss
 * only, while the project page rendered the same markup — and because every
 * route was a separate lazily-imported chunk with its own stylesheet, on
 * /project/:slug they matched no rule at all: an unstyled button tucked under
 * the fixed navbar and a breadcrumb flush against the edge of the viewport.
 */
export default function DetailHeader({ crumbs = [], current }) {
  const router = useRouter();
  const { t } = useLang();

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-gutter pt-[calc(var(--spacing-nav-mobile)+20px)] lg:pt-[calc(var(--spacing-nav)+24px)]">
      <button
        type="button"
        onClick={() => router.back()}
        className="group inline-flex cursor-pointer items-center gap-2 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-ink-muted transition-colors duration-150 hover:text-accent"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-150 group-hover:-translate-x-0.5">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t('back')}
      </button>

      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.06em] text-ink-muted">
        {crumbs.map((crumb) => (
          <span key={crumb.label} className="flex items-center gap-2">
            {crumb.href ? (
              <Link href={crumb.href} scroll={false} className="text-ink-soft transition-colors duration-150 hover:text-accent-light">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-ink-soft">{crumb.label}</span>
            )}
            <span aria-hidden="true">/</span>
          </span>
        ))}
        {/* Long product and project names should not push the breadcrumb off
            the screen. */}
        <span aria-current="page" className="max-w-[32ch] truncate text-ink">
          {current}
        </span>
      </nav>
    </div>
  );
}
