'use client';

import Link from 'next/link';
import { useLang } from '@/components/providers/LanguageProvider';

const PLACEHOLDER = 'https://placehold.co/600x750/1a1815/555?text=Galanteria';

/**
 * One product tile — used by category pages, search results and the related
 * products strip, which makes it the most repeated visual unit on the site.
 *
 * It is a real link. The tiles used to be `<div onClick={() => navigate(...)}>`,
 * which cannot be focused, cannot be opened in a new tab or middle-clicked, has
 * no href for a crawler to follow, and is invisible to a keyboard user.
 *
 * The `<img>` is deliberate rather than `next/image`: these URLs point at
 * thumbnails the admin uploader already generated at 600px, so the optimiser
 * would be re-processing an image that is finished. The aspect-ratio box around
 * it is what stops the grid reflowing as photos arrive.
 */
export default function ProductCard({ product, eager = false }) {
  const { t } = useLang();

  const image = product.thumbnails?.[0] || product.images?.[0] || PLACEHOLDER;

  return (
    <article>
      <Link href={`/product/${product.slug}`} className="group block focus-visible:outline-offset-[5px]">
        <div className="relative aspect-4/5 overflow-hidden rounded-md border border-line bg-card transition-colors duration-250 group-hover:border-line-hover group-focus-visible:border-line-hover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={product.name}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={eager ? 'high' : 'auto'}
            width="600"
            height="750"
            onError={(event) => {
              if (event.currentTarget.src !== PLACEHOLDER) event.currentTarget.src = PLACEHOLDER;
            }}
            className="size-full object-cover transition-transform duration-650 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
          />

          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[rgba(10,9,8,0.78)] to-[rgba(10,9,8,0.12)] opacity-0 transition-opacity duration-250 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <span className="translate-y-2 rounded-full border border-ink/55 bg-page/35 px-5.5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink backdrop-blur-[6px] transition-transform duration-250 group-hover:translate-y-0 group-focus-visible:translate-y-0">
              {t('viewProduct')}
            </span>
          </span>
        </div>

        <h3 className="mt-4 font-sans text-base font-medium leading-snug tracking-[0.01em] text-ink transition-colors duration-250 group-hover:text-accent-light">
          {product.name}
        </h3>
      </Link>
    </article>
  );
}
