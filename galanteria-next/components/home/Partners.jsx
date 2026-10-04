'use client';

import Image from 'next/image';
import language from '@/lang';
import { useLang } from '@/components/providers/LanguageProvider';
import { Eyebrow, SectionTitle } from '@/components/ui/Section';

/**
 * The partner section.
 *
 * Each partner used to be split across two unrelated columns — its logo in
 * a grid on the right, its name and the paragraph about it stacked in an
 * accordion-style list on the left, with nothing on screen linking the two
 * halves but their shared position in two separate arrays. They're one
 * card each now: the logo, the name and the paragraph together, the way a
 * partner actually reads as a single relationship rather than a fact split
 * in half.
 */
export default function Partners() {
  const { lang, t } = useLang();
  const copy = language[lang]?.partners?.[0];

  if (!copy?.partnertitle) return null;

  const partners = [
    { name: copy.up, body: copy.down, logo: '/images/p1.avif', alt: 'Compotek SRL', width: 256, height: 71 },
    { name: copy.up2, body: copy.down2, logo: '/images/p2.png', alt: 'Rival Metal', width: 201, height: 74 },
  ];

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <div className="mb-[clamp(2rem,4vw,3.5rem)]">
        <Eyebrow>{t('eyebrowPartners')}</Eyebrow>
        <SectionTitle>{copy.partnertitle}</SectionTitle>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {partners.map((partner) => (
          <div
            key={partner.alt}
            className="group relative overflow-hidden rounded-[1.75rem] border border-line bg-card p-[clamp(1.75rem,3vw,2.5rem)] transition-colors duration-450 hover:border-line-hover"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-[radial-gradient(circle,rgba(217,119,54,0.14)_0%,transparent_70%)] opacity-0 transition-opacity duration-450 group-hover:opacity-100"
            />

            {/* Near-white artwork on transparency, so it belongs on the
                card's own dark ground rather than stretched loose beside
                the copy. */}
            <div className="relative flex h-16 items-center">
              <Image
                src={partner.logo}
                alt={partner.alt}
                width={partner.width}
                height={partner.height}
                className="h-auto max-h-14 w-auto max-w-[65%] object-contain"
              />
            </div>

            <h3 className="mt-6 border-t border-line pt-6 font-display text-lg font-normal leading-snug text-accent">
              {partner.name}
            </h3>
            <p className="mt-2 text-base leading-[1.75] text-ink-soft">{partner.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
