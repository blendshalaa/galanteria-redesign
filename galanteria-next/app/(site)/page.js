import { getCategories, getCategoryPreviewImages, getHeroImages, getTestimonials, getProjects } from '@/lib/queries';
import { FALLBACK_HERO_IMAGES } from '@/config/categoryImages';
import { SITE_URL, PHONES, EMAILS } from '@/config/contact';

import HomeHero from '@/components/home/HomeHero';
import CategoryBento from '@/components/home/CategoryBento';
import StoryBand, { ProjectsSection } from '@/components/home/StoryBand';
import Testimonials from '@/components/home/Testimonials';
import Partners from '@/components/home/Partners';
import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'Galanteria Group — Premium Office & Home Furniture',
  alternates: { canonical: '/' },
};

/**
 * The homepage.
 *
 * Everything here is fetched on the server: the slideshow's photographs, the
 * category tiles and the testimonials are all in the HTML that arrives. In the
 * Vite build each of those was a separate `useEffect` after hydration, so the
 * page painted as a dark empty column and filled in a beat later.
 *
 * The sections themselves are client components only because their headings
 * come from lang.js and the visitor's language is a browser-side choice.
 */
export default async function HomePage() {
  const [heroImages, categories, testimonials, { projects }] = await Promise.all([
    getHeroImages(),
    getCategories(),
    getTestimonials(),
    getProjects(),
  ]);

  /* A few real product photos per category, so the homepage's category
     tiles can show what's actually in a category instead of one photo per
     category shown side by side. */
  const categoryPreviews = await getCategoryPreviewImages(categories.map((category) => category.slug));

  /* The bundled photographs are the fallback for an empty `hero_images` table,
     not the source — that inversion is why the admin panel's "Hero Slider" tab
     appeared to do nothing at all. */
  const images = heroImages.length > 0 ? heroImages : FALLBACK_HERO_IMAGES;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FurnitureStore',
    name: 'Galanteria Group',
    url: SITE_URL,
    description: 'Premium office and home furniture manufacturer, established 1987.',
    telephone: PHONES[0]?.label,
    email: EMAILS[0]?.label,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rr. Ismail Qemali',
      addressLocality: 'Podujevë',
      addressCountry: 'XK',
    },
    foundingDate: '1987',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <HomeHero images={images} />

      <Section id="categories">
        <CategoryBento categories={categories} categoryPreviews={categoryPreviews} />
      </Section>

      {/* `style` rather than a `pt-0` class: Section's own `py-section`
          sets padding-top too, and a second utility fighting it for the
          same property is a coin flip in Tailwind's generated stylesheet —
          inline style always wins regardless of that ordering. */}
      <Section sunken style={{ paddingTop: 0, paddingBottom: 0 }}>
        <StoryBand />
      </Section>

      {/* Client References before the projects grid now, not after it. */}
      <Section>
        <Testimonials testimonials={testimonials} />
      </Section>

      <Section sunken>
        <ProjectsSection projects={projects} />
      </Section>

      <Section>
        <Partners />
      </Section>
    </>
  );
}
