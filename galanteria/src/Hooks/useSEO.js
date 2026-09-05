import { useEffect } from 'react';
import { SITE_URL } from '../config/contact';

/**
 * Per-route document head management.
 *
 * The previous version set only `<title>` and `meta[name=description]`, never
 * cleaned up, and was called on 4 of 17 routes — so every category, product and
 * project page (the entire long-tail search surface) inherited whatever title
 * the previously-viewed page happened to leave behind.
 *
 * This is a client-rendered SPA, so crawlers that do not execute JavaScript see
 * the static index.html. That is a real limitation and the reason index.html
 * carries sensible defaults; the tags below are what Google (which does render)
 * and link unfurlers that follow redirects will pick up.
 */

const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

function upsertMeta(selector, attrs) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    Object.entries(attrs).forEach(([key, value]) => {
      if (key !== 'content') element.setAttribute(key, value);
    });
    document.head.appendChild(element);
  }
  element.setAttribute('content', attrs.content ?? '');
  return element;
}

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
  return element;
}

/**
 * @param {object}  options
 * @param {string}  options.title
 * @param {string}  options.description
 * @param {string} [options.image]      absolute URL for social previews
 * @param {string} [options.type]       'website' | 'article' | 'product'
 * @param {object} [options.jsonLd]     structured data for this page
 * @param {boolean}[options.noIndex]
 */
const useSEO = ({ title, description, image, type = 'website', jsonLd, noIndex = false } = {}) => {
  useEffect(() => {
    if (title) document.title = title;

    const url = `${SITE_URL}${window.location.pathname}`;
    const socialImage = image || DEFAULT_IMAGE;

    if (description) {
      upsertMeta('meta[name="description"]', { name: 'description', content: description });
    }

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title || '' });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description || '' });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: socialImage });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Galanteria Group' });

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title || '' });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description || '' });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: socialImage });

    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noIndex ? 'noindex, nofollow' : 'index, follow',
    });

    upsertLink('canonical', url);
  }, [title, description, image, type, noIndex]);

  // Structured data lives in its own effect so it can be removed cleanly on
  // unmount — otherwise a Product schema would linger on the About page.
  useEffect(() => {
    if (!jsonLd) return undefined;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.seo = 'route';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => script.remove();
  }, [jsonLd]);
};

export default useSEO;
