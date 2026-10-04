// @vitest-environment node
//
// `lib/supabase/server.js` is guarded by the `server-only` package, which
// throws the moment it detects a `window` global — exactly what jsdom
// provides. Running this file under Node (no window) rather than the
// project's default jsdom environment is what lets it import at all.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/* The real `server-only` package throws unconditionally the moment its
   entry point is imported outside Next's own bundler — Next aliases it to a
   no-op when bundling for the server and to this throwing file only as a
   trap for an accidental client bundle. Vitest is neither, so without this
   mock `import './queries'` (which does `import 'server-only'`) would throw
   before a single test ran. */
vi.mock('server-only', () => ({}));

/**
 * A minimal stand-in for the supabase-js query builder: every chain method
 * returns itself, and the chain is awaitable (`.then`) because that is how
 * every function in lib/queries.js actually consumes it — `await
 * supabaseServer.from(...).select(...)...`, with no terminal `.then()` or
 * explicit execute call of its own.
 */
function makeSupabaseMock(result) {
  const chain = {
    from: () => chain,
    select: () => chain,
    eq: () => chain,
    neq: () => chain,
    order: () => chain,
    range: () => chain,
    limit: () => chain,
    maybeSingle: () => Promise.resolve(result),
    then: (resolve, reject) => Promise.resolve(result).then(resolve, reject),
  };
  return chain;
}

let supabaseServerMock;

vi.mock('./supabase/server', () => ({
  get supabaseServer() {
    return supabaseServerMock;
  },
}));

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
});

/**
 * Every one of these functions exists specifically so a failed request
 * renders the page's empty/error state instead of throwing — the bug the
 * file's own top comment describes (`if (!error && data)` making a failed
 * fetch indistinguishable from an empty table). These tests are the
 * regression guard for that behaviour, not a request to tighten validation.
 */
describe('lib/queries', () => {
  describe('getProjects', () => {
    it('returns the rows and failed: false on success', async () => {
      const projects = [{ id: '1', title: 'BottomLine', slug: 'bottomline' }];
      supabaseServerMock = makeSupabaseMock({ data: projects, error: null });

      const { getProjects } = await import('./queries');
      const result = await getProjects();

      expect(result).toEqual({ projects, failed: false });
    });

    it('returns an empty array and failed: true on a query error — never throws', async () => {
      supabaseServerMock = makeSupabaseMock({ data: null, error: { message: 'connection reset' } });

      const { getProjects } = await import('./queries');
      const result = await getProjects();

      expect(result).toEqual({ projects: [], failed: true });
    });
  });

  describe('getProduct', () => {
    it('returns the row on success', async () => {
      const product = { id: '1', slug: 'moet', name: 'Moet' };
      supabaseServerMock = makeSupabaseMock({ data: product, error: null });

      const { getProduct } = await import('./queries');
      expect(await getProduct('moet')).toEqual(product);
    });

    it('returns null rather than throwing when nothing matches', async () => {
      supabaseServerMock = makeSupabaseMock({ data: null, error: null });

      const { getProduct } = await import('./queries');
      expect(await getProduct('does-not-exist')).toBeNull();
    });

    it('returns null on a query error', async () => {
      supabaseServerMock = makeSupabaseMock({ data: null, error: { message: 'RLS denied' } });

      const { getProduct } = await import('./queries');
      expect(await getProduct('moet')).toBeNull();
    });
  });

  describe('getProductsByCategory', () => {
    it('shapes a successful response as { products, total, failed }', async () => {
      const products = [{ id: '1', name: 'Moet' }];
      supabaseServerMock = makeSupabaseMock({ data: products, error: null, count: 14 });

      const { getProductsByCategory } = await import('./queries');
      const result = await getProductsByCategory('office-chairs');

      expect(result).toEqual({ products, total: 14, failed: false });
    });

    it('falls back to an empty page and failed: true on error, not a thrown exception', async () => {
      supabaseServerMock = makeSupabaseMock({ data: null, error: { message: 'timeout' }, count: null });

      const { getProductsByCategory } = await import('./queries');
      const result = await getProductsByCategory('office-chairs');

      expect(result).toEqual({ products: [], total: 0, failed: true });
    });
  });

  describe('getRelatedProducts', () => {
    it('returns an empty list without querying when the product has no category', async () => {
      supabaseServerMock = makeSupabaseMock({ data: [{ id: '2' }], error: null });

      const { getRelatedProducts } = await import('./queries');
      expect(await getRelatedProducts({ category_slug: null })).toEqual([]);
      expect(await getRelatedProducts(null)).toEqual([]);
    });
  });
});
