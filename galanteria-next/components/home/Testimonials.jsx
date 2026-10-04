'use client';

import { useMemo, useState } from 'react';

import language from '@/lang';
import { useLang } from '@/components/providers/LanguageProvider';

/**
 * Client references.
 *
 * They come from the database; the copy in lang.js is the fallback for an
 * empty table.
 *
 * One reference at a time now, on its own card beside the heading, rather
 * than a masonry of every quote at once — these are letters from ministries
 * and agencies that run from two lines to two hundred words, and a column
 * grid let the longest one set the section's whole rhythm. A pair of arrows
 * cycles through them instead; there's no "see all" any more, just the
 * arrows and whichever one is on screen.
 */

export default function Testimonials({ testimonials = [] }) {
  const { lang, t } = useLang();
  const [index, setIndex] = useState(0);
  /* Which way the last swap came from, so the new card slides in from the
     side its arrow points to rather than always the same direction. */
  const [direction, setDirection] = useState(1);

  const fallback = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        id: `lang-${i}`,
        name: language[lang]?.clients?.[0]?.[`name${i + 1}`],
        text: language[lang]?.clients?.[0]?.[`text${i + 1}`],
        company: null,
      })).filter((entry) => entry.name),
    [lang]
  );

  const entries = testimonials.length > 0 ? testimonials : fallback;
  if (entries.length === 0) return null;

  const active = entries[index % entries.length];
  const canCycle = entries.length > 1;

  const prev = () => {
    setDirection(-1);
    setIndex((current) => (current - 1 + entries.length) % entries.length);
  };
  const next = () => {
    setDirection(1);
    setIndex((current) => (current + 1) % entries.length);
  };

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-[clamp(2rem,5vw,4rem)]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
            {t('client')}
            <span className="rounded-full bg-accent/15 px-3 py-1 text-[0.7rem] font-semibold text-accent">
              {t('eyebrowClients')}
            </span>
          </div>

          <h2 className="mt-4 font-display text-3xl font-normal leading-[1.1] text-ink sm:text-4xl">
            {language[lang]?.clients?.[0]?.title}
          </h2>

          <p className="mt-4 max-w-[42ch] text-base leading-[1.7] font-light text-ink-soft">
            {t('clientsIntro')}
          </p>

          {canCycle && (
            <div className="mt-8 flex items-center gap-3">
              <NavButton direction="prev" onClick={prev} />
              <NavButton direction="next" onClick={next} />
            </div>
          )}
        </div>

        {/* `overflow-hidden` keeps the slide-in from flashing past the
            card's own edge on entry; `key` forces a fresh mount per swap so
            the animation replays instead of the old card just re-rendering
            in place. */}
        <div className="overflow-hidden rounded-[1.75rem]">
          <FeaturedCard key={active.id} entry={active} fallbackRole={t('client')} direction={direction} />
        </div>
      </div>
    </div>
  );
}

function NavButton({ direction, onClick }) {
  const isPrev = direction === 'prev';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? 'Previous testimonial' : 'Next testimonial'}
      className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-line-hover text-ink-soft transition-colors duration-250 hover:border-accent hover:text-accent"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d={isPrev ? 'M10 3 5 8l5 5' : 'M6 3l5 5-5 5'}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/** The one card the section leads with: the quote first, the attribution
 *  and a large quote mark grounding it beneath, the way the reference gives
 *  the words themselves the top of the card. */
function FeaturedCard({ entry, fallbackRole, direction }) {
  return (
    <figure
      style={{ '--slide-from': direction < 0 ? '-24px' : '24px' }}
      className="animate-slide-in rounded-[1.75rem] border border-line bg-card p-[clamp(1.75rem,3vw,2.75rem)] motion-reduce:animate-none"
    >
      <blockquote className="text-base leading-[1.8] text-ink-soft">{strip(entry.text)}</blockquote>

      <figcaption className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-6">
        <span className="flex min-w-0 items-center gap-4">
          <span
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface text-sm font-semibold uppercase text-accent"
          >
            {initials(entry.name)}
          </span>

          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold leading-snug text-ink">{entry.name}</span>
            <span className="mt-1 block text-xs uppercase tracking-[0.1em] text-ink-muted">
              {entry.company || fallbackRole}
            </span>
          </span>
        </span>

        <span aria-hidden="true" className="shrink-0 text-6xl leading-none text-accent/30">
          &rdquo;
        </span>
      </figcaption>
    </figure>
  );
}

/** Two letters for the monogram: the first of each of the first two words. */
function initials(name = '') {
  return name
    .split(/[\s–—-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

/**
 * Most of these quotes arrive already wrapped in typographic quote marks, and a
 * few do not. The card supplies its own mark, so any that came with the text
 * are taken off rather than doubled.
 */
function strip(text = '') {
  return text.trim().replace(/^[“"”]+/, '').replace(/[“"”]+$/, '');
}
