'use client';

import { useState } from 'react';
import Link from 'next/link';

import language from '@/lang';
import { localized } from '@/i18n/ui';
import { cn } from '@/lib/cn';
import { categoryImage } from '@/config/categoryImages';
import { useLang } from '@/components/providers/LanguageProvider';
import { Eyebrow } from '@/components/ui/Section';

/**
 * The catalogue, as a showroom wall.
 *
 * A tab row of every category sits above a mosaic of photo tiles, and both
 * the copy beside the tiles and the photos in them belong to a single
 * category at a time — whichever tab was last clicked, rather than one
 * photo per category shown side by side. Only a click changes it; hovering
 * a tab is just a hover, the way it is everywhere else on the site.
 */
const TILE_COUNT = 4;

/* Tailwind scans for whole class names, so these can't be built from the
   index at runtime. The top row is a third for the panel and a third each
   for two photos; the panel doesn't carry down into the second row, which
   is just two photos splitting the full width — wider and taller than the
   ones above them, not a uniform 2x2. */
const TILE_LAYOUT = [
  { position: 'lg:col-span-4', height: 'lg:min-h-[clamp(170px,15vw,230px)]' },
  { position: 'lg:col-span-4', height: 'lg:min-h-[clamp(170px,15vw,230px)]' },
  { position: 'lg:col-span-6', height: 'lg:min-h-[clamp(220px,20vw,310px)]' },
  { position: 'lg:col-span-6', height: 'lg:min-h-[clamp(220px,20vw,310px)]' },
];

/** Up to `TILE_COUNT` real photos for a category, cycling through what's
 *  there to fill every tile rather than leaving slots empty when a category
 *  has fewer products than tiles — and falling back to the bundled cover
 *  photo entirely for a category with no products loaded yet. */
function tilesForCategory(category, previews) {
  const real = previews?.[category.slug]?.filter((item) => item.image) ?? [];
  const cover = categoryImage(category);
  const source = real.length > 0 ? real : cover ? [{ slug: null, image: cover }] : [];

  if (source.length === 0) return [];
  return Array.from({ length: TILE_COUNT }, (_, index) => source[index % source.length]);
}

export default function CategoryBento({ categories = [], categoryPreviews = {} }) {
  const { lang, t } = useLang();
  /* The category a click chose. Nothing previews on hover — a click is the
     only thing that changes the panel or the photos below it. */
  const [pinnedSlug, setPinnedSlug] = useState(null);

  if (categories.length === 0) return null;

  const active = categories.find((category) => category.slug === pinnedSlug) ?? null;
  const displayed = active ?? categories[0];
  const tiles = tilesForCategory(displayed, categoryPreviews);

  const pin = (slug) => setPinnedSlug((current) => (current === slug ? null : slug));

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-5">
      {/* The reference's pill tab bar, pinned above the grid at its right
          edge rather than inside it. */}
      {categories.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {categories.map((category) => {
            const isPinned = category.slug === pinnedSlug;
            return (
              /* A button, not a link: clicking a tab selects the panel and
                 the photos below it — it doesn't navigate. The panel's own
                 button is where "go there" actually lives. */
              <button
                key={category.slug}
                type="button"
                onClick={() => pin(category.slug)}
                aria-pressed={isPinned}
                className={cn(
                  'cursor-pointer rounded-full px-5 py-2.5 text-sm transition-[color,background-color,border-color] duration-250',
                  isPinned
                    ? 'bg-ink text-page'
                    : 'border border-line bg-card text-ink-soft hover:border-accent hover:text-accent'
                )}
              >
                {localized(category, 'name', lang)}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
        {/* The panel: a third of the top row, not the full height beside it
            — no card of its own, sitting straight on the section's ground
            the way the reference's copy does. */}
        <div className="flex flex-col justify-center gap-6 py-4 lg:col-span-4 lg:min-h-[clamp(170px,15vw,230px)] lg:py-0">
          <div>
            <Eyebrow>{t('eyebrowCollection')}</Eyebrow>
            <h2 className="mt-3 font-display text-[clamp(2.25rem,4.2vw,3.5rem)] font-normal leading-[1.04] tracking-tight text-ink">
              {active ? localized(active, 'name', lang) : language[lang]?.categories?.[0]?.title}
            </h2>
            {/* Clamped rather than trimmed: the paragraph in lang.js is long,
                and this cell has to keep the height its neighbours set. */}
            <p className="mt-5 line-clamp-3 max-w-[46ch] text-base font-light leading-[1.7] text-ink-soft">
              {language[lang]?.choose?.[0]?.text}
            </p>
          </div>

          <PillButton href={active ? `/category/${active.slug}` : '/Contact'}>
            {active ? t('explore') : t('requestQuote')}
          </PillButton>
        </div>

        {tiles.map((tile, index) => (
          <PhotoTile
            key={`${displayed.slug}-${index}`}
            href={tile.slug ? `/product/${tile.slug}` : `/category/${displayed.slug}`}
            image={tile.image}
            priority={index === 0}
            layout={TILE_LAYOUT[index] ?? TILE_LAYOUT[TILE_LAYOUT.length - 1]}
          />
        ))}
      </div>
    </div>
  );
}

/** The reference's split pill — a label fused to a filled circle rather than
 *  a bordered rectangle with an arrow trailing after the text. */
function PillButton({ href, children }) {
  return (
    <Link
      href={href}
      className="group inline-flex w-fit items-center gap-4 rounded-full bg-accent py-1.5 pl-6 pr-1.5 text-[0.85rem] font-semibold uppercase tracking-[0.08em] text-[#16120c] transition-colors duration-300 hover:bg-accent-light"
    >
      {children}
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-full bg-[#16120c] text-accent transition-transform duration-300 ease-out group-hover:translate-x-0.5"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}

/** One photo, belonging to whichever category is on screen — a real link to
 *  the product (or the category, for the bundled fallback cover) rather
 *  than a control that changes what's shown, since that job now belongs
 *  only to the tabs above. */
function PhotoTile({ href, image, priority, layout }) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative flex aspect-4/3 min-w-0 overflow-hidden rounded-[1.75rem]',
        'shadow-[0_18px_40px_-20px_rgba(0,0,0,0.55)] transition-shadow duration-500 ease-out',
        'lg:aspect-auto',
        layout.position,
        layout.height
      )}
    >
      {image && (
        /* A plain <img>: see eslint.config.mjs. Taken out of flow so the
           photograph's own height never becomes the tile's — in flow, a
           percentage height on the img can't resolve against a parent
           whose own height depends on its content, and the tile balloons
           to the image's natural size. `cover` fills the tile edge to edge
           rather than sitting padded on a white plate. */
        <img
          src={image}
          alt=""
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 size-full object-cover transition-transform duration-600 ease-out group-hover:scale-[1.05] motion-reduce:transform-none"
        />
      )}
    </Link>
  );
}
