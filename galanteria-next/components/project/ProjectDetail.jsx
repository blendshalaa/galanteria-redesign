'use client';

import { useState } from 'react';
import { useLang } from '@/components/providers/LanguageProvider';
import DetailHeader from '@/components/detail/DetailHeader';
import Lightbox from '@/components/lightbox/Lightbox';

/**
 * Project detail view.
 *
 * The version this replaces crashed: the gallery rendered `data.name2[index]`
 * as a caption, but `name2` was never part of what the loader passed in, so any
 * project with at least one photo threw a TypeError and blanked the page. The
 * description was also fetched and never displayed.
 */
export default function ProjectDetail({ project }) {
  const { t } = useLang();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const photos = project.images || [];
  const thumbs = project.thumbnails?.length ? project.thumbnails : photos;
  const meta = [project.location, project.year].filter(Boolean).join(' · ');

  return (
    <div className="min-h-screen bg-page text-ink">
      <DetailHeader
        crumbs={[
          { label: t('home'), href: '/' },
          { label: t('projects'), href: '/Projects' },
        ]}
        current={project.title}
      />

      <div className="mx-auto grid max-w-shell grid-cols-1 items-center gap-[clamp(2rem,5vw,4rem)] px-gutter pb-[clamp(3rem,6vw,5rem)] pt-[clamp(1.5rem,4vw,2.5rem)] lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="relative min-w-0">
          {photos[0] && (
            <button
              type="button"
              onClick={() => setLightboxIndex(0)}
              aria-label={`${project.title} — ${t('gallery')}`}
              className="group block w-full cursor-zoom-in focus-visible:outline-offset-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photos[0]}
                alt={project.title}
                decoding="async"
                /* Was a fixed 600×440 box stepped down at two breakpoints, so
                   the photograph was a different, unrelated size at 1101px and
                   at 1099px. */
                className="aspect-4/3 w-full rounded-lg border border-line bg-card object-cover transition-[border-color,box-shadow] duration-250 group-hover:border-line-hover group-hover:shadow-lg"
              />
            </button>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          {meta && (
            <p className="font-sans text-xs font-semibold uppercase tracking-eyebrow text-accent">{meta}</p>
          )}
          <h1 className="font-display text-2xl font-light leading-[1.08] tracking-tight text-balance text-ink">
            {project.title}
          </h1>
          {project.description && (
            <p className="mt-1 max-w-[52ch] whitespace-pre-line text-base leading-[1.75] text-ink-soft">
              {project.description}
            </p>
          )}
        </div>
      </div>

      {photos.length > 0 && (
        /* Was a centred flex row of fixed 320×240 tiles, so the last row
           floated in the middle of the page and the tiles never lined up with
           the hero above them. */
        <div className="mx-auto grid max-w-shell grid-cols-2 gap-2 px-gutter pb-section sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] sm:gap-4">
          {photos.map((photo, index) => (
            <button
              type="button"
              key={photo}
              onClick={() => setLightboxIndex(index)}
              aria-label={`${project.title} ${index + 1}`}
              className="group aspect-4/3 cursor-zoom-in overflow-hidden rounded-md border border-line bg-card focus-visible:outline-offset-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbs[index] || photo}
                alt={`${project.title} ${index + 1}`}
                loading="lazy"
                decoding="async"
                className="size-full object-cover transition-transform duration-600 group-hover:scale-[1.05] motion-reduce:transform-none"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={photos}
          startIndex={lightboxIndex}
          alt={project.title}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
