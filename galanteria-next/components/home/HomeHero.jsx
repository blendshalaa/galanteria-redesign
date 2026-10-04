'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import language from '@/lang';
import { useLang } from '@/components/providers/LanguageProvider';
import { ButtonLink, Arrow } from '@/components/ui/Button';
import { SOCIALS } from '@/config/contact';

/**
 * The hero: a split editorial layout.
 *
 * The slideshow runs the full width behind everything and the copy sits on the
 * left of it. What keeps the type legible is a horizontal ramp rather than a
 * flat plate: nine tenths opaque under the wordmark, falling away to nothing by
 * the right edge. The photograph is still faintly there behind the copy — the
 * left column is not a black box — while the text never has to depend on
 * whatever contrast the current slide happens to offer.
 *
 * The column reads top to bottom as a single product-sheet: label, wordmark,
 * spec line, description, the row of choices, a rule, then one wide call to
 * action. The rule and the width of that button are what tie the block
 * together, so they share the same measure.
 *
 * Below the navbar's collapse breakpoint the two halves stack: photograph
 * first, copy underneath, and the section grows to whatever the copy needs
 * instead of being trapped in a fixed viewport-height box.
 */

const SOCIAL_MARKS = [
  { key: 'facebook', mark: 'fb', label: 'Facebook', href: SOCIALS.facebook },
  { key: 'instagram', mark: 'ig', label: 'Instagram', href: SOCIALS.instagram },
  { key: 'linkedin', mark: 'in', label: 'LinkedIn', href: SOCIALS.linkedin },
].filter((entry) => entry.href);

/** The measure the rule and the two buttons share. */
const BLOCK_WIDTH = 'w-full max-w-[clamp(15rem,21vw,19rem)]';

export default function HomeHero({ images = [] }) {
  const { lang, t } = useLang();

  /* Same fix as the About page: on desktop the slideshow becomes
     `lg:absolute lg:inset-0`, which throws off Next's scroll-into-view on
     client-side navigation to "/" — it was landing on the Popular Categories
     section instead of the top of the homepage. The links that point here
     pass `scroll={false}` to opt out of that heuristic; this is the scroll
     it was supposed to do instead. */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  return (
    <section className="relative block w-full overflow-hidden bg-page lg:flex lg:min-h-svh lg:items-stretch">
      {/* --- Slideshow ----------------------------------------------------
              Stacked, it is a band of its own above the copy — first in the
              source, so it is first on the page. Once the two sit side by side
              it leaves the flow entirely and becomes the background of the
              whole section, the rail and the copy included. */}
      <div className="relative z-0 h-[52svh] min-h-80 w-full overflow-hidden lg:absolute lg:inset-0 lg:h-full">
        <Swiper
          spaceBetween={0}
          centeredSlides
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination]}
          className="hero-swiper !absolute inset-0 z-0 size-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={image}>
              <div className="relative size-full overflow-hidden">
                {/* A plain <img>: these are Supabase Storage URLs the admin
                    uploader has already compressed — see eslint.config.mjs. */}
                <img
                  src={image}
                  alt=""
                  /* Only the first slide is above the fold; the rest were all
                     being downloaded at full size on page load. */
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  decoding={index === 0 ? 'sync' : 'async'}
                  className="size-full scale-[1.06] object-cover transition-transform duration-[6s] ease-out [.swiper-slide-active_&]:scale-100 motion-reduce:transform-none motion-reduce:transition-none"
                />

                {/* The ramp that makes the copy readable. It stops just short
                    of opaque — the photograph is still there behind the left
                    column, a few percent of it, rather than the column being a
                    black panel; the second gradient is there to keep the navbar
                    legible across the top. Stacked, it fades downward into the
                    page instead, because the copy is below it rather than on
                    top of it. */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(14,13,11,0.55)_0%,rgba(14,13,11,0.15)_40%,rgba(14,13,11,0.75)_88%,var(--color-page)_100%)] lg:bg-[linear-gradient(to_right,rgba(14,13,11,0.95)_0%,rgba(14,13,11,0.92)_30%,rgba(14,13,11,0.78)_50%,rgba(14,13,11,0.4)_68%,rgba(14,13,11,0.1)_86%,transparent_100%),linear-gradient(to_bottom,rgba(14,13,11,0.5)_0%,transparent_22%,transparent_72%,rgba(14,13,11,0.38)_100%)]" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* --- The left edge: the three words the workshop is built on, reading
              up the page under the navbar, with the social marks in a card
              pinned to the bottom corner. It has no room to sit beside the
              copy once the navbar itself collapses. */}
      <aside className="relative z-30 hidden border-r border-line lg:flex lg:flex-[0_0_clamp(54px,4.5vw,78px)] lg:flex-col lg:items-center lg:justify-between">
        <div
          aria-hidden="true"
          className="flex flex-col-reverse items-center gap-[clamp(1.25rem,3vh,2.25rem)] pt-[calc(var(--spacing-nav)+2.5rem)]"
        >
          <span className={railWordClasses}>{t('heroRailDesign')}</span>
          <span className={railWordClasses}>{t('heroRailMake')}</span>
          <span className={railWordClasses}>{t('heroRailQuality')}</span>
        </div>

        {/* Flush into the corner: no bottom margin, no rounding on the two
            edges that meet the viewport, so it reads as part of the frame
            rather than as a floating pill. */}
        <ul className="flex w-full flex-col items-center gap-5 rounded-tr-sm border-t border-r border-line bg-card py-7">
          {SOCIAL_MARKS.map((social) => (
            <li key={social.key}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="block rotate-180 text-xs font-semibold uppercase tracking-[0.08em] text-ink-soft transition-colors duration-250 [writing-mode:vertical-rl] hover:text-accent"
              >
                {social.mark}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* --- Copy -----------------------------------------------------------
              Capped at a little over half the width so the right of the
              photograph is left alone, which is where the ramp above has
              already faded to nothing. */}
      <div className="relative z-20 flex min-w-0 flex-1 flex-col justify-center overflow-hidden px-gutter pb-8 pt-12 lg:max-w-[56%] lg:pb-20 lg:pl-[clamp(1.5rem,3.5vw,4rem)] lg:pr-[clamp(1rem,2vw,2rem)] lg:pt-[calc(var(--spacing-nav)+2.5rem)]">
          {/* The oversized watermark, filling the empty corner the copy leaves.
              It is sized and placed to sit whole inside this column: pushed any
              further right, its last letter is sliced off by the column's
              `overflow-hidden` and the word reads as a mistake rather than as a
              mark. The right offset matches the column's own padding. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-0.12em] right-[clamp(1rem,2vw,2rem)] z-0 hidden select-none whitespace-nowrap font-display text-[clamp(7rem,13vw,13rem)] leading-[0.78] tracking-[-0.045em] text-ink/7 lg:block"
          >
            Galanteria
          </span>

          <div className="relative z-10">
            <p className="block text-xs font-semibold uppercase tracking-eyebrow text-accent-light">
              {t('heroSince')}
            </p>

            {/* The brand name at display size is the hero's anchor — it should
                very nearly fill the column, which is why the tracking is pulled
                in and the leading is set below 1. The headline copy in lang.js
                is a pull quote, which reads as the supporting line it always
                was rather than as an h1. */}
            <h1 className="mt-5 font-display text-[clamp(3.25rem,11vw,11rem)] font-semibold leading-[0.86] tracking-[-0.045em] text-ink">
              Galanteria
              {/* Aligned to the top of the line box rather than with
                  `vertical-align: super`, which would place it against the
                  x-height and scale unpredictably with the clamp. */}
              <sup className="ml-[0.04em] align-top font-sans text-[0.1em] font-semibold uppercase tracking-eyebrow text-accent">
                Group
              </sup>
            </h1>

            <p className="mt-8 text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
              {t('heroSpec')}
            </p>

            {/* Set in the body face at body size: in the reference this is the
                small paragraph under the article number, not a second headline
                competing with the wordmark above it. */}
            <p className="mt-3 max-w-[36ch] text-sm leading-[1.75] text-ink-soft">
              {language[lang]?.hero?.[0]?.title}
            </p>

            {/* The rule, then the two buttons on the same measure — "view
                collection" and "contact us" side by side rather than the
                category picker and a stacked, underlined second link. */}
            <hr className={`mt-[clamp(1.75rem,4vh,2.75rem)] border-0 border-t border-line ${BLOCK_WIDTH}`} />

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <ButtonLink href="#categories" className="px-6 py-3.5">
                {t('heroCta')}
                <Arrow />
              </ButtonLink>

              {/* Built by hand rather than through the shared `ghost`
                  variant: its border colour is a Tailwind utility of its
                  own, and a second one here for "white when inactive"
                  would compete with it for the same CSS property at equal
                  specificity — a coin flip in Tailwind's generated
                  stylesheet, the same issue the other hand-built buttons on
                  the site exist to avoid. */}
              <Link
                href="/Contact"
                className="group inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-ink bg-transparent px-6 py-3.5 font-sans text-sm font-semibold uppercase tracking-[0.1em] text-ink transition-all duration-200 hover:border-accent hover:text-accent"
              >
                {t('contactUs')}
                <Arrow className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
      </div>
    </section>
  );
}

const railWordClasses =
  'rotate-180 text-xs font-medium uppercase tracking-eyebrow text-ink-muted [writing-mode:vertical-rl]';
