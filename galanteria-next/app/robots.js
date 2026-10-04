import { SITE_URL } from '@/config/contact';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      /* The admin panel has no reason to be indexed. This is a courtesy to
         crawlers, not a security measure — access is controlled by Supabase
         Auth and the Row Level Security policies in supabase/migrations/. */
      disallow: '/admin',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
