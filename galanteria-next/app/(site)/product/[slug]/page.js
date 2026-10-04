import { notFound } from 'next/navigation';
import { getCategories, getProduct, getRelatedProducts } from '@/lib/queries';
import { localized } from '@/i18n/ui';
import { SITE_URL } from '@/config/contact';
import ProductDetail from '@/components/product/ProductDetail';

/**
 * One product, by slug.
 *
 * The product's name, description and photographs are in the server-rendered
 * HTML, and `generateMetadata` gives every product its own title, description,
 * social image and Product schema. In the SPA all of that was written by an
 * effect after mount, so each product page shipped the same generic title and
 * nothing to unfurl.
 */

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return { title: 'Product not found', robots: { index: false } };

  const description =
    product.description?.slice(0, 300) || `${product.name} — furniture from Galanteria Group.`;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${slug}` },
    openGraph: {
      type: 'website',
      title: `${product.name} | Galanteria Group`,
      description,
      url: `/product/${slug}`,
      images: product.images?.[0] ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  const product = await getProduct(slug);
  if (!product) notFound();

  const [related, categories] = await Promise.all([getRelatedProducts(product), getCategories()]);

  const category = categories.find((entry) => entry.slug === product.category_slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || undefined,
    image: product.images?.length ? product.images : undefined,
    category: category ? localized(category, 'name', 'en') : undefined,
    brand: { '@type': 'Brand', name: 'Galanteria Group' },
    url: `${SITE_URL}/product/${slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={product} related={related} categories={categories} />
    </>
  );
}
