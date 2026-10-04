import SiteChrome from '@/components/SiteChrome';

/**
 * Everything a visitor sees wears the site's header and footer. The admin panel
 * is a sibling route group with none of it, which is what the SPA achieved by
 * declaring /admin outside `<Layout>` in App.jsx.
 */
export default function SiteLayout({ children }) {
  return <SiteChrome>{children}</SiteChrome>;
}
