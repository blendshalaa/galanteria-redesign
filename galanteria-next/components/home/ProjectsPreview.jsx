'use client';

import { useState } from 'react';
import Link from 'next/link';

import { Arrow } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

const PLACEHOLDER = 'https://placehold.co/800x600/1a1815/555?text=Galanteria';
const LIST_LIMIT = 4;

/** BottomLine is the Group's flagship project (see ProjectsGrid), so it
 *  opens this strip too rather than whichever project happens to be most
 *  recently added. */
const FEATURED_MATCH = 'bottomline';

/**
 * The projects strip, as a feature-and-filmstrip rather than a row of three
 * equal squares: a clickable rail of small project boxes on the left, with
 * its own "view all" underneath it, and the one currently chosen running
 * large on the right — each rail entry a candidate for that spot, not just
 * a photo in a row.
 *
 * The round arrows still cycle the featured project through the full list;
 * clicking a rail entry jumps straight to it. Either way it's the same
 * `index`, so the two controls never disagree about what's on screen.
 */
export default function ProjectsPreview({ projects = [], eyebrow, title, titleAccent, viewAllLabel }) {
  const defaultIndex = Math.max(
    0,
    projects.findIndex((project) => project.title?.toLowerCase().includes(FEATURED_MATCH))
  );
  const [index, setIndex] = useState(defaultIndex);

  if (projects.length === 0) return null;

  const featured = projects[index % projects.length];
  const canCycle = projects.length > 1;

  /* "Another photo from BottomLine" — a second entry for the same project,
     a different shot from its own gallery, pinned at the front of the rail
     rather than a second distinct project. Only appears when the featured
     project is BottomLine and actually has a second photo to show. */
  const altPhoto = featured.images?.[1] || featured.thumbnails?.[1];
  const showAltPhoto = index === defaultIndex && Boolean(altPhoto);

  const rail = projects
    .map((project, i) => ({ project, i }))
    .filter(({ i }) => i !== index % projects.length)
    .slice(0, showAltPhoto ? LIST_LIMIT - 1 : LIST_LIMIT)
    .map(({ project, i }) => ({ key: project.id, project, i, image: project.thumbnails?.[0] || project.images?.[0] }));

  if (showAltPhoto) {
    rail.unshift({ key: `${featured.id}-alt`, project: featured, i: index, image: altPhoto });
  }

  const prev = () => setIndex((current) => (current - 1 + projects.length) % projects.length);
  const next = () => setIndex((current) => (current + 1) % projects.length);

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
            <span aria-hidden="true" className="h-px w-8 bg-line-hover" />
            {eyebrow}
          </div>
          <h2 className="mt-3 font-display text-3xl font-normal leading-[1.05] text-ink sm:text-4xl">
            {title} <em className="italic text-accent">{titleAccent}</em>
          </h2>
        </div>

        {canCycle && (
          <div className="flex items-center gap-3">
            <NavButton direction="prev" onClick={prev} />
            <NavButton direction="next" onClick={next} />
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
        {/* On a phone the project currently showing runs first, the rail of
            other projects below it — not the rail first with the thing it
            controls buried under it. */}
        <div className="order-2 flex flex-col lg:order-1">
          {/* The rail: every other project, each one a candidate for the
              spot on the right rather than just a caption under its own
              photo. */}
          <ul className="flex flex-col gap-3">
            {rail.map(({ key, project, i, image }) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className="group flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-line bg-card p-3 text-left transition-colors duration-250 hover:border-line-hover"
                >
                  <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-surface">
                    <img
                      src={image || PLACEHOLDER}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      onError={(event) => {
                        if (event.currentTarget.src !== PLACEHOLDER) event.currentTarget.src = PLACEHOLDER;
                      }}
                      className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
                    />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold leading-snug text-ink">
                      {project.title}
                    </span>
                    <span className="mt-1 block font-mono text-[11px] tracking-[0.15em] text-ink-muted">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </span>

                  <Arrow className={cn('shrink-0 text-ink-muted transition-colors duration-250 group-hover:text-accent')} />
                </button>
              </li>
            ))}
          </ul>

          {/* Built by hand rather than through the shared `ghost` variant,
              to match the figures banner's "View Collection" button — same
              fix, same reason: a second border color fighting the
              variant's own at equal specificity is a coin flip in
              Tailwind's generated stylesheet, and here it was losing. */}
          <Link
            href="/Projects"
            className="group mt-6 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-accent/40 bg-transparent px-7 py-3.5 font-sans text-sm font-semibold uppercase tracking-[0.1em] text-ink transition-all duration-200 hover:border-accent hover:bg-accent/5 hover:text-accent"
          >
            {viewAllLabel}
            <Arrow className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* A plain <img>: see eslint.config.mjs. `key` remounts it per swap
            so the fade-in below replays instead of the old photo just
            sitting there while `src` changes underneath it. */}
        <Link
          key={featured.id}
          href={`/project/${featured.slug}`}
          className="group relative order-1 block aspect-4/3 overflow-hidden rounded-[1.75rem] bg-card shadow-[0_18px_40px_-20px_rgba(0,0,0,0.55)] motion-safe:animate-fade-in lg:order-2 lg:aspect-auto lg:min-h-[420px]"
        >
          <img
            src={featured.thumbnails?.[0] || featured.images?.[0] || PLACEHOLDER}
            alt=""
            loading="eager"
            decoding="async"
            onError={(event) => {
              if (event.currentTarget.src !== PLACEHOLDER) event.currentTarget.src = PLACEHOLDER;
            }}
            className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transform-none"
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(14,13,11,0.85)_0%,rgba(14,13,11,0.1)_45%,transparent_70%)]"
          />

          <span className="absolute left-5 top-5 rounded-full bg-page/75 px-3.5 py-1.5 font-mono text-[11px] tracking-[0.2em] text-ink-muted backdrop-blur-sm">
            {String((index % projects.length) + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>

          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
            <span className="max-w-[75%] font-display text-xl italic leading-snug text-on-photo">
              {featured.title}
            </span>

            <span
              aria-hidden="true"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-[#16120c] opacity-0 transition-[opacity,transform] duration-450 ease-out group-hover:translate-x-0 group-hover:opacity-100 lg:translate-x-3"
            >
              <Arrow />
            </span>
          </span>
        </Link>
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
      aria-label={isPrev ? 'Previous projects' : 'Next projects'}
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
