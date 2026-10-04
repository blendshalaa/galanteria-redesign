'use client';

import Link from 'next/link';

import language from '@/lang';
import { useLang } from '@/components/providers/LanguageProvider';
import { Arrow } from '@/components/ui/Button';
import ProjectsPreview from '@/components/home/ProjectsPreview';
import Counter from '@/components/home/Counter';

/**
 * The "our work in numbers" banner.
 *
 * Split from the projects grid now — Testimonials sits between them on the
 * page, where "Client References" used to come after both. `ProjectsSection`
 * below is the other half, exported separately so the page can place it
 * after Testimonials instead of right here.
 */
export default function StoryBand() {
  const { t } = useLang();

  const stats = [
    { value: '1000+', label: t('statsProjects') },
    { value: '200+', label: t('statsClients') },
    { value: '15+', label: t('statsYears') },
  ];

  return <FiguresBanner stats={stats} t={t} />;
}

/** The projects grid and its heading, split out so the page can put
 *  Testimonials between this and the figures banner above. */
export function ProjectsSection({ projects = [] }) {
  const { lang, t } = useLang();
  const projectCopy = language[lang]?.projects?.[0] ?? {};

  return (
    <ProjectsPreview
      projects={projects}
      eyebrow={t('eyebrowProjects')}
      title={projectCopy.title}
      titleAccent={projectCopy.title2}
      viewAllLabel={t('viewProjects')}
    />
  );
}

/** The "figures" strip, reworked from a plain list of numbers into a
 *  self-contained promo banner: the lamp hanging in from the very top of the
 *  section, the chair cropped in at the edge rather than posed whole, and
 *  no card of its own — it runs the full width of the viewport instead of
 *  sitting inside the page's own margins, the way the reference bleeds off
 *  both sides. */
function FiguresBanner({ stats, t }) {
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2">
      <div className="grid grid-cols-1 items-end gap-10 overflow-hidden px-[clamp(1.5rem,4vw,3.5rem)] pb-[clamp(2.25rem,5vw,3.5rem)] lg:grid-cols-[minmax(0,200px)_1fr_minmax(0,260px)] lg:gap-[clamp(1.5rem,3vw,3rem)]">
        {/* The lamp: no top padding of its own, so the cord runs straight
            up into the section above instead of hanging centred with a
            gap over it. */}
        <div className="relative order-2 hidden justify-center self-start lg:order-1 lg:flex">
          <span
            aria-hidden="true"
            className="absolute inset-x-[8%] top-0 bottom-[15%] rounded-full bg-[radial-gradient(circle,rgba(217,119,54,0.2)_0%,rgba(217,119,54,0.05)_60%,transparent_100%)]"
          />
          {/* A plain <img>: see eslint.config.mjs. `origin-top` pivots the
              sway at the cord's own top rather than the image's centre, so
              it reads as the lamp swinging rather than the whole thing
              sliding side to side. */}
          <img
            src="/images/lamp.png"
            alt=""
            className="relative w-[70%] origin-top animate-sway motion-reduce:animate-none"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="order-1 flex flex-col items-start pt-[clamp(2.25rem,5vw,3.5rem)] lg:order-2">
          <p className="text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
            {t('figuresKickerBefore')} <span className="text-accent">1987</span> {t('figuresKickerAfter')}
          </p>

          <h3 className="mt-3 font-display text-2xl font-normal leading-[1.15] text-ink sm:text-3xl">
            {t('figuresHeading')}
          </h3>

          {/* The three numbers, set out like a countdown strip — a divider
              between each rather than a shared grid gutter. On a phone the
              strip stacks into a single left-aligned column instead: wrapped
              onto two rows, the divider before the third number landed with
              nothing above it to divide, reading as a stray line rather than
              a separator. */}
          <dl className="mt-7 flex w-full flex-col items-start gap-5 border-t border-line pt-6 lg:flex-row lg:flex-wrap lg:gap-x-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={index > 0 ? 'lg:border-l lg:border-line lg:pl-8' : undefined}
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-3xl font-light leading-none tracking-tight text-accent">
                    <Counter value={stat.value} />
                  </span>
                  {/* Was rgba(240,237,232,0.4) — 3.1:1 on this background,
                      below the WCAG AA floor for small text. */}
                  <span className="mt-2 block text-xs font-semibold uppercase leading-normal tracking-[0.12em] text-ink-muted">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          {/* Built by hand rather than through the shared `ghost` variant:
              its border color is a Tailwind utility of its own, and once
              this banner dropped its card background that border read too
              faint to tell the control apart from plain text — a second,
              more visible border color competed with the variant's own at
              equal specificity with an unpredictable winner. */}
          <Link
            href="#categories"
            className="group mt-11 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-accent/40 bg-transparent px-7 py-3.5 font-sans text-sm font-semibold uppercase tracking-[0.1em] text-ink transition-all duration-200 hover:border-accent hover:bg-accent/5 hover:text-accent"
          >
            {t('heroCta')}
            <Arrow className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* The chair: full height, not half — cropped horizontally instead,
            pushed past the row's own right edge so the screen itself cuts
            it off rather than the chair standing whole in its column. The
            row above clips it: no overflow-hidden here, or the crop would
            happen at this column's edge instead of the true edge. */}
        <div className="relative order-3 hidden self-end lg:order-3 lg:block">
          <span
            aria-hidden="true"
            className="absolute inset-y-[10%] left-[14%] w-[70%] translate-x-24 rounded-full bg-[radial-gradient(circle,rgba(217,119,54,0.2)_0%,rgba(217,119,54,0.05)_60%,transparent_100%)]"
          />
          {/* A plain <img>: see eslint.config.mjs. */}
          <img
            src="/images/deal-chair.png"
            alt=""
            className="relative w-[300px] max-w-none translate-x-24"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
}
