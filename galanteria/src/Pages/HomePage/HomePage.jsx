/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './HomePage.scss';

import language from '../../lang';
import { Context } from '../../Components/Context/Products';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import useSEO from '../../Hooks/useSEO';

// Hero images
import img1 from '../../assets/images/bottom10.jpg';
import img2 from '../../assets/images/bottom6.jpeg';
import img3 from '../../assets/images/bottom5.jpg';
import img4 from '../../assets/images/h1.jpg';
import img5 from '../../assets/images/h2.jpg';
import img6 from '../../assets/images/h3.jpg';

// Category images
import s2 from '../../assets/images/li15.jpg';
import s3 from '../../assets/images/a003.jpg';
import s4 from '../../assets/images/c3.png';
import s5 from '../../assets/images/WS005.jpg';
import s6 from '../../assets/images/CB006.jpg';
import s7 from '../../assets/images/b1.jpg';
import s8 from '../../assets/images/MT003.jpg';
import s9 from '../../assets/images/ST001.png';
import s10 from '../../assets/images/RD003.jpg';

// Partners
import p1 from '../../assets/images/p1.avif';
import p2 from '../../assets/images/p2.png';

const HomePage = () => {
  useSEO({
    title: 'Galanteria Group - Premium Furniture',
    description: 'Welcome to Galanteria Group. Discover our exclusive collection of premium office and home furniture designed for modern, elegant spaces.'
  });

  const [{ lang }] = useContext(Context);
  const navigate = useNavigate();

  const categories = [
    { img: s3, label: language[lang]?.categories[0].product3, path: '/WorkingTable' },
    { img: s8, label: language[lang]?.categories[0].product8, path: '/MeetingTable' },
    { img: s9, label: language[lang]?.categories[0].product9, path: '/Drawers' },
    { img: s2, label: language[lang]?.categories[0].product2, path: '/OfficeChairs' },
    { img: s4, label: language[lang]?.categories[0].product4, path: '/MeetingChairs' },
    { img: s7, label: language[lang]?.categories[0].product7, path: '/WaitingChairs' },
    { img: s6, label: language[lang]?.categories[0].product6, path: '/Cabinets' },
    { img: s5, label: language[lang]?.categories[0].product5, path: '/Workstation' },
    { img: s10, label: language[lang]?.categories[0].product10, path: '/Others' },
  ];

  const testimonials = [
    { name: language[lang]?.clients[0].name1, text: language[lang]?.clients[0].text1 },
    { name: language[lang]?.clients[0].name2, text: language[lang]?.clients[0].text2 },
    { name: language[lang]?.clients[0].name3, text: language[lang]?.clients[0].text3 },
    { name: language[lang]?.clients[0].name4, text: language[lang]?.clients[0].text4 },
    { name: language[lang]?.clients[0].name5, text: language[lang]?.clients[0].text5 },
    { name: language[lang]?.clients[0].name6, text: language[lang]?.clients[0].text6 },
    { name: language[lang]?.clients[0].name7, text: language[lang]?.clients[0].text7 },
  ];

  return (
    <div className="home-wrapper">

      {/* ===== SECTION 1: Full-screen hero slideshow ===== */}
      <section className="hero-section">
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination]}
          className="hero-swiper"
        >
          {[img1, img2, img3, img4, img5, img6].map((img, i) => (
            <SwiperSlide key={i}>
              <div className="hero-slide">
                <img src={img} alt="" />
                <div className="hero-slide-overlay" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="hero-text-block">
          <p className="hero-eyebrow">Galanteria Group</p>
          <h1 className="hero-title">
            <i>{language[lang]?.hero[0].title}</i>
          </h1>
        </div>

        <div className="hero-scroll-hint">
          <span />
        </div>
      </section>

      {/* ===== SECTION 2: Editorial category grid ===== */}
      <section className="categories-section">
        <div className="categories-header">
          <div className="categories-header-left">
            <span className="eyebrow-label">{language[lang]?.categories[0].title}</span>
            <h2>{language[lang]?.categories[0].title}</h2>
          </div>
          <button className="see-all-btn" onClick={() => navigate('/Projects')}>
            {lang === 'sq' ? 'Shiko të gjitha' : lang === 'de' ? 'Alle anzeigen' : 'See all'}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {/* Big editorial grid — first 2 items are large, rest are small */}
        <div className="categories-grid">
          {/* Feature: large left card */}
          <div
            className="cat-card cat-card--large"
            onClick={() => navigate(categories[0].path)}
          >
            <img src={categories[0].img} alt={categories[0].label} />
            <div className="cat-card-overlay">
              <span>{categories[0].label}</span>
            </div>
          </div>

          {/* Right column: stacked */}
          <div className="cat-grid-right">
            <div
              className="cat-card cat-card--medium"
              onClick={() => navigate(categories[1].path)}
            >
              <img src={categories[1].img} alt={categories[1].label} />
              <div className="cat-card-overlay"><span>{categories[1].label}</span></div>
            </div>
            <div
              className="cat-card cat-card--medium"
              onClick={() => navigate(categories[2].path)}
            >
              <img src={categories[2].img} alt={categories[2].label} />
              <div className="cat-card-overlay"><span>{categories[2].label}</span></div>
            </div>
          </div>

          {/* Bottom row: equal-width cards */}
          {categories.slice(3).map((cat, i) => (
            <div
              key={i}
              className="cat-card cat-card--small"
              onClick={() => navigate(cat.path)}
            >
              <img src={cat.img} alt={cat.label} />
              <div className="cat-card-overlay"><span>{cat.label}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SECTION 3: Stats strip ===== */}
      <section className="stats-section">
        <div className="stat-block">
          <h3>1000+</h3>
          <p>{lang === 'sq' ? 'Projekte të realizuara' : lang === 'de' ? 'Abgeschlossene Projekte' : 'Completed Projects'}</p>
        </div>
        <div className="stat-divider" />
        <div className="stat-block">
          <h3>200+</h3>
          <p>{lang === 'sq' ? 'Klientë të kënaqur' : lang === 'de' ? 'Zufriedene Kunden' : 'Satisfied Clients'}</p>
        </div>
        <div className="stat-divider" />
        <div className="stat-block">
          <h3>15+</h3>
          <p>{lang === 'sq' ? 'Vite eksperiencë' : lang === 'de' ? 'Jahre Erfahrung' : 'Years of Experience'}</p>
        </div>
      </section>

      {/* ===== SECTION 4: Testimonials grid (not a swiper!) ===== */}
      <section className="testimonials-section">
        <div className="testimonials-header">
          <span className="eyebrow-label">{language[lang]?.clients[0].title}</span>
          <h2>{language[lang]?.clients[0].title}</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.filter(t => t.name).map((t, i) => (
            <div key={i} className="testimonial-card">
              <p className="testimonial-text">"{t.text}"</p>
              <span className="testimonial-name">— {t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SECTION 5: Partners (Albanian only) ===== */}
      {lang === 'sq' && (
        <section className="partners-section">
          <div className="partners-header">
            <span className="eyebrow-label">{language[lang]?.partners[0].partnertitle}</span>
            <h2>{language[lang]?.partners[0].partnertitle}</h2>
          </div>
          <div className="partners-layout">
            <div className="partners-text">
              <div className="partner-item">
                <h4>{language[lang]?.partners[0].up}</h4>
                <p>{language[lang]?.partners[0].down}</p>
              </div>
              <div className="partner-item">
                <h4>{language[lang]?.partners[0].up2}</h4>
                <p>{language[lang]?.partners[0].down2}</p>
              </div>
            </div>
            <div className="partners-images">
              <img src={p1} alt="Partner" />
              <img src={p2} alt="Partner" />
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default HomePage;
