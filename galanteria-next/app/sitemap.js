import { getSitemapEntries } from '@/lib/queries';
import { SITE_URL } from '@/config/contact';

/**
 * The sitemap, generated from the live catalogue on every revalidation.
 *
 * It used to be `scripts/generate-sitemap.mjs`, a build-time script with its
 * own hand-rolled .env reader and its own Supabase fetch helper, which someone
 * had to remember to run (`npm run sitemap`) before each deploy. The sitemap
 * can no longer be older than the catalogue.
 */
export const revalidate = 3600;

export default async function sitemap() {
  const { categories, products, projects } = await getSitemapEntries();
  const now = new Date();

  const staticRoutes = [
    { url: '/', priority: 1, changeFrequency: 'weekly' },
    { url: '/Projects', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/Aboutus', priority: 0.6, changeFrequency: 'yearly' },
    { url: '/Contact', priority: 0.7, changeFrequency: 'yearly' },
  ].map((route) => ({
    url: `${SITE_URL}${route.url}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return [
    ...staticRoutes,
    ...categories.map((category) => ({
      url: `${SITE_URL}/category/${category.slug}`,
      lastModified: category.updated_at ? new Date(category.updated_at) : now,
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${SITE_URL}/product/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
    ...projects.map((project) => ({
      url: `${SITE_URL}/project/${project.slug}`,
      lastModified: project.updated_at ? new Date(project.updated_at) : now,
      changeFrequency: 'monthly',
      priority: 0.6,
    })),
  ];
}
