import SiteChrome from '@/components/SiteChrome';
import NotFoundContent from '@/components/NotFoundContent';

export const metadata = {
  title: '404 — Page not found',
  robots: { index: false, follow: false },
};

/**
 * The Vite app had no catch-all route at all, so a mistyped or expired URL
 * rendered the navbar, the footer and nothing in between. Two unused 404
 * components sat in the repo, neither ever imported.
 */
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundContent />
    </SiteChrome>
  );
}
