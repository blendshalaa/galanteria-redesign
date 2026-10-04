import { getSetting } from '@/lib/queries';
import { SITE_URL } from '@/config/contact';
import AboutContent from '@/components/about/AboutContent';
import MissionVision from '@/components/about/MissionVision';
import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'About Us',
  description:
    'Galanteria Group has been making furniture since 1987. Learn about our workshop, our partners and how we furnish offices, schools and hotels.',
  alternates: { canonical: '/Aboutus' },
  openGraph: {
    title: 'About Galanteria Group',
    description: 'Making furniture since 1987 — our workshop, our partners, our work.',
    url: '/Aboutus',
  },
};

/**
 * About page.
 *
 * The admin panel's settings tab has always saved an `about_text` setting with
 * Albanian, English and German versions — and this page always read lang.js
 * instead, so nothing the client typed there ever appeared anywhere. It prefers
 * the database value and falls back to lang.js, which means the existing copy
 * keeps showing until the client edits it.
 */
export default async function AboutPage() {
  const aboutText = await getSetting('about_text');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: `${SITE_URL}/Aboutus`,
    mainEntity: {
      '@type': 'Organization',
      name: 'Galanteria Group',
      foundingDate: '1987',
      url: SITE_URL,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AboutContent aboutText={aboutText} />

      <Section>
        <MissionVision />
      </Section>
    </>
  );
}
