import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import useLang from '../../Hooks/useLang';
import useSEO from '../../Hooks/useSEO';
import useCategories from '../../Hooks/useCategories';
import ProductCard from '../../Components/ProductCard/ProductCard';
import { EmptyState, ErrorState, SkeletonGrid, Spinner } from '../../Components/ui';
import { localized } from '../../i18n/ui';
import { SITE_URL } from '../../config/contact';
import './CategoryPage.scss';

const PAGE_SIZE = 24;

const SORTS = {
  newest:   { column: 'created_at', ascending: false, labelKey: 'sortNewest' },
  name_asc: { column: 'name',       ascending: true,  labelKey: 'sortNameAsc' },
  name_desc:{ column: 'name',       ascending: false, labelKey: 'sortNameDesc' },
};

/**
 * One page for all ten categories, keyed by slug.
 *
 * Previously this component:
 *   - rendered its own <NavBar/> and <Footer/> while already inside <Layout/>,
 *     so every category page had two fixed, blurred navbars stacked on top of
 *     each other and two complete footers;
 *   - received its heading as a hardcoded Albanian string prop, shown to
 *     English and German visitors;
 *   - matched products by comparing a free-text display name, with a hardcoded
 *     `.in(['Tavolinë Pune','Tavolina Pune','Arbeits Tisch','Arbeits Tische'])`
 *     special case for the one category where that had already broken;
 *   - swallowed Supabase errors with `if (!error && data)`, so a failed request
 *     was indistinguishable from an empty category;
 *   - loaded every row at once with no pagination, and set no page title.
 */
const CategoryPage = () => {
  const { slug } = useParams();
  const { lang, t } = useLang();
  const { categories } = useCategories();

  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('newest');

  const category = useMemo(
    () => categories.find((c) => c.slug === slug),
    [categories, slug]
  );

  const title = category ? localized(category, 'name', lang) : slug;

  const fetchPage = useCallback(
    async (from) => {
      const config = SORTS[sort] ?? SORTS.newest;

      return supabase
        .from('products')
        .select('id, name, slug, images, thumbnails, category_slug', { count: 'exact' })
        .eq('category_slug', slug)
        .order(config.column, { ascending: config.ascending })
        .range(from, from + PAGE_SIZE - 1);
    },
    [slug, sort]
  );

  const load = useCallback(async () => {
    setStatus('loading');

    const { data, error, count } = await fetchPage(0);

    if (error) {
      console.error('[Galanteria] Failed to load category', slug, error);
      setStatus('error');
      return;
    }

    setProducts(data || []);
    setTotal(count ?? data?.length ?? 0);
    setStatus('ready');
  }, [fetchPage, slug]);

  useEffect(() => {
    load();
  }, [load]);

  const loadMore = async () => {
    setLoadingMore(true);
    const { data, error } = await fetchPage(products.length);
    if (!error && data) setProducts((prev) => [...prev, ...data]);
    setLoadingMore(false);
  };

  useSEO({
    title: title ? `${title} | Galanteria Group` : 'Galanteria Group',
    description: category
      ? `${title} — ${localized(category, 'name', 'en')} from Galanteria Group. Browse our collection of premium office and home furniture.`
      : 'Browse the Galanteria Group furniture collection.',
    image: products[0]?.images?.[0],
    jsonLd: category
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: title, item: `${SITE_URL}/category/${slug}` },
          ],
        }
      : undefined,
  });

  const hasMore = products.length < total;

  return (
    <div className="category-page-wrapper">
      {/* Breadcrumb, header, toolbar and grid all used to size themselves
          independently with four copies of the same max-width/padding rule. */}
      <div className="category-shell">
        <nav className="category-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">{t('home')}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{title}</span>
        </nav>

        <header className="category-header">
          <span className="eyebrow">{t('eyebrowCollection')}</span>
          <h1>{title}</h1>
          {status === 'ready' && total > 0 && (
            <p className="category-count">
              {total} {t('productCount')}
            </p>
          )}
        </header>

        {status === 'ready' && products.length > 1 && (
          <div className="category-toolbar">
            <label htmlFor="category-sort">{t('sortBy')}</label>
            <select
              id="category-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              {Object.entries(SORTS).map(([key, config]) => (
                <option key={key} value={key}>
                  {t(config.labelKey)}
                </option>
              ))}
            </select>
          </div>
        )}

        {status === 'loading' && <SkeletonGrid count={8} className="category-grid" />}

        {status === 'error' && (
          <ErrorState
            title={t('errorTitle')}
            description={t('errorBody')}
            onRetry={load}
            retryLabel={t('retry')}
          />
        )}

        {status === 'ready' && products.length === 0 && (
          <EmptyState description={t('noProducts')} />
        )}

        {status === 'ready' && products.length > 0 && (
          <>
            <div className="category-grid">
              {products.map((product, index) => (
                // The first row is above the fold on most viewports, so those
                // images load eagerly and everything below them lazily.
                <ProductCard key={product.id} product={product} eager={index < 4} />
              ))}
            </div>

            {hasMore && (
              <div className="category-more">
                <button type="button" className="btn btn-ghost" onClick={loadMore} disabled={loadingMore}>
                  {loadingMore ? <Spinner size={15} /> : null}
                  {loadingMore ? t('loading') : t('loadMore')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
