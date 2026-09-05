/**
 * Single source of truth for the company's contact details.
 *
 * These were previously duplicated and had drifted apart: the footer advertised
 * +383 48 522 240 while the contact page advertised +383 44 259 469 and
 * +383 44 945 949. A visitor saw a different phone number depending on which
 * part of the page they looked at.
 *
 * All three numbers are kept here because it is not safe to guess which is
 * correct — confirm with the client and delete whichever are wrong.
 */

export const PHONES = [
  { label: '+383 44 259 469', href: 'tel:+38344259469' },
  { label: '+383 44 945 949', href: 'tel:+38344945949' },
  { label: '+383 48 522 240', href: 'tel:+38348522240' },
];

/** The number used for the floating WhatsApp button. */
export const WHATSAPP_NUMBER = '38348522240';

export const EMAILS = [
  { label: 'info@galanteriagroup.com', href: 'mailto:info@galanteriagroup.com' },
  {
    label: 'galanteriashpk@gmail.com',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=galanteriashpk@gmail.com',
    external: true,
  },
];

export const ADDRESS = {
  sq: 'Rr. Ismail Qemali, Podujevë - Kosovë',
  en: 'Rr. Ismail Qemali, Podujevë - Kosovo',
  de: 'Rr. Ismail Qemali, Podujevë - Kosovo',
};

export const SOCIALS = {
  instagram: 'https://www.instagram.com/galanteriashpk/',
  facebook: 'https://www.facebook.com/p/Galanteria-SHPK-100063493750911/',
  linkedin: 'https://www.linkedin.com/in/galanteria-l-l-c-94282530b/',
};

export const SITE_URL = 'https://www.galanteriagroup.com';
