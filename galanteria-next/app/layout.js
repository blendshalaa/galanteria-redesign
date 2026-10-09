import { cookies } from 'next/headers';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { SUPPORTED_LANGS } from '@/i18n/ui';
import { SITE_URL } from '@/config/contact';

/**
 * The two families are self-hosted by next/font rather than requested from
 * fonts.googleapis.com. In the Vite build the same `@import url(...)` appeared
 * in index.css *and* in three component stylesheets, so every page made several
 * render-blocking requests for one set of fonts.
 *
 * Cormorant needs its italic: the homepage pull quote, the testimonials and the
 * footer's closing line are all set in it.
 */
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

/**
 * Site-wide metadata.
 *
 * This is the part of the migration the old site could not have: `useSEO` wrote
 * these tags from an effect *after* React mounted, so anything reading HTML
 * without executing JavaScript — most link unfurlers, and crawlers on their
 * first pass — saw only the static defaults in index.html, identical on every
 * route. Each page exports its own metadata now, rendered into the document.
 */
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Galanteria Group — Premium Office & Home Furniture',
    template: '%s | Galanteria Group',
  },
  description:
    'Galanteria Group designs and manufactures premium office and home furniture — office chairs, workstations, meeting tables and cabinets — for modern spaces across Kosovo and Europe.',
  applicationName: 'Galanteria Group',
  alternates: { canonical: '/' },
  /* The favicon itself now comes from app/icon.png — Next's own file
     convention generates its `<link rel="icon">` automatically, which used
     to coexist with this `icon` entry and with app/favicon.ico (the
     unreplaced default Next.js starter triangle, which browsers kept
     showing in the tab over the real logo). Only the apple-touch-icon
     still needs declaring by hand. */
  icons: { apple: '/favicon.png' },
  openGraph: {
    type: 'website',
    siteName: 'Galanteria Group',
    title: 'Galanteria Group — Premium Office & Home Furniture',
    description: 'Premium office and home furniture for modern spaces. Making furniture since 1987.',
    url: '/',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Galanteria Group — Premium Office & Home Furniture',
    description: 'Premium office and home furniture for modern spaces. Making furniture since 1987.',
    images: ['/og-image.jpg'],
  },
};

export const viewport = {
  themeColor: '#0E0D0B',
  colorScheme: 'dark',
};

/**
 * The root layout is deliberately thin: the document, the fonts and the
 * language context. The header and footer belong to the (site) group, so the
 * admin panel can render without them.
 *
 * The visitor's language used to live only in localStorage, which a server
 * component cannot read — so every request rendered English and the stored
 * choice was applied client-side after hydration. On a fast reload that
 * correction is near-instant; on a slow one, or on first paint before any JS
 * has run at all (the browser paints the streamed-in HTML before it even
 * starts downloading React), it was a visible flash of English before the
 * page snapped to Albanian or German. The language now also lives in a
 * cookie, which *does* travel with the request, so this can read it and
 * render the right language in the HTML that's sent — nothing to correct
 * after the fact.
 */
export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const storedLang = cookieStore.get('lang')?.value;
  const initialLang = SUPPORTED_LANGS.includes(storedLang) ? storedLang : 'en';

  return (
    <html lang={initialLang} className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased">
        <LanguageProvider initialLang={initialLang}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
