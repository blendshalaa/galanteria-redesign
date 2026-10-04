'use client';

import language from '@/lang';
import { useLang } from '@/components/providers/LanguageProvider';
import { Eyebrow, SectionTitle } from '@/components/ui/Section';

const SECTION_EYEBROW = { sq: 'Filozofia jonë', en: 'Our Philosophy', de: 'Unsere Philosophie' };
const SECTION_TITLE = { sq: 'Misioni dhe Vizioni', en: 'Mission & Vision', de: 'Mission & Vision' };

/**
 * Mission and vision, split out of the "who we are" hero into their own
 * section — two cards rather than two lines under the hero's paragraph,
 * each with its own icon so a reader can tell the two apart at a glance
 * instead of by which one comes first.
 */
export default function MissionVision() {
  const { lang } = useLang();
  const copy = language[lang]?.about?.[0] ?? {};

  if (!copy.bottom1 && !copy.bottom2) return null;

  const cards = [
    { key: 'mission', label: copy.bottom1, text: copy.bottom12, icon: <TargetIcon /> },
    { key: 'vision', label: copy.bottom2, text: copy.bottom21, icon: <CompassIcon /> },
  ];

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <div className="mb-[clamp(2rem,4vw,3rem)]">
        <Eyebrow>{SECTION_EYEBROW[lang] ?? SECTION_EYEBROW.en}</Eyebrow>
        <SectionTitle>{SECTION_TITLE[lang] ?? SECTION_TITLE.en}</SectionTitle>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {cards.map((card, index) => (
          <div
            key={card.key}
            className="group relative overflow-hidden rounded-[1.75rem] border border-line bg-card p-[clamp(1.75rem,3vw,2.5rem)] transition-colors duration-450 hover:border-line-hover"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-[radial-gradient(circle,rgba(217,119,54,0.14)_0%,transparent_70%)] opacity-0 transition-opacity duration-450 group-hover:opacity-100"
            />

            <div className="relative flex items-center justify-between">
              <span className="grid size-14 shrink-0 place-items-center rounded-full border border-line-hover bg-surface text-accent">
                {card.icon}
              </span>
              <span className="font-mono text-[11px] tracking-[0.2em] text-ink-muted">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            <h3 className="relative mt-6 font-display text-lg font-normal uppercase tracking-[0.1em] text-accent">
              {card.label}
            </h3>
            <p className="relative mt-3 text-base leading-[1.75] text-ink-soft">{card.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TargetIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 9l-2 6-6 2 2-6 6-2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
