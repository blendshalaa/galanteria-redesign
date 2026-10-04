import { notFound } from 'next/navigation';
import { getCategories, getCategory, getProductsByCategory } from '@/lib/queries';
import { localized } from '@/i18n/ui';
import { SITE_URL } from '@/config/contact';
import CategoryBrowser from '@/components/category/CategoryBrowser';

/**
 * One page for every category, keyed by slug.
 *
 * The first page of products is fetched here, on the server, so a category page
 * arrives with its grid already in the HTML. In the Vite build this was an
 * empty shell that fetched after hydration — which is why none of the ten
 * category pages, the site's entire long-tail search surface, had any indexable
 * content or even a page title of their own.
 */

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) return { title: 'Category' };

  const name = localized(category, 'name', 'en');

  return {
    title: name,
    description: `${name} from Galanteria Group — premium office and home furniture, made in our own workshop since 1987.`,
    alternates: { canonical: `/category/${slug}` },
    openGraph: {
      title: `${name} | Galanteria Group`,
      description: `Browse our ${name.toLowerCase()} collection.`,
      url: `/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  const [category, { products, total, failed }] = await Promise.all([
    getCategory(slug),
    getProductsByCategory(slug),
  ]);

  /* An unknown slug is a 404 rather than an empty grid under a heading made out
     of the URL, which is what the SPA rendered. */
  if (!category && !failed) notFound();

  const name = localized(category, 'name', 'en');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name, item: `${SITE_URL}/category/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CategoryBrowser
        slug={slug}
        category={category}
        initialProducts={products}
        total={total}
        failed={failed}
      />
    </>
  );
}
