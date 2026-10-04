'use client';

import { useEffect } from 'react';

/**
 * Catches a failure in `app/layout.js` itself — the one layer `app/error.js`
 * cannot cover, since a segment's error boundary never wraps the layout.js
 * it sits beside. This replaces the entire `<html>` document, so it cannot
 * assume the `ThemeProvider`/`LanguageProvider` context, next/font variables
 * or Tailwind's theme tokens ever mounted; everything here is plain inline
 * styles and hardcoded English, deliberately with nothing to that could
 * itself fail. In practice this should be almost unreachable — the root
 * layout only reads two cookies — but an unstyled blank tab is the one
 * outcome worth spending a few lines of CSS to avoid.
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('[Galanteria] Fatal root-layout error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#0e0d0b',
          color: '#f0ede8',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <p style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
          Galanteria <span style={{ color: '#c8722a' }}>Group</span>
        </p>
        <p style={{ fontSize: '0.95rem', color: '#a09888', maxWidth: '42ch' }}>
          Something went wrong loading this page. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            cursor: 'pointer',
            borderRadius: '9999px',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'transparent',
            color: '#f0ede8',
            padding: '0.65rem 1.4rem',
            fontSize: '0.95rem',
            fontWeight: 600,
          }}
        >
          Try again
        </button>
        <a href="/" style={{ color: '#c8722a', fontSize: '0.9rem', fontWeight: 600 }}>
          Back to home
        </a>
      </body>
    </html>
  );
}
