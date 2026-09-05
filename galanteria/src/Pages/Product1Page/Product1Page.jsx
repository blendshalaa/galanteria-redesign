import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Product1 from '../../Pages/Product1/Product1';
import useLang from '../../Hooks/useLang';
import { ErrorState, LoadingState } from '../../Components/ui';

/**
 * Loads one product by slug.
 *
 * Fixes carried over from the previous version:
 *   - it mapped `description_sq || description` into the view regardless of the
 *     selected language, so the English and German descriptions the client is
 *     asked to write in the admin panel were never displayed to anyone;
 *   - the "not found" state was a hardcoded Albanian string in an inline style
 *     with no way back to the site;
 *   - `error` was destructured and discarded, so a network failure and a
 *     genuinely missing product looked identical;
 *   - `.single()` throws when a slug matches zero *or more than one* row —
 *     the latter was reachable, because slug generation stripped Albanian
 *     diacritics and nothing enforced uniqueness. `maybeSingle()` plus a limit
 *     degrades gracefully instead.
 */
const Product1Page = () => {
  const { slug } = useParams();
  const { lang, t } = useLang();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | missing | error

  const load = useCallback(async () => {
    setStatus('loading');

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[Galanteria] Failed to load product', slug, error);
      setStatus('error');
      return;
    }

    if (!data) {
      setStatus('missing');
      return;
    }

    setProduct(data);
    setStatus('ready');

    // Related products from the same category — the page previously ended at
    // the gallery with no onward path except the browser's back button.
    if (data.category_slug) {
      const { data: siblings } = await supabase
        .from('products')
        .select('id, name, slug, images, thumbnails')
        .eq('category_slug', data.category_slug)
        .neq('id', data.id)
        .limit(4);
      setRelated(siblings || []);
    } else {
      setRelated([]);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  if (status === 'loading') {
    return <LoadingState label={t('loading')} />;
  }

  if (status === 'error') {
    return (
      <div className="product-page-state">
        <ErrorState
          title={t('errorTitle')}
          description={t('errorBody')}
          onRetry={load}
          retryLabel={t('retry')}
        />
      </div>
    );
  }

  if (status === 'missing') {
    return (
      <div className="product-page-state">
        <ErrorState title={t('productNotFound')} description={t('notFoundBody')} />
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 80 }}>
          <Link to="/" className="ui-retry-btn">{t('backHome')}</Link>
        </div>
      </div>
    );
  }

  // Show the description for the language the visitor is actually browsing in,
  // falling back through the others rather than rendering an empty block.
  const description =
    (lang === 'sq' && product.description_sq) ||
    (lang === 'de' && product.description_de) ||
    (lang === 'en' && product.description) ||
    product.description ||
    product.description_sq ||
    product.description_de ||
    '';

  return (
    <Product1
      data={{
        id: product.id,
        category: product.category,
        categorySlug: product.category_slug,
        name: product.name,
        slug: product.slug,
        description,
        photos: product.images || [],
        thumbnails: product.thumbnails || product.images || [],
        captions: product.image_captions || [],
        firstphoto: product.images?.[0],
      }}
      related={related}
    />
  );
};

export default Product1Page;
