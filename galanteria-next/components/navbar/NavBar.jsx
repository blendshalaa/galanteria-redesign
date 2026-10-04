'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import language from '@/lang';
import { localized } from '@/i18n/ui';
import { useLang } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/cn';
import LanguageSwitcher from './LanguageSwitcher';
import SearchOverlay from '@/components/search/SearchOverlay';

/**
 * Site header.
 *
 * The categories it lists are passed in from the root layout, which reads them
 * on the server — so the menu is complete in the first HTML rather than
 * appearing a moment after hydration, and the navbar makes no request of its
 * own on any route.
 *
 * Behaviour carried over from the SCSS build, all of it fixing something that
 * was visibly broken there:
 *
 * 1. The scroll lock belongs to the mobile drawer. `onClick={toggleMenu}` used
 *    to sit on the entire `<ul>`, so clicking a *desktop* nav link toggled
 *    `body { overflow: hidden }`.
 * 2. Dropdown triggers are `<button>`. They were `<Link>` with no `to`, which
 *    renders an `<a>` whose href is the current page — so Enter, middle-click
 *    and Ctrl-click navigated the visitor in a circle.
 * 3. The category menu is one flat list built from the `categories` table. It
 *    was hardcoded, three levels deep, and four taps from the homepage to a
 *    category on a phone.
 * 4. Escape closes, focus returns to the trigger, and `aria-expanded` is real.
 */

const NAV_HEIGHT_CLASSES = 'h-nav-mobile lg:h-nav';

export default function NavBar({ categories = [] }) {
  const { lang, t } = useLang();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const categoriesRef = useRef(null);
  const catalogueRef = useRef(null);
  const menuButtonRef = useRef(null);

  const closeAll = useCallback(() => {
    setMenuOpen(false);
    setCategoriesOpen(false);
    setCatalogueOpen(false);
  }, []);

  // Close everything on navigation — the mobile drawer used to stay open
  // behind the new page.
  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  // The scroll lock is the drawer's, and is cleaned up on unmount so it can
  // never be left stuck on.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // One outside-click listener, not two racing ones.
  useEffect(() => {
    const onPointerDown = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setCategoriesOpen(false);
      }
      if (catalogueRef.current && !catalogueRef.current.contains(event.target)) {
        setCatalogueOpen(false);
      }
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      if (menuOpen) menuButtonRef.current?.focus();
      closeAll();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, closeAll]);

  /* The three catalogue PDFs total ~64 MB and are static files in public/, so
     they are downloaded under a sensible name rather than the hashed one a
     bundler import produced ("Office Catalogue English - DONE-D2GWA9PT.pdf"). */
  const catalogues = [
    { file: '/catalogues/galanteria-office-catalogue.pdf', label: language[lang]?.ecatalog?.[0]?.one },
    { file: '/catalogues/galanteria-school-catalogue.pdf', label: language[lang]?.ecatalog?.[0]?.two },
    { file: '/catalogues/galanteria-kitchen-catalogue.pdf', label: language[lang]?.ecatalog?.[0]?.three },
  ];

  const isActive = (href, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  // The About page's hero has a large orange circle sitting right behind the
  // navbar, so the links' usual orange hover colour disappears into it. This
  // page alone keeps the hover text white instead.
  const onAboutPage = pathname === '/Aboutus';

  return (
    <>
      <nav
        aria-label="Main"
        className={cn(
          'fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 px-5',
          /* The logo and the links start where the homepage hero's copy starts
             — past the vertical rail on its left edge — rather than hard
             against the window. The right-hand controls keep the old margin. */
          'lg:pl-[clamp(5.5rem,8vw,10rem)] lg:pr-12',
          NAV_HEIGHT_CLASSES,
          'border-b transition-[background-color,border-color,box-shadow] duration-450',
          /* Transparent at the top of the page so the hero photograph runs
             full-bleed behind it, opaque once you start scrolling. It used to
             be translucent at every scroll position, which put a permanent
             grey band across the top of the hero. */
          scrolled || menuOpen
            ? 'border-line bg-[rgba(10,9,8,0.95)] shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-[24px] backdrop-saturate-150'
            : 'border-transparent bg-transparent'
        )}
      >
        <div className="flex min-w-0 items-center gap-7 lg:gap-12">
          <Link href="/" scroll={false} aria-label="Galanteria Group — home" className="flex shrink-0 transition-opacity hover:opacity-80">
            {/* 52×38 keeps the file's real 1.37 aspect ratio. The old markup
                declared 150×34, so the browser reserved a box the wrong shape
                before the stylesheet loaded. */}
            <Image src="/images/LOGO_G.png" alt="Galanteria Group" width={52} height={38} priority className="h-8 w-11 object-contain lg:h-9.5 lg:w-13" />
          </Link>

          <ul
            id="primary-navigation"
            className={cn(
              'fixed left-0 top-nav-mobile flex h-[calc(100dvh-var(--spacing-nav-mobile))] w-full flex-col',
              'items-stretch gap-0.5 overflow-y-auto bg-[rgba(10,9,8,0.99)] px-5 pt-6 pb-15 backdrop-blur-[20px]',
              'transition-[transform,visibility] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
              menuOpen ? 'visible translate-x-0' : 'invisible -translate-x-full',
              /* Above the collapse breakpoint it is a plain row again. */
              'lg:visible lg:static lg:h-auto lg:w-auto lg:translate-x-0 lg:flex-row lg:items-center',
              'lg:overflow-visible lg:bg-transparent lg:p-0 lg:backdrop-blur-none'
            )}
          >
            <li className="relative">
              <Link href="/" scroll={false} className={navLinkClasses(isActive('/', true), { whiteHover: onAboutPage })}>
                {language[lang]?.menuHeader?.[0]?.name}
              </Link>
            </li>

            <li className="relative" ref={categoriesRef}>
              <button
                type="button"
                onClick={() => setCategoriesOpen((open) => !open)}
                aria-expanded={categoriesOpen}
                aria-controls="categories-dropdown"
                className={navLinkClasses(isActive('/category'), { whiteHover: onAboutPage })}
              >
                {language[lang]?.menuHeader?.[1]?.name}
                <Chevron open={categoriesOpen} />
              </button>

              {categoriesOpen && (
                <ul id="categories-dropdown" className={dropdownClasses}>
                  {categories.map((category) => (
                    <li key={category.slug}>
                      <Link href={`/category/${category.slug}`} className={dropdownItemClasses}>
                        {localized(category, 'name', lang)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li className="relative">
              <Link href="/Projects" className={navLinkClasses(isActive('/Projects'), { whiteHover: onAboutPage })}>
                {language[lang]?.menuHeader?.[12]?.name}
              </Link>
            </li>

            <li className="relative" ref={catalogueRef}>
              <button
                type="button"
                onClick={() => setCatalogueOpen((open) => !open)}
                aria-expanded={catalogueOpen}
                aria-controls="catalogue-dropdown"
                className={navLinkClasses(false, { whiteHover: onAboutPage })}
              >
                {language[lang]?.menuHeader?.[13]?.name}
                <Chevron open={catalogueOpen} />
              </button>

              {catalogueOpen && (
                <ul id="catalogue-dropdown" className={dropdownClasses}>
                  {catalogues.map((item) => (
                    <li key={item.file}>
                      <a href={item.file} download className={dropdownItemClasses}>
                        <DownloadIcon />
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li className="relative">
              <Link href="/Aboutus" scroll={false} className={navLinkClasses(isActive('/Aboutus'), { whiteHover: onAboutPage })}>
                {language[lang]?.menuHeader?.[15]?.name}
              </Link>
            </li>

            <li className="relative">
              <Link href="/Contact" className={navLinkClasses(isActive('/Contact'), { whiteHover: onAboutPage })}>
                {language[lang]?.menuHeader?.[14]?.name}
              </Link>
            </li>

            {/* -ml-3 cancels the switcher's own 16px button padding against
                the plain nav links' 4px, so "AL" lines up with "Home" above
                it instead of sitting visibly further right. */}
            <li className="mt-7 flex justify-start lg:hidden">
              <LanguageSwitcher size="lg" className="-ml-3" />
            </li>
          </ul>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button type="button" onClick={() => setSearchOpen(true)} aria-label={t('search')} className={iconButtonClasses}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <div className="hidden lg:flex">
            <LanguageSwitcher />
          </div>

          <button
            type="button"
            ref={menuButtonRef}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            className={cn(iconButtonClasses, 'lg:hidden')}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {searchOpen && <SearchOverlay categories={categories} onClose={() => setSearchOpen(false)} />}
    </>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * A nav item is a full-width row inside the drawer and a compact pill in the
 * desktop bar. All the sizing lives on the interactive element itself, so it is
 * the link that is clickable and focusable, not the space around it.
 *
 * The base (non-hover) colour — white when inactive, accent when this is the
 * current page — always applies. `hover: false` drops only the *hover*
 * colour classes: Contact supplies its own (an accent fill with dark text
 * over it), and a second `hover:text-*`/`hover:bg-*` utility layered on top
 * of this one's own would fight it for the same CSS property. Which one wins
 * is decided by Tailwind's generated stylesheet order, not by which comes
 * later in the className string, so it isn't a fight either side can rely on
 * winning — Contact's hover was losing it, turning the text dark against the
 * nav's own dark background instead of the accent fill it was meant to sit
 * on.
 */
function navLinkClasses(active, { hover = true, whiteHover = false } = {}) {
  return cn(
    'flex h-13 w-full cursor-pointer items-center justify-between gap-1.5 whitespace-nowrap',
    'border-b border-line px-1 text-[0.95rem] font-medium uppercase tracking-[0.05em]',
    'transition-colors duration-150',
    'lg:h-9 lg:w-auto lg:justify-center lg:rounded-sm lg:border lg:border-transparent lg:px-3.5 lg:text-[0.8rem]',
    active
      ? 'text-accent lg:bg-accent-dim'
      : cn('text-ink', hover && (whiteHover ? 'hover:text-ink lg:hover:bg-white/6' : 'hover:text-accent lg:hover:bg-white/6'))
  );
}

const dropdownClasses = cn(
  'z-20 my-1 mb-3 flex flex-col rounded-md bg-white/3 p-2',
  'lg:absolute lg:left-0 lg:top-[calc(100%+10px)] lg:my-0 lg:min-w-[230px] lg:border lg:border-line',
  'lg:bg-surface lg:shadow-lg lg:backdrop-blur-[20px] lg:animate-fade-up'
);

const dropdownItemClasses = cn(
  'flex items-center gap-2.5 rounded-sm px-3.5 py-3 text-base font-medium tracking-[0.03em]',
  'text-ink-soft transition-colors duration-150 hover:bg-white/5 hover:text-accent-light',
  'lg:px-3.5 lg:py-2.5 lg:text-sm'
);

const iconButtonClasses = cn(
  'flex h-9.5 w-9.5 cursor-pointer items-center justify-center rounded-full text-ink',
  'transition-colors duration-150 hover:bg-white/6 hover:text-accent'
);

function Chevron({ open }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className={cn('shrink-0 opacity-70 transition-transform duration-200', open && 'rotate-180')}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="shrink-0">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
