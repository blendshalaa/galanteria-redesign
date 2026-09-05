import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      output: {
        /**
         * The previous config put every single node_modules import into one
         * `vendor` chunk. That meant a visitor landing on the contact page
         * downloaded the carousel library used only by the homepage, and every
         * dependency had to arrive before anything rendered.
         *
         * Split by what is actually needed when:
         *   react    — required by every route, cached across deploys
         *   supabase — required by every route that reads data
         *   swiper   — only the homepage uses it, so it loads with that route
         */
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;

          if (id.includes('react-router')) return 'react';
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
            return 'react';
          }
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('swiper')) return 'swiper';

          return 'vendor';
        },
      },
    },

    // Slightly above the largest legitimate chunk (the Supabase client), so the
    // warning stays meaningful instead of firing on every build.
    chunkSizeWarningLimit: 400,
  },
});
