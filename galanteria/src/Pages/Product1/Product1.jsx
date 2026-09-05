import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useLang from '../../Hooks/useLang';
import useSEO from '../../Hooks/useSEO';
import useCategories from '../../Hooks/useCategories';
import Lightbox from '../../Components/Lightbox/Lightbox';
import ProductCard from '../../Components/ProductCard/ProductCard';
import ContactForm from '../../Components/ContactForm/ContactForm';
import { localized } from '../../i18n/ui';
import { SITE_URL } from '../../config/contact';
import './Product1.scss';

/**
 * Product detail view.
 *
 * What changed:
 *   - the description is rendered. It was fetched and then never read;
 *   - breadcrumbs, so a visitor arriving from search knows where they are;
 *   - a "Request a quote" panel — the page previously had no call to action of
 *     any kind, on a site with no checkout;
 *   - related products, so the page is not a dead end;
 *   - thumbnails and gallery tiles are real buttons rather than `<div onClick>`
 *     with `alt=""`, and the lightbox is the shared accessible one;
 *   - the dead `handleBackClick` scroll-restore has gone: it read a
 *     sessionStorage key ('scrollPosition') that nothing in the codebase has
 *     ever written.
 */
const Product1 = ({ data = {}, related = [] }) => {
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const { categories } = useCategories();

  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
  }, [data.slug]);

  const photos = data.photos || [];
  const thumbs = data.thumbnails?.length ? data.thumbnails : photos;
  const captions = data.captions || [];

  const category = useMemo(
    () => categories.find((c) => c.slug === data.categorySlug),
    [categories, data.categorySlug]
  );
  const categoryName = category ? localized(category, 'name', lang) : data.category;

  useSEO({
    title: `${data.name} | Galanteria Group`,
    description:
      data.description?.slice(0, 300) ||
      `${data.name} — ${categoryName || 'furniture'} from Galanteria Group.`,
    image: photos[0],
    type: 'product',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.name,
      description: data.description || undefined,
      image: photos.length ? photos : undefined,
      category: categoryName || undefined,
      brand: { '@type': 'Brand', name: 'Galanteria Group' },
      url: `${SITE_URL}/product/${data.slug}`,
    },
  });

  const mainPhoto = photos[activeIndex] || data.firstphoto;

  return (
    <div className="product1-wrapper">
      <div className="product-topbar">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('back')}
        </button>

        <nav className="product-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">{t('home')}</Link>
          <span aria-hidden="true">/</span>
          {data.categorySlug ? (
            <Link to={`/category/${data.categorySlug}`}>{categoryName}</Link>
          ) : (
            <span>{categoryName}</span>
          )}
          <span aria-hidden="true">/</span>
          <span aria-current="page">{data.name}</span>
        </nav>
      </div>

      <div className="product-hero">
        <div className="product-hero-image">
          <button
            type="button"
            className="product-main-photo"
            onClick={() => setLightboxIndex(activeIndex)}
            aria-label={`${data.name} — ${t('gallery')}`}
          >
            <img src={mainPhoto} alt={data.name} width="1200" height="1200" decoding="async" />
          </button>
        </div>

        <div className="product-hero-info">
          {categoryName && <span className="product-eyebrow">{categoryName}</span>}
          <h1 className="product-title">{data.name}</h1>

          {data.description && <p className="product-description">{data.description}</p>}

          {photos.length > 1 && (
            <div className="product-thumbs" role="list">
              {photos.slice(0, 6).map((photo, index) => (
                <button
                  type="button"
                  key={photo}
                  role="listitem"
                  className={`thumb ${activeIndex === index ? 'thumb--active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`${data.name} ${index + 1}`}
                  aria-pressed={activeIndex === index}
                >
                  <img src={thumbs[index] || photo} alt="" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}

          <div className="product-actions">
            <button
              type="button"
              className="product-quote-btn"
              onClick={() => setQuoteOpen((open) => !open)}
              aria-expanded={quoteOpen}
              aria-controls="product-quote-panel"
            >
              {t('quoteTitle')}
            </button>
          </div>
        </div>
      </div>

      {quoteOpen && (
        <section className="product-quote" id="product-quote-panel">
          <ContactForm productSlug={data.slug} productName={data.name} />
        </section>
      )}

      {photos.length > 0 && (
        <section className="product-gallery">
          <div className="gallery-header">
            <span className="eyebrow">{t('gallery')}</span>
          </div>
          <div className="gallery-grid">
            {photos.map((photo, index) => (
              <button
                type="button"
                key={photo}
                className="gallery-item"
                onClick={() => setLightboxIndex(index)}
                aria-label={captions[index] ? `${data.name} — ${captions[index]}` : `${data.name} ${index + 1}`}
              >
                <img
                  src={thumbs[index] || photo}
                  alt={captions[index] ? `${data.name} — ${captions[index]}` : data.name}
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="600"
                />
                {captions[index] && <span className="gallery-caption">{captions[index]}</span>}
              </button>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="product-related">
          <div className="gallery-header">
            <span className="eyebrow">{t('relatedProducts')}</span>
          </div>
          <div className="related-grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={photos}
          captions={captions}
          startIndex={lightboxIndex}
          alt={data.name}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
};

export default Product1;
