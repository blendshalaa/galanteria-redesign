import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Vitest rather than Next's own (Jest-based, heavier to configure for App
 * Router server code) test runner. The `@` alias mirrors jsconfig.json's
 * `"@/*": ["./*"]` so test files can import components the same way the app
 * does, rather than relative paths that break the moment a file moves.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.mjs'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': import.meta.dirname,
    },
  },
});
