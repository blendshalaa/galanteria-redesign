'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { localized } from '@/i18n/ui';
import { useLang } from '@/components/providers/LanguageProvider';
import ProductCard from '@/components/product/ProductCard';
import { EmptyState, ErrorState, SkeletonGrid, Spinner } from '@/components/ui/states';
import { Button } from '@/components/ui/Button';

const PAGE_SIZE = 24;

const SORTS = {
  newest: { column: 'created_at', ascending: false, labelKey: 'sortNewest' },
  name_asc: { column: 'name', ascending: true, labelKey: 'sortNameAsc' },
  name_desc: { column: 'name', ascending: false, labelKey: 'sortNameDesc' },
};

/**
 * The category grid, its sort control and its "load more" button.
 *
 * The first page arrives from the server render, so this component starts with
 * products already on screen and only talks to Supabase when the visitor asks
 * for a different order or for more rows. That is the split the SPA could not
 * make: there, every visit paid for a round trip before showing anything.
 */
export default function CategoryBrowser({ slug, category, initialProducts, total, failed }) {
  const { lang, t } = useLang();

  const [products, setProducts] = useState(initialProducts);
  const [count, setCount] = useState(total);
  const [sort, setSort] = useState('newest');
  const [status, setStatus] = useState(failed ? 'error' : 'ready');
  const [loadingMore, setLoadingMore] = useState(false);

  // The server already delivered the default sort; re-fetching it on mount
  // would be a wasted request that also flashes a skeleton over a full grid.
  const isFirstRender = useRef(true);

  const title = category ? localized(category, 'name', lang) : slug;

  const fetchPage = useCallback(
    (from, order) => {
      const config = SORTS[order] ?? SORTS.newest;
      return supabase
        .from('products')
        .select('id, name, slug, images, thumbnails, category_slug', { count: 'exact' })
        .eq('category_slug', slug)
        .order(config.column, { ascending: config.ascending })
        .range(from, from + PAGE_SIZE - 1);
    },
    [slug]
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let cancelled = false;
    setStatus('loading');

    (async () => {
      const { data, error, count: nextCount } = await fetchPage(0, sort);
      if (cancelled) return;

      if (error) {
        console.error('[Galanteria] Failed to re-sort category', slug, error);
        setStatus('error');
        return;
      }

      setProducts(data || []);
      setCount(nextCount ?? data?.length ?? 0);
      setStatus('ready');
    })();

    return () => {
      cancelled = true;
    };
  }, [sort, fetchPage, slug]);

  const loadMore = async () => {
    setLoadingMore(true);
    const { data, error } = await fetchPage(products.length, sort);
    if (!error && data) setProducts((previous) => [...previous, ...data]);
    setLoadingMore(false);
  };

  const retry = async () => {
    setStatus('loading');
    const { data, error, count: nextCount } = await fetchPage(0, sort);
    if (error) {
      setStatus('error');
      return;
    }
    setProducts(data || []);
    setCount(nextCount ?? 0);
    setStatus('ready');
  };

  const hasMore = products.length < count;

  return (
    <div className="min-h-screen bg-page px-gutter pb-section pt-[calc(var(--spacing-nav-mobile)+2rem)] lg:pt-[calc(var(--spacing-nav)+3rem)]">
      <div className="mx-auto max-w-shell">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
          <Link href="/" scroll={false} className="transition-colors hover:text-accent">
            {t('home')}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-ink-soft">{title}</span>
        </nav>

        <header className="mb-10">
          <span className="mb-4 flex items-center gap-4 text-xs font-semibold uppercase tracking-eyebrow text-accent">
            {t('eyebrowCollection')}
            <span aria-hidden="true" className="block h-px w-[clamp(40px,8vw,110px)] bg-gradient-to-r from-accent-glow to-transparent" />
          </span>
          <h1 className="font-display text-2xl font-normal leading-[1.08] tracking-tight text-ink">{title}</h1>
          {status === 'ready' && count > 0 && (
            <p className="mt-3 text-sm uppercase tracking-[0.1em] text-ink-muted">
              {count} {t('productCount')}
            </p>
          )}
        </header>

        {status === 'ready' && products.length > 1 && (
          <div className="mb-8 flex items-center justify-end gap-3">
            <label htmlFor="category-sort" className="text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
              {t('sortBy')}
            </label>
            <select
              id="category-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="cursor-pointer rounded-sm border border-line bg-card px-3 py-2 text-base text-ink outline-none transition-colors hover:border-line-hover focus:border-accent"
            >
              {Object.entries(SORTS).map(([key, config]) => (
                <option key={key} value={key} className="bg-card">
                  {t(config.labelKey)}
                </option>
              ))}
            </select>
          </div>
        )}

        {status === 'loading' && <SkeletonGrid count={8} />}

        {status === 'error' && (
          <ErrorState title={t('errorTitle')} description={t('errorBody')} onRetry={retry} retryLabel={t('retry')} />
        )}

        {status === 'ready' && products.length === 0 && <EmptyState description={t('noProducts')} />}

        {status === 'ready' && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-7 md:grid-cols-3 xl:grid-cols-4">
              {products.map((product, index) => (
                // The first row is above the fold on most viewports, so those
                // images load eagerly and everything below them lazily.
                <ProductCard key={product.id} product={product} eager={index < 4} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 flex justify-center">
                <Button variant="ghost" onClick={loadMore} disabled={loadingMore}>
                  {loadingMore ? <Spinner size={15} /> : null}
                  {loadingMore ? t('loading') : t('loadMore')}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
