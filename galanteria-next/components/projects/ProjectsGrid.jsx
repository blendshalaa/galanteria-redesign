'use client';

import Link from 'next/link';
import language from '@/lang';
import { useLang } from '@/components/providers/LanguageProvider';
import { Arrow } from '@/components/ui/Button';
import { EmptyState, ErrorState } from '@/components/ui/states';
import { cn } from '@/lib/cn';

const PLACEHOLDER = 'https://placehold.co/800x600/1a1815/555?text=Galanteria';

/**
 * BottomLine is the Group's flagship project — the one the old site led
 * with as "project1" — so it's pinned as the hero banner regardless of
 * where `created_at` happens to put it, rather than always surfacing
 * whichever project was added most recently.
 */
const FEATURED_MATCH = 'bottomline';

/**
 * The project portfolio.
 *
 * This replaces a plain `aspect-square` grid — every tile the same shape,
 * nothing to look at besides the photos themselves — with the flagship
 * project running as a full-width hero banner, and the rest in a plain,
 * even-height row below it. Each tile still surfaces what the plain grid
 * didn't: an index, and the location/year pulled from the same fields the
 * admin panel and the detail page already collect, instead of only a
 * caption underneath the photo.
 */
export default function ProjectsGrid({ projects = [], failed = false }) {
  const { lang, t } = useLang();
  const copy = language[lang]?.projects?.[0] ?? {};

  const featuredIndex = projects.findIndex((project) => project.title?.toLowerCase().includes(FEATURED_MATCH));
  const featured = featuredIndex >= 0 ? projects[featuredIndex] : projects[0];
  const rest = projects.filter((_, index) => index !== (featuredIndex >= 0 ? featuredIndex : 0));

  return (
    <div className="min-h-screen bg-page text-ink">
      <header className="mx-auto flex max-w-[1180px] flex-col gap-6 px-gutter pb-[clamp(2rem,4vw,3rem)] pt-[calc(var(--spacing-nav-mobile)+2.5rem)] lg:pt-[calc(var(--spacing-nav)+clamp(2.5rem,6vw,4.5rem))]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-eyebrow text-accent">
              <span aria-hidden="true" className="h-px w-8 bg-line-hover" />
              Galanteria Group
            </div>

            <h1 className="mt-3 max-w-[20ch] font-display text-3xl font-light leading-[1.06] tracking-tight text-balance sm:text-4xl">
              {copy.title} <em className="italic text-accent">{copy.title2}</em>
            </h1>
          </div>

          {projects.length > 0 && (
            <span className="font-mono text-[11px] tracking-[0.2em] text-ink-muted">
              {String(projects.length).padStart(2, '0')} {t('projects')}
            </span>
          )}
        </div>
      </header>

      {failed && <ErrorState title={t('errorTitle')} description={t('errorBody')} />}

      {!failed && projects.length === 0 && <EmptyState description={t('noProjects')} />}

      {featured && (
        <div className="mx-auto max-w-[1180px] px-gutter pb-5">
          {/* Square on a phone, same as every tile below it — the wide
              banner shape only kicks in once there's a grid beside it to
              set it apart from. */}
          <ProjectTile project={featured} index={0} eager aspect="aspect-square sm:aspect-[16/9] lg:aspect-[21/9]" big />
        </div>
      )}

      {rest.length > 0 && (
        <ul className="mx-auto grid grid-cols-1 gap-5 max-w-[1180px] px-gutter pb-section sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((project, index) => (
            <li key={project.id}>
              <ProjectTile project={project} index={index + 1} eager={index < 2} aspect="aspect-square" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProjectTile({ project, index, eager = false, aspect, big = false }) {
  const meta = [project.location, project.year].filter(Boolean).join(' · ');

  return (
    <Link
      href={`/project/${project.slug}`}
      className={cn(
        'group relative block w-full overflow-hidden rounded-[1.75rem] bg-card shadow-[0_18px_40px_-20px_rgba(0,0,0,0.55)] transition-shadow duration-500 ease-out focus-visible:outline-offset-4',
        aspect
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.thumbnails?.[0] || project.images?.[0] || PLACEHOLDER}
        alt=""
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={(event) => {
          if (event.currentTarget.src !== PLACEHOLDER) event.currentTarget.src = PLACEHOLDER;
        }}
        className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transform-none"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(14,13,11,0.88)_0%,rgba(14,13,11,0.15)_45%,transparent_72%)] opacity-85 transition-opacity duration-400 group-hover:opacity-100"
      />

      <span className="absolute left-5 top-5 rounded-full bg-page/75 px-3.5 py-1.5 font-mono text-[11px] tracking-[0.2em] text-ink-muted backdrop-blur-sm">
        {String(index + 1).padStart(2, '0')}
      </span>

      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
        <span className="min-w-0">
          <span
            className={cn(
              'block truncate font-display italic leading-snug text-ink',
              big ? 'text-xl sm:text-2xl' : 'text-[0.95rem]'
            )}
          >
            {project.title}
          </span>
          {meta && (
            <span className="mt-1.5 block text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
              {meta}
            </span>
          )}
        </span>

        <span
          aria-hidden="true"
          className="grid size-11 shrink-0 translate-x-3 place-items-center rounded-full bg-accent text-[#16120c] opacity-0 transition-[opacity,transform] duration-450 ease-out group-hover:translate-x-0 group-hover:opacity-100"
        >
          <Arrow />
        </span>
      </span>
    </Link>
  );
}
