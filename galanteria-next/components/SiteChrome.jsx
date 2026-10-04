import { getCategories } from '@/lib/queries';
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/footer/Footer';
import SkipLink from '@/components/navbar/SkipLink';

/**
 * The public site's furniture: skip link, header, main, footer.
 *
 * It lives in a component rather than only in `app/(site)/layout.js` because
 * `app/not-found.js` renders against the *root* layout — a 404 would otherwise
 * arrive with no navigation, which is the one page where a visitor most needs
 * a way out.
 *
 * The category list is read once here and handed to both the header menu and
 * the footer's category column. In the SPA each of them fetched it separately,
 * on every route change.
 */
export default async function SiteChrome({ children }) {
  const categories = await getCategories();

  return (
    <>
      <SkipLink />
      <NavBar categories={categories} />
      <main id="main-content" className="animate-page-entrance">
        {children}
      </main>
      <Footer categories={categories} />
    </>
  );
}
