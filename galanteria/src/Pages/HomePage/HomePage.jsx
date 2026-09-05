import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './HomePage.scss';

import language from '../../lang';
import useLang from '../../Hooks/useLang';
import useSEO from '../../Hooks/useSEO';
import useCategories from '../../Hooks/useCategories';
import { useHeroImages, useTestimonials } from '../../Hooks/useSiteContent';
import { localized } from '../../i18n/ui';
import { SITE_URL, PHONES, EMAILS } from '../../config/contact';

/* Fallback hero images, used only when the `hero_images` table is empty — so
   the homepage never renders a blank slideshow before the client has uploaded
   anything. These were previously the *only* source, which is why the "Hero
   Slider" admin tab had no visible effect. */
import fallbackHero1 from '../../assets/images/bottom10.jpg';
import fallbackHero2 from '../../assets/images/h1.jpg';
import fallbackHero3 from '../../assets/images/h3.jpg';

/* The category cover fallbacks used to be nine imports and a slug map declared
   here, private to this file — which is why the admin panel, having no copy of
   it, showed a question mark for every category. config/categoryImages.js is
   the one source both read from now. */
import { categoryImage } from '../../config/categoryImages';

import partner1 from '../../assets/images/p1.avif';
import partner2 from '../../assets/images/p2.png';

const FALLBACK_HERO = [fallbackHero1, fallbackHero2, fallbackHero3];

const HomePage = () => {
  const { lang, t } = useLang();
  const navigate = useNavigate();

  const { categories } = useCategories();
  const { images: heroImages } = useHeroImages(FALLBACK_HERO);

  /* Testimonials come from the database, falling back to the copy in lang.js.
     The previous version built this list from seven hand-indexed lang.js keys
     (name1..name7) and could not be edited without a developer. */
  const fallbackTestimonials = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        id: `lang-${i}`,
        name: language[lang]?.clients?.[0]?.[`name${i + 1}`],
        text: language[lang]?.clients?.[0]?.[`text${i + 1}`],
        company: null,
      })).filter((entry) => entry.name),
    [lang]
  );
  const testimonials = useTestimonials(fallbackTestimonials);

  useSEO({
    title: 'Galanteria Group — Premium Office & Home Furniture',
    description:
      'Galanteria Group designs and manufactures premium office and home furniture — office chairs, workstations, meeting tables and cabinets — for modern spaces across Kosovo and Europe.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FurnitureStore',
      name: 'Galanteria Group',
      url: SITE_URL,
      description:
        'Premium office and home furniture manufacturer, established 1987.',
      telephone: PHONES[0]?.label,
      email: EMAILS[0]?.label,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Rr. Ismail Qemali',
        addressLocality: 'Podujevë',
        addressCountry: 'XK',
      },
      foundingDate: '1987',
    },
  });

  /* Split the categories into two rows of roughly equal width.
     The previous version hardcoded `slice(0, 4)` and `slice(4, 9)`, which meant
     a tenth category was silently invisible on the homepage, and deleting one
     in the admin panel left a short row. */
  const categoryRows = useMemo(() => {
    if (categories.length === 0) return [];
    const half = Math.ceil(categories.length / 2);
    return [categories.slice(0, half), categories.slice(half)].filter((row) => row.length > 0);
  }, [categories]);

  return (
    <div className="home-wrapper">
      {/* ===== Hero slideshow ===== */}
      <section className="hero-section">
        <Swiper
          spaceBetween={0}
          centeredSlides
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination]}
          className="hero-swiper"
        >
          {heroImages.map((image, index) => (
            <SwiperSlide key={image}>
              <div className="hero-slide">
                <img
                  src={image}
                  alt=""
                  /* Only the first slide is above the fold; the rest were all
                     being downloaded at full size on page load. */
                  loading={index === 0 ? 'eager' : 'lazy'}
                  {/* Lowercase, via a spread — see the note in ProductCard.jsx:
                      react-dom 18.3.1 drops the camelCase `fetchPriority`. */
                  ...{ fetchpriority: index === 0 ? 'high' : 'low' }}
                  decoding={index === 0 ? 'sync' : 'async'}
                />
                <div className="hero-slide-overlay" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="hero-text-block">
          <p className="hero-eyebrow">Galanteria Group — 1987</p>
          <h1 className="hero-title">{language[lang]?.hero?.[0]?.title}</h1>
          <div className="hero-actions">
            <a href="#categories" className="btn btn-primary">
              {t('heroCta')}
              <Arrow />
            </a>
            <Link to="/Contact" className="btn btn-ghost">
              {t('contactUs')}
            </Link>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <span />
        </div>
      </section>

      {/* ===== Categories ===== */}
      <section className="section categories-section" id="categories">
        <div className="section-head">
          <div>
            {/* The kicker and the heading were both rendering the same lang.js
                string, so the section title appeared twice, one above the
                other. The kicker is now its own word. */}
            <span className="eyebrow">{t('eyebrowCollection')}</span>
            <h2 className="section-title">{language[lang]?.categories?.[0]?.title}</h2>
          </div>
          {/* Was labelled "See all" and navigated to /Projects — a control that
              promised more categories and delivered the projects page. There is
              no all-categories index (every category is already on screen
              below), so this is now the action a visitor browsing the
              catalogue actually wants. */}
          <button type="button" className="btn btn-quiet" onClick={() => navigate('/Contact')}>
            {t('requestQuote')}
            <Arrow />
          </button>
        </div>

        {/* The category tiles are now real links built from the `categories`
            table, rather than nine hardcoded image imports paired with
            hardcoded route strings. */}
        <div className="creative-categories-layout">
          {categoryRows.map((row, index) => (
            <div className="accordion-row" key={index}>
              {row.map((category) => (
                <CategoryTile key={category.slug} category={category} lang={lang} />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ===== Stats ===== */}
      <section className="section section--sunken stats-section">
        <div className="stat-block">
          <h3>1000+</h3>
          <p>{t('statsProjects')}</p>
        </div>
        <div className="stat-divider" />
        <div className="stat-block">
          <h3>200+</h3>
          <p>{t('statsClients')}</p>
        </div>
        <div className="stat-divider" />
        <div className="stat-block">
          <h3>15+</h3>
          <p>{t('statsYears')}</p>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      {testimonials.length > 0 && (
        <section className="section testimonials-section">
          <div className="section-head">
            <div>
              <span className="eyebrow">{t('eyebrowClients')}</span>
              <h2 className="section-title">{language[lang]?.clients?.[0]?.title}</h2>
            </div>
          </div>
          <div className="testimonials-carousel">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              loop={testimonials.length > 3}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              className="testi-swiper"
            >
              {testimonials.map((entry) => (
                <SwiperSlide key={entry.id}>
                  <div className="testimonial-modern-card">
                    <p className="testimonial-text">“{entry.text}”</p>
                    <div className="testimonial-author">
                      <span className="testimonial-name">{entry.name}</span>
                      {/* Was the hardcoded English word "Client", shown to
                          Albanian and German visitors too. */}
                      <span className="testimonial-role">{entry.company || t('client')}</span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* ===== Partners =====
          Previously gated behind `lang === 'sq'`, so German visitors never saw
          it despite a complete German translation existing in lang.js. */}
      {language[lang]?.partners?.[0]?.partnertitle && (
        <section className="section section--sunken partners-section">
          <div className="section-head">
            <div>
              <span className="eyebrow">{t('eyebrowPartners')}</span>
              <h2 className="section-title">{language[lang].partners[0].partnertitle}</h2>
            </div>
          </div>
          <div className="partners-layout">
            <div className="partners-text">
              <div className="partner-item">
                <h4>{language[lang].partners[0].up}</h4>
                <p>{language[lang].partners[0].down}</p>
              </div>
              <div className="partner-item">
                <h4>{language[lang].partners[0].up2}</h4>
                <p>{language[lang].partners[0].down2}</p>
              </div>
            </div>
            {/* Each logo needs a light plate behind it — see the note in
                HomePage.scss. Both files are dark artwork on transparency and
                were invisible against this section. */}
            <div className="partners-images">
              <div className="partner-logo">
                <img src={partner1} alt="Compotek SRL" width="256" height="71" loading="lazy" decoding="async" />
              </div>
              <div className="partner-logo">
                <img src={partner2} alt="Rival Metal" width="201" height="74" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

/** The arrow that sits inside every forward-moving button on this page. It was
    previously pasted inline as raw SVG at each call site. */
const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** One category tile — a real link, so it can be focused and opened in a tab. */
const CategoryTile = ({ category, lang }) => {
  const label = localized(category, 'name', lang);
  const image = categoryImage(category);

  return (
    <Link to={`/category/${category.slug}`} className="accordion-item">
      {image && <img src={image} alt="" loading="lazy" decoding="async" />}
      <div className="collapsed-label">
        <span>{label}</span>
      </div>
      <div className="accordion-content">
        <h3>{label}</h3>
        <div className="view-btn" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default HomePage;
