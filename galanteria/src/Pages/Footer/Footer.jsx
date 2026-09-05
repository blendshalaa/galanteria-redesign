import { Link } from 'react-router-dom';
import './Footer.scss';
import logo from '../../assets/images/LOGO_G.png';
import language from '../../lang';
import useLang from '../../Hooks/useLang';
import useCategories from '../../Hooks/useCategories';
import AppWhatsApp from '../../Components/WhatsappViber/AppWhatsApp';
import { localized } from '../../i18n/ui';
import { EMAILS, PHONES, SOCIALS, WHATSAPP_NUMBER } from '../../config/contact';

const Footer = () => {
  const { lang, t } = useLang();
  const { categories } = useCategories();

  return (
    <footer className="footer-editorial">
      <div className="footer-cta">
        <div className="cta-content">
          <h2>
            {t('footerCtaLead')} <br />
            <em>{t('footerCtaEmph')}</em>
          </h2>
          <Link to="/Contact" className="btn btn-primary cta-link">
            {t('contactUs')}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="footer-main-grid">
        <div className="footer-brand">
          {/* 120×90 is a 1.33 ratio; the file is 336×246, i.e. 1.37. */}
          <img src={logo} alt="Galanteria Group" width="120" height="88" loading="lazy" />
          <p>{t('footerTagline')}</p>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          <span className="footer-col-label">
            {t('navigation')}
            <span className="footer-line" />
          </span>
          <Link to="/">{language[lang]?.menuHeader?.[0]?.name}</Link>
          <Link to="/Projects">{language[lang]?.menuHeader?.[12]?.name}</Link>
          <Link to="/Aboutus">{language[lang]?.menuHeader?.[15]?.name}</Link>
          <Link to="/Contact">{language[lang]?.menuHeader?.[14]?.name}</Link>
        </nav>

        {/* Category links in the footer are good for crawlers, and give a
            visitor at the bottom of a page somewhere to go. */}
        {categories.length > 0 && (
          <nav className="footer-nav" aria-label="Categories">
            <span className="footer-col-label">
              {t('allCategories')}
              <span className="footer-line" />
            </span>
            {categories.slice(0, 6).map((category) => (
              <Link key={category.slug} to={`/category/${category.slug}`}>
                {localized(category, 'name', lang)}
              </Link>
            ))}
          </nav>
        )}

        <div className="footer-contact">
          <span className="footer-col-label">
            {t('contactLabel')}
            <span className="footer-line" />
          </span>
          {/* These used to be hardcoded here and separately on the Contact
              page, and the two had drifted: the footer advertised
              +383 48 522 240 while the contact page advertised two entirely
              different numbers. One source now. */}
          {PHONES.map((phone) => (
            <a key={phone.href} href={phone.href}>{phone.label}</a>
          ))}
          <a href={EMAILS[0].href}>{EMAILS[0].label}</a>
          <div className="footer-whatsapp">
            {/* Was `phoneNumber={+38348522240}` — a unary-plus numeric literal
                rather than a string, which happened to work but would silently
                mangle any number with a leading zero. */}
            <AppWhatsApp phoneNumber={WHATSAPP_NUMBER} />
          </div>
        </div>

        <div className="footer-socials-col">
          <span className="footer-col-label">
            {/* Was the hardcoded English "Socials" in all three languages. */}
            {t('socials')}
            <span className="footer-line" />
          </span>
          <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>

      <div className="footer-grand-anchor" aria-hidden="true">
        <div className="grand-text">GALANTERIA</div>
      </div>

      <div className="footer-legal">
        <span className="footer-copy">
          © {new Date().getFullYear()} Galanteria Group. {t('rightsReserved')}
        </span>

        <button
          type="button"
          className="footer-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {t('backToTop')}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 12V4M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
