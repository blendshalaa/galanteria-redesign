import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../../assets/images/LOGO_G.png';
import language from '../../lang';
import useLang from '../../Hooks/useLang';
import useCategories from '../../Hooks/useCategories';
import Language from './Language';
import SearchOverlay from '../Search/SearchOverlay';
import { localized } from '../../i18n/ui';
import './NavBar.scss';

const DownChevron = () => (
  <svg className="s" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

/**
 * Site header.
 *
 * Bugs fixed here, all of them user-visible:
 *
 * 1. SCROLL LOCK LEAKED TO DESKTOP. `onClick={toggleMenu}` was attached to the
 *    entire `<ul className="links">`, so clicking any *desktop* nav link
 *    toggled `body { overflow: hidden }` and flipped the hamburger state. It
 *    only appeared to work because two separate window click listeners raced
 *    to remove the class again. The lock now belongs to the mobile drawer.
 *
 * 2. DROPDOWN TRIGGERS WERE `<Link>` WITH NO `to`. React Router renders those
 *    as `<a>` whose href resolves to the current path, so Enter, middle-click
 *    and Ctrl-click navigated the user in a circle. They are `<button>` now.
 *
 * 3. THE CATEGORY MENU WAS HARDCODED, three levels deep, and four taps from
 *    the homepage to a category on a phone. It is now one flat list built from
 *    the `categories` table, so adding a category in the admin panel adds it
 *    to the menu.
 *
 * 4. THE `.scrolled` STYLE NEVER FIRED — the class was styled in NavBar.scss
 *    but nothing ever added it.
 *
 * 5. NO KEYBOARD SUPPORT: no `aria-expanded`, no Escape, no focus return, and
 *    an `aria-label="open drawer"` that said "open" even when it closed.
 */
const NavBar = () => {
  const { lang, t } = useLang();
  const location = useLocation();
  const { categories } = useCategories();

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

  // Close everything on navigation — previously the mobile drawer stayed open
  // behind the new page.
  useEffect(() => {
    closeAll();
  }, [location.pathname, closeAll]);

  // Body scroll lock belongs to the mobile drawer only, and is cleaned up on
  // unmount so it can never be left stuck on.
  useEffect(() => {
    document.body.classList.toggle('scroll-y', menuOpen);
    return () => document.body.classList.remove('scroll-y');
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // One outside-click listener instead of two racing ones.
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

  /* The three catalogue PDFs total ~64 MB. They used to be `import`ed from
     src/, which pulled them through the bundler and hashed their filenames —
     so the file a visitor actually downloaded was named
     "Office Catalogue English - DONE-D2GWA9PT.pdf". They are static files in
     public/ now: not rebuilt, not hashed, and downloaded under a sensible
     name. */
  const catalogues = [
    { file: '/catalogues/galanteria-office-catalogue.pdf',  name: 'galanteria-office-catalogue.pdf',  label: language[lang]?.ecatalog?.[0]?.one },
    { file: '/catalogues/galanteria-school-catalogue.pdf',  name: 'galanteria-school-catalogue.pdf',  label: language[lang]?.ecatalog?.[0]?.two },
    { file: '/catalogues/galanteria-kitchen-catalogue.pdf', name: 'galanteria-kitchen-catalogue.pdf', label: language[lang]?.ecatalog?.[0]?.three },
  ];

  return (
    <>
      <nav className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`} aria-label="Main">
        <div className="left">
          <div className="logo">
            <Link to="/" aria-label="Galanteria Group — home">
              {/* The intrinsic size attributes said 150×34 (a 4.4 ratio) for a
                  file that is actually 336×246 (1.37), so the browser reserved
                  a box the wrong shape before the stylesheet loaded. */}
              <img src={logo} alt="Galanteria Group" width="52" height="38" />
            </Link>
          </div>

          <ul className={`${menuOpen ? 'header-menu' : ''} links`} id="primary-navigation">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : 'link')} end>
                {language[lang]?.menuHeader?.[0]?.name}
              </NavLink>
            </li>

            <li className="categories" ref={categoriesRef}>
              <div className="c">
                <button
                  type="button"
                  className={location.pathname.startsWith('/category') ? 'active-link' : 'link'}
                  onClick={() => setCategoriesOpen((open) => !open)}
                  aria-expanded={categoriesOpen}
                  aria-controls="categories-dropdown"
                >
                  {language[lang]?.menuHeader?.[1]?.name}
                  <DownChevron />
                </button>
              </div>

              {categoriesOpen && (
                <ul className="dropdown" id="categories-dropdown">
                  {categories.map((category) => (
                    <li className="nes" key={category.slug}>
                      <Link to={`/category/${category.slug}`}>
                        {localized(category, 'name', lang)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li>
              <NavLink to="/Projects" className={({ isActive }) => (isActive ? 'active-link' : 'link')}>
                {language[lang]?.menuHeader?.[12]?.name}
              </NavLink>
            </li>

            <li className="ecatalog" ref={catalogueRef}>
              <div className="c">
                <button
                  type="button"
                  className="link"
                  onClick={() => setCatalogueOpen((open) => !open)}
                  aria-expanded={catalogueOpen}
                  aria-controls="catalogue-dropdown"
                >
                  {language[lang]?.menuHeader?.[13]?.name}
                  <DownChevron />
                </button>
              </div>

              {catalogueOpen && (
                <ul className="dropdown" id="catalogue-dropdown">
                  {catalogues.map((item) => (
                    <li className="nes" key={item.file}>
                      <a href={item.file} download={item.name}>
                        <DownloadIcon />
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li>
              <NavLink to="/Aboutus" className={({ isActive }) => (isActive ? 'active-link' : 'link')}>
                {language[lang]?.menuHeader?.[15]?.name}
              </NavLink>
            </li>

            {/* Contact is the one thing a visitor to a made-to-order furniture
                site is being steered towards, and it was styled identically to
                the five links beside it. */}
            <li className="nav-cta-item">
              <NavLink to="/Contact" className={({ isActive }) => (isActive ? 'active-link nav-cta' : 'link nav-cta')}>
                {language[lang]?.menuHeader?.[14]?.name}
              </NavLink>
            </li>

            <li className="navlang mobile-only">
              <Language />
            </li>
          </ul>
        </div>

        <div className="nav-actions">
          <button
            type="button"
            className="nav-icon-btn"
            onClick={() => setSearchOpen(true)}
            aria-label={t('search')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <div className="navlang desktop-only">
            <Language />
          </div>

          <button
            type="button"
            ref={menuButtonRef}
            className="nav-icon-btn menu-btn"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
};

export default NavBar;
