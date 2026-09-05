module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

    // This is a plain JavaScript project with no TypeScript and no PropTypes
    // anywhere in it. The rule was previously "enforced" while every file that
    // tripped it carried a `/* eslint-disable react/prop-types */` header — so
    // it was never actually catching anything, it was just producing headers.
    // Turned off honestly rather than suppressed file by file.
    'react/prop-types': 'off',

    // Allow deliberately unused catch bindings and leading-underscore args.
    'no-unused-vars': ['error', {
      args: 'after-used',
      argsIgnorePattern: '^_',
      caughtErrors: 'none',
      varsIgnorePattern: '^_',
    }],

    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
  },
  overrides: [
    {
      // Build-time scripts run in Node, not the browser.
      files: ['scripts/**/*.mjs', 'vite.config.js'],
      env: { node: true, browser: false },
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
    {
      // Legacy seed data: ~1,900 lines of image imports kept only so the
      // one-time migration tool can run. Many of its imports are genuinely
      // unused, and rewriting a file that is scheduled for deletion is not
      // worth it. Delete this override together with the file once the
      // catalogue is confirmed in Supabase — see supabase/README.md.
      files: ['src/data/products.js'],
      rules: { 'no-unused-vars': 'off' },
    },
  ],
};
