'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { localized } from '@/i18n/ui';
import { useLang } from '@/components/providers/LanguageProvider';
import DetailHeader from '@/components/detail/DetailHeader';
import Lightbox from '@/components/lightbox/Lightbox';
import ProductCard from '@/components/product/ProductCard';
import ContactForm from '@/components/contact/ContactForm';
import { cn } from '@/lib/cn';

/**
 * Product detail view.
 *
 * What this carries over from the rewrite of the SCSS version:
 *   - the description is rendered. It was fetched and then never read;
 *   - the description shown matches the language the visitor is browsing in —
 *     the old page mapped `description_sq || description` into the view
 *     regardless, so the English and German copy the client is asked to write
 *     in the admin panel was never displayed to anyone;
 *   - breadcrumbs, a quote panel and related products, so the page is neither
 *     disorienting nor a dead end. It previously had no call to action of any
 *     kind, on a site with no checkout;
 *   - thumbnails and gallery tiles are real buttons rather than `<div onClick>`
 *     with `alt=""`, and the lightbox is the shared accessible one.
 */
export default function ProductDetail({ product, related = [], categories = [] }) {
  const { lang, t } = useLang();

  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [quoteOpen, setQuoteOpen] = useState(false);

  const photos = product.images || [];
  const thumbs = product.thumbnails?.length ? product.thumbnails : photos;
  const captions = product.image_captions || [];

  const category = categories.find((entry) => entry.slug === product.category_slug);
  const categoryName = category ? localized(category, 'name', lang) : product.category;

  const description =
    (lang === 'sq' && product.description_sq) ||
    (lang === 'de' && product.description_de) ||
    (lang === 'en' && product.description) ||
    product.description ||
    product.description_sq ||
    product.description_de ||
    '';

  const mainPhoto = photos[activeIndex] || photos[0];

  return (
    <div className="min-h-screen bg-page text-ink">
      <DetailHeader
        crumbs={[
          { label: t('home'), href: '/' },
          { label: categoryName, href: product.category_slug ? `/category/${product.category_slug}` : null },
        ]}
        current={product.name}
      />

      <div className="mt-7 grid grid-cols-1 items-stretch lg:grid-cols-[1fr_1.2fr]">
        <div className="relative min-h-[62vw] overflow-hidden bg-card lg:min-h-[54vh]">
          {mainPhoto && (
            <button
              type="button"
              onClick={() => setLightboxIndex(activeIndex)}
              aria-label={`${product.name} — ${t('gallery')}`}
              className="group block size-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-accent"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mainPhoto}
                alt={product.name}
                width="1200"
                height="1200"
                decoding="async"
                className="size-full object-cover transition-transform duration-600 group-hover:scale-[1.03] motion-reduce:transform-none"
              />
            </button>
          )}
        </div>

        <div className="flex flex-col justify-center gap-5.5 px-gutter py-[clamp(2.5rem,6vw,4.5rem)]">
          {categoryName && (
            <span className="text-[0.68rem] font-bold uppercase tracking-eyebrow text-accent">{categoryName}</span>
          )}

          <h1 className="font-display text-[clamp(2.4rem,5vw,4.2rem)] font-light leading-[1.05] tracking-tight text-ink">
            {product.name}
          </h1>

          {description && (
            /* `whitespace-pre-line` honours the paragraph breaks typed into the
               admin panel's textarea. */
            <p className="max-w-[56ch] whitespace-pre-line text-[1rem] leading-[1.75] text-ink-soft">{description}</p>
          )}

          {photos.length > 1 && (
            <ul className="mt-2 flex list-none flex-wrap gap-2 border-t border-line pt-7">
              {photos.slice(0, 6).map((photo, index) => (
                <li key={photo}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`${product.name} ${index + 1}`}
                    aria-pressed={activeIndex === index}
                    className={cn(
                      'group size-18 shrink-0 cursor-pointer overflow-hidden rounded-sm border transition-colors duration-200',
                      activeIndex === index ? 'border-accent' : 'border-line hover:border-line-hover'
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbs[index] || photo}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.08]"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setQuoteOpen(true)}
              aria-haspopup="dialog"
              className="inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-gradient-to-br from-accent to-accent-light px-8.5 py-3.5 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-page transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_12px_30px_rgba(200,114,42,0.3)]"
            >
              {t('quoteTitle')}
            </button>
          </div>
        </div>
      </div>

      {quoteOpen && (
        <QuoteModal onClose={() => setQuoteOpen(false)}>
          <ContactForm productSlug={product.slug} productName={product.name} />
        </QuoteModal>
      )}

      {photos.length > 0 && (
        <section>
          <div className="px-gutter pb-6 pt-[clamp(2.75rem,6vw,4rem)]">
            <span className="flex items-center gap-4 text-xs font-semibold uppercase tracking-eyebrow text-accent">
              {t('gallery')}
              <span aria-hidden="true" className="block h-px w-[clamp(40px,8vw,110px)] bg-gradient-to-r from-accent-glow to-transparent" />
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 px-gutter sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
            {photos.map((photo, index) => (
              <button
                type="button"
                key={photo}
                onClick={() => setLightboxIndex(index)}
                aria-label={captions[index] ? `${product.name} — ${captions[index]}` : `${product.name} ${index + 1}`}
                className="group relative aspect-3/4 cursor-zoom-in overflow-hidden rounded-md border border-line bg-card focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-accent"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbs[index] || photo}
                  alt={captions[index] ? `${product.name} — ${captions[index]}` : product.name}
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="600"
                  className="size-full object-cover transition-transform duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.06] motion-reduce:transform-none"
                />
                {captions[index] && (
                  <span className="absolute inset-x-0 bottom-0 translate-y-1.5 bg-gradient-to-t from-[rgba(14,13,11,0.9)] to-transparent px-4 pb-4 pt-8 text-left text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-ink/85 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    {captions[index]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="pb-section">
          <div className="px-gutter pb-6 pt-[clamp(2.75rem,6vw,4rem)]">
            <span className="flex items-center gap-4 text-xs font-semibold uppercase tracking-eyebrow text-accent">
              {t('relatedProducts')}
              <span aria-hidden="true" className="block h-px w-[clamp(40px,8vw,110px)] bg-gradient-to-r from-accent-glow to-transparent" />
            </span>
          </div>

          <div className="grid grid-cols-2 gap-[clamp(1.25rem,2.5vw,1.875rem)] px-gutter md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
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
          alt={product.name}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}

/**
 * The quote request, as a dialog over the page rather than a panel that
 * pushed everything below it down the page — a visitor who clicked "Request
 * a quote" from the gallery or the related products further down used to
 * have no idea the form had opened at all, since it rendered back up by the
 * button and off their screen. Mirrors the lightbox's own dialog mechanics
 * (portal, Escape, backdrop click, scroll lock, focus trap) rather than
 * inventing a second pattern for the same job.
 */
function QuoteModal({ onClose, children }) {
  const { t } = useLang();
  const [mounted, setMounted] = useState(false);

  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const restoreFocusRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return undefined;
    restoreFocusRef.current = document.activeElement;
    closeButtonRef.current?.focus();
    return () => restoreFocusRef.current?.focus?.();
  }, [mounted]);

  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  if (!mounted) return null;

  return createPortal(
    <div
      role="presentation"
      onKeyDown={handleKeyDown}
      onClick={(event) => event.target === event.currentTarget && onClose()}
      className="fixed inset-0 z-10000 flex animate-fade-in items-start justify-center overflow-y-auto bg-[rgba(6,5,4,0.86)] px-4 py-10 backdrop-blur-[6px] sm:items-center sm:py-14"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('quoteTitle')}
        className="relative w-full max-w-[520px]"
      >
        <button
          type="button"
          ref={closeButtonRef}
          onClick={onClose}
          aria-label={t('close')}
          className="absolute -right-3 -top-3 z-10 grid size-10 cursor-pointer place-items-center rounded-full border border-line-hover bg-card text-ink-soft shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition-colors duration-200 hover:text-accent"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
}
