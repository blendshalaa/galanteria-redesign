import React, { useContext } from 'react';
import './Footer.scss';
import logo from '../../assets/images/LOGO_G.png';
import { Link } from 'react-router-dom';
import { Context } from '../../Components/Context/Products';
import language from '../../lang';
import AppWhatsApp from '../../Components/WhatsappViber/AppWhatsApp';

const Footer = () => {
  const [{ lang }] = useContext(Context);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className='footer-editorial'>
      
      {/* ===== 1. Massive Footer CTA ===== */}
      <div className='footer-cta'>
        <div className='cta-content'>
          <h2>
            {lang === 'sq' ? 'Gati për të' : lang === 'de' ? 'Bereit zu' : 'Ready to'} <br/>
            <em>{lang === 'sq' ? 'transformuar hapësirën?' : lang === 'de' ? 'transformieren?' : 'elevate your space?'}</em>
          </h2>
          <Link to="/Contact" className='cta-link'>
            {lang === 'sq' ? 'Na Kontaktoni' : lang === 'de' ? 'Kontaktiere uns' : 'Get in Touch'}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </div>

      {/* ===== 2. Main Footer Grid ===== */}
      <div className='footer-main-grid'>
        
        <div className='footer-brand'>
          <img src={logo} alt="Galanteria logo" />
          <p>
            {lang === 'sq'
              ? 'Mobilim premium për hapësira pune moderne, duke sjellë inovacione dhe kualitet.'
              : lang === 'de'
              ? 'Premium-Möbel für moderne Arbeitsbereiche, mit Innovation und Qualität.'
              : 'Premium furniture for modern workspaces, delivering innovation and uncompromising quality.'}
          </p>
        </div>

        <div className='footer-nav'>
          <span className='footer-col-label'>
             {lang === 'sq' ? 'Navigimi' : lang === 'de' ? 'Navigation' : 'Navigation'}
             <span className='footer-line'></span>
          </span>
          <Link to="/"><span>{language[lang]?.menuHeader[0].name}</span></Link>
          <Link to="/Projects"><span>{language[lang]?.menuHeader[12].name}</span></Link>
          <Link to="/Aboutus"><span>{language[lang]?.menuHeader[15].name}</span></Link>
          <Link to="/Contact"><span>{language[lang]?.menuHeader[14].name}</span></Link>
        </div>

        <div className='footer-contact'>
          <span className='footer-col-label'>
            {lang === 'sq' ? 'Kontakti' : lang === 'de' ? 'Kontakt' : 'Contact'}
            <span className='footer-line'></span>
          </span>
          <a href="tel:+38348522240">+383 48 522 240</a>
          <a href="mailto:info@galanteriagroup.com">info@galanteriagroup.com</a>
          <div className='footer-whatsapp'>
            <AppWhatsApp phoneNumber={+38348522240} />
          </div>
        </div>

        <div className='footer-socials-col'>
          <span className='footer-col-label'>
            Socials
            <span className='footer-line'></span>
          </span>
          <a href="https://www.instagram.com/galanteriashpk/" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.facebook.com/p/Galanteria-SHPK-100063493750911/" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://www.linkedin.com/in/galanteria-l-l-c-94282530b/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>

      {/* ===== 3. Grand Typography Anchor ===== */}
      <div className='footer-grand-anchor'>
        <div className='grand-text'>GALANTERIA</div>
      </div>

      {/* ===== 4. Bottom Legal ===== */}
      <div className='footer-legal'>
        <span className='footer-copy'>© {new Date().getFullYear()} Galanteria Group. All rights reserved.</span>
        
        <button className='footer-top-btn' onClick={scrollToTop}>
          Top 
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 12V4M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

    </footer>
  );
};

export default Footer;