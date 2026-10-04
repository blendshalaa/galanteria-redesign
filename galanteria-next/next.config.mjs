/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * The ten category paths that were hardcoded routes in the original site,
   * each passing an Albanian display name as both the query key and the page
   * heading. They were client-side `<Navigate>` redirects in App.jsx; here they
   * are permanent HTTP redirects, which is what an indexed URL or an old
   * bookmark actually deserves.
   */
  async redirects() {
    const legacyCategories = {
      '/OfficeChairs': 'office-chairs',
      '/MeetingChairs': 'meeting-chairs',
      '/WaitingChairs': 'waiting-chairs',
      '/WorkingTable': 'working-tables',
      '/Workstation': 'workstations',
      '/MeetingTable': 'meeting-tables',
      '/Cabinets': 'cabinets',
      '/Drawers': 'drawers',
      '/Bathrooms': 'bathrooms',
      '/Others': 'others',
    };

    return Object.entries(legacyCategories).map(([source, slug]) => ({
      source,
      destination: `/category/${slug}`,
      permanent: true,
    }));
  },

  images: {
    /**
     * Product and project photography lives in Supabase Storage. Most of the
     * site renders those through a plain `<img>` — the admin uploader already
     * compresses and resizes on the way in — but `next/image` is allowed to
     * reach them so an individual page can opt in where it helps.
     */
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
};

export default nextConfig;
