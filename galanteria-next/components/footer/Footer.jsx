'use client';

import Image from 'next/image';
import Link from 'next/link';
import language from '@/lang';
import { localized } from '@/i18n/ui';
import { useLang } from '@/components/providers/LanguageProvider';
import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import WhatsAppLink from '@/components/contact/WhatsAppLink';
import { EMAILS, PHONES, SOCIALS, WHATSAPP_NUMBER } from '@/config/contact';

/**
 * The footer, including the closing call to action.
 *
 * Like the navbar, its category links come from the layout's server render
 * rather than a fetch of its own — which also means they are in the HTML a
 * crawler sees, which is the entire reason that column exists.
 *
 * The columns used to be five flat lists side by side, sharing nothing but
 * a gap. The brand block now sits apart with its own social row of round
 * icon buttons — the same shape the rest of the site uses for a control
 * rather than a bare word — and the three link columns share a rule
 * between them, so the row reads as one connected block instead of five
 * lists that happen to be adjacent.
 */
export default function Footer({ categories = [] }) {
  const { lang, t } = useLang();

  return (
    <footer className="overflow-hidden border-t border-line bg-sunken text-ink">
      {/* --- Closing call to action ---------------------------------------
          A photograph now, not plain ground: the room sofahero.png frames
          is deliberately empty on its left two-thirds, which is exactly
          where the copy sits, so the overlay only has to carry legibility
          over the sofa's own corner rather than the whole banner.
          `contain` within a shortened box, not `cover` filling a tall one —
          the photo's own wide, short crop stays intact instead of being
          stretched to a taller banner than it was shot for. */}
      <div className="relative h-[clamp(240px,34vw,360px)] overflow-hidden border-b border-line bg-page">
        <Image
          src="/images/sofahero3.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.8)_42%,rgba(0,0,0,0.45)_70%,rgba(0,0,0,0.18)_100%)]"
        />

        <div className="absolute inset-0 flex items-center pl-[clamp(2rem,16vw,12rem)] pr-gutter">
          <div className="flex max-w-[480px] flex-col items-start gap-[clamp(1rem,2vw,1.5rem)] text-left">
            <span className="rounded-full border border-accent/40 bg-page/40 px-3.5 py-1 text-[0.7rem] font-semibold uppercase tracking-eyebrow text-accent backdrop-blur-sm">
              {t('eyebrowContact')}
            </span>

            <h2 className="font-display text-2xl font-light leading-[1.1] tracking-tight text-balance text-ink">
              {t('footerCtaLead')} <br />
              <em className="inline-block italic text-accent">{t('footerCtaEmph')}</em>
            </h2>

            <ButtonLink href="/Contact" className="px-6 py-3 text-xs hover:-translate-y-0.5">
              {t('contactUs')}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* --- Brand + columns ------------------------------------------------ */}
      <div className="mx-auto grid max-w-shell grid-cols-1 gap-x-8 gap-y-12 px-gutter py-[clamp(3rem,6vw,5rem)] lg:grid-cols-[1.3fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-6">
          {/* 120×88 keeps the file's real 1.37 ratio; the old markup said
              120×90. */}
          <Image src="/images/LOGO_G.png" alt="Galanteria Group" width={120} height={88} className="h-auto w-14 object-contain" />
          <p className="max-w-[38ch] text-base leading-[1.75] text-ink-soft">{t('footerTagline')}</p>

          <div className="mt-1 flex items-center gap-3">
            <SocialIcon href={SOCIALS.instagram} label="Instagram">
              <path d="M8 1.5h4a6.5 6.5 0 0 1 6.5 6.5v4a6.5 6.5 0 0 1-6.5 6.5H8A6.5 6.5 0 0 1 1.5 12V8A6.5 6.5 0 0 1 8 1.5Z" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="10" cy="10" r="3.4" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="15" cy="5" r="1" fill="currentColor" />
            </SocialIcon>
            <SocialIcon href={SOCIALS.facebook} label="Facebook">
              <path
                d="M13 7h-1.5c-.7 0-1 .4-1 1.1V10H13l-.3 2.4h-2.2V19H8V12.4H6.3V10H8V8.3C8 6.3 9.1 5 11.1 5H13v2Z"
                fill="currentColor"
              />
            </SocialIcon>
            <SocialIcon href={SOCIALS.linkedin} label="LinkedIn">
              <path d="M6.5 8.5v9M6.5 5.5v.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path
                d="M11 17.5v-5c0-1.4.9-2.3 2.2-2.3S15 11 15 12.5v5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path d="M11 8.5v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </SocialIcon>
          </div>
        </div>

        <nav aria-label="Footer" className={columnClasses}>
          <ColumnLabel>{t('navigation')}</ColumnLabel>
          <Link href="/" scroll={false} className={footerLinkClasses}>{language[lang]?.menuHeader?.[0]?.name}</Link>
          <Link href="/Projects" className={footerLinkClasses}>{language[lang]?.menuHeader?.[12]?.name}</Link>
          <Link href="/Aboutus" scroll={false} className={footerLinkClasses}>{language[lang]?.menuHeader?.[15]?.name}</Link>
          <Link href="/Contact" className={footerLinkClasses}>{language[lang]?.menuHeader?.[14]?.name}</Link>
        </nav>

        {categories.length > 0 && (
          <nav aria-label="Categories" className={columnClasses}>
            <ColumnLabel>{t('allCategories')}</ColumnLabel>
            {categories.slice(0, 6).map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`} className={footerLinkClasses}>
                {localized(category, 'name', lang)}
              </Link>
            ))}
          </nav>
        )}

        <div className={columnClasses}>
          <ColumnLabel>{t('contactLabel')}</ColumnLabel>
          {/* These used to be hardcoded here and again on the contact page, and
              the two had drifted apart: the footer advertised one number while
              the contact page advertised two entirely different ones. */}
          {PHONES.map((phone) => (
            <a key={phone.href} href={phone.href} className={footerLinkClasses}>
              {phone.label}
            </a>
          ))}
          <a href={EMAILS[0].href} className={footerLinkClasses}>{EMAILS[0].label}</a>
          <div className="mt-2">
            <WhatsAppLink phoneNumber={WHATSAPP_NUMBER} />
          </div>
        </div>
      </div>

      {/* --- Legal bar -----------------------------------------------------
          `px-gutter` sits on this same `max-w-shell` box, not on an
          unconstrained wrapper around it — on that wrapper, the padding
          and the shell's own centering compounded into one extra gutter's
          worth of offset versus the columns above, which do it this way. */}
      <div className="border-t border-line py-6">
        <div className="mx-auto flex max-w-shell flex-col items-start justify-between gap-4 px-gutter sm:flex-row sm:items-center">
          <span className="text-xs tracking-[0.04em] text-ink-muted">
            © {new Date().getFullYear()} Galanteria Group. {t('rightsReserved')}
          </span>
          
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex cursor-pointer items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-ink-muted transition-colors duration-250 hover:text-accent"
          >
            {t('backToTop')}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-250 group-hover:-translate-y-0.5">
              <path d="M8 12V4M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}

const columnClasses = 'flex flex-col items-start gap-2 lg:border-l lg:border-line lg:pl-8';

const footerLinkClasses =
  'inline-block w-fit py-0.5 text-base text-ink-soft transition-[color,transform] duration-150 hover:translate-x-1 hover:text-accent';

function ColumnLabel({ children }) {
  return (
    <span className="mb-6 flex items-center gap-4 text-xs font-bold uppercase tracking-eyebrow text-accent">
      {children}
      <span className="h-px max-w-15 flex-1 bg-gradient-to-r from-accent-glow to-transparent" />
    </span>
  );
}

/** A round, bordered icon button — the same control shape the rest of the
 *  site uses for "cycle" or "go" (the projects and testimonials arrows),
 *  rather than a bare word in a list. */
function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        'grid size-10 shrink-0 place-items-center rounded-full border border-line-hover text-ink-soft',
        'transition-colors duration-250 hover:border-accent hover:text-accent'
      )}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        {children}
      </svg>
    </a>
  );
}
