'use client';

import Link from 'next/link';
import language from '@/lang';
import { useLang } from '@/components/providers/LanguageProvider';
import ContactForm from '@/components/contact/ContactForm';
import { EMAILS, PHONES } from '@/config/contact';
import { cn } from '@/lib/cn';

/**
 * The contact page: a photo banner, three centred info cards in a row, then
 * the map beside the form — not the single-column stack this used to be.
 *
 * Phone numbers come from config/contact.js. They used to be hardcoded here
 * *and* in the footer, and the two lists had drifted apart, so the site
 * advertised different numbers on different pages.
 */
export default function ContactContent() {
  const { lang, t } = useLang();
  const copy = language[lang]?.contact?.[0] ?? {};

  return (
    <div className="min-h-screen bg-page text-ink">
      {/* --- Banner ---------------------------------------------------- */}
      <div className="relative flex h-[clamp(200px,28vw,320px)] items-end overflow-hidden border-b border-line pt-[var(--spacing-nav)]">
        {/* A plain <img>: see eslint.config.mjs. */}
        <img src="/images/about.png" alt="" className="absolute inset-0 size-full object-cover" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(10,9,8,0.95)_0%,rgba(10,9,8,0.55)_55%,rgba(10,9,8,0.35)_100%)]"
        />

        <div className="relative w-full py-8 pl-6 pr-gutter sm:py-15 sm:pl-[clamp(5rem,15vw,11rem)]">
          <h1 className="font-display text-3xl font-light leading-[1.08] tracking-tight text-ink sm:text-4xl">
            {copy.title}
          </h1>
          <nav aria-label="Breadcrumb" className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
            <Link href="/" scroll={false} className="transition-colors duration-150 hover:text-accent">
              {language[lang]?.menuHeader?.[0]?.name}
            </Link>
            <span aria-hidden="true" className="text-ink-muted">/</span>
            <span className="text-accent">{copy.title}</span>
          </nav>
        </div>
      </div>

      <div className="px-gutter pb-section pt-[clamp(2.5rem,5vw,4rem)]">
        <div className="mx-auto max-w-[1180px]">
          {/* --- Three ways to reach the showroom, centred rather than
              a left-aligned icon-and-text row. --- */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <InfoCard icon={<PinIcon />} label={t('labelLocation')}>
              <p>{copy.left12}</p>
              <p>{copy.left13}</p>
            </InfoCard>

            <InfoCard icon={<MailIcon />} label="Email">
              {EMAILS.map((email) => (
                <a
                  key={email.href}
                  href={email.href}
                  {...(email.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={contactLinkClasses}
                >
                  {email.label}
                </a>
              ))}
            </InfoCard>

            <InfoCard icon={<PhoneIcon />} label={t('labelPhone')}>
              {PHONES.map((phone) => (
                <a key={phone.href} href={phone.href} className={contactLinkClasses}>
                  {phone.label}
                </a>
              ))}
            </InfoCard>
          </div>

          {/* --- The map beside the form, not above a form that spans the
              full width on its own. --- */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-line shadow-[0_18px_40px_-20px_rgba(0,0,0,0.55)]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2921.754710513295!2d21.190889575659696!3d42.92021389952976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1354afa471710343%3A0xfeff29f135d13fa3!2sGalanteria%20sh.p.k!5e0!3m2!1sen!2s!4v1712843581952!5m2!1sen!2s"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Galanteria Showroom Map"
                className="h-full min-h-[380px] w-full border-0 grayscale-[0.3] contrast-[1.1]"
              />
              {/* The embed can't be restyled from the inside — this tints
                  it from the outside instead, so the map reads as part of
                  the page rather than a bright rectangle cut into it.
                  `pointer-events-none` keeps it panning and zooming under
                  the tint. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[#1a1815]/45 mix-blend-multiply"
              />
            </div>

            <section aria-label={t('contactFormTitle')}>
              <ContactForm />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

const contactLinkClasses =
  'block w-fit py-0.5 text-base text-ink-soft transition-[color,transform] duration-150 hover:translate-x-1 hover:text-accent';

function InfoCard({ icon, label, children }) {
  return (
    <div
      className={cn(
        'group relative flex flex-col items-center overflow-hidden rounded-[1.75rem] border border-line bg-card p-7 text-center',
        'transition-colors duration-450 hover:border-line-hover'
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-[radial-gradient(circle,rgba(217,119,54,0.14)_0%,transparent_70%)] opacity-0 transition-opacity duration-450 group-hover:opacity-100"
      />

      <span className="relative grid size-14 shrink-0 place-items-center rounded-full border border-line-hover bg-surface text-accent">
        {icon}
      </span>

      <span className="relative mt-4 text-xs font-semibold uppercase tracking-eyebrow text-accent">{label}</span>

      <div className="relative mt-3 flex flex-col items-center gap-1 text-base text-ink-soft">{children}</div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5v3c0 1.1-.9 2-2 2C11.3 19 5 12.7 5 5.5c0-1.1.9-2 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
