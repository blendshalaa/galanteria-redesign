import { EMAILS, PHONES, SITE_URL } from '@/config/contact';
import ContactContent from '@/components/contact/ContactContent';

export const metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Galanteria Group. Visit our showroom in Podujevë, send us a message, or call us directly for premium furniture enquiries.',
  alternates: { canonical: '/Contact' },
  openGraph: {
    title: 'Contact Galanteria Group',
    description: 'Visit the showroom in Podujevë, send a message, or call us directly.',
    url: '/Contact',
  },
};

/**
 * Contact page.
 *
 * It used to contain no form at all — read-only info blocks and a map. A
 * visitor's only options were to dial a number, open their mail client or tap
 * WhatsApp, none of which the client could see or follow up on.
 */
export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: `${SITE_URL}/Contact`,
    mainEntity: {
      '@type': 'Organization',
      name: 'Galanteria Group',
      telephone: PHONES.map((phone) => phone.label),
      email: EMAILS[0]?.label,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContactContent />
    </>
  );
}
