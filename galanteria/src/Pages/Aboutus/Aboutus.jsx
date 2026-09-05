import './Aboutus.scss';
import aboutimg from '../../assets/images/about.png';
import language from '../../lang';
import useLang from '../../Hooks/useLang';
import useSEO from '../../Hooks/useSEO';
import { useSetting } from '../../Hooks/useSiteContent';
import { SITE_URL } from '../../config/contact';

/**
 * About page.
 *
 * The admin panel's "Cilësimet" tab has always saved an `about_text` setting
 * with Albanian, English and German versions — and this page has always read
 * src/lang.js instead, so nothing the client typed there ever appeared. It now
 * prefers the database value and falls back to lang.js, which means existing
 * copy keeps showing until the client edits it.
 */
const Aboutus = () => {
  const { lang } = useLang();
  const { value: aboutText } = useSetting('about_text');

  useSEO({
    title: 'About Us | Galanteria Group',
    description:
      'Galanteria Group has been making furniture since 1987. Learn about our workshop, our partners and how we furnish offices, schools and hotels.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      url: `${SITE_URL}/Aboutus`,
      mainEntity: {
        '@type': 'Organization',
        name: 'Galanteria Group',
        foundingDate: '1987',
        url: SITE_URL,
      },
    },
  });

  const intro = aboutText?.[lang]?.trim() || language[lang]?.about?.[0]?.right2;

  return (
    <div className="about-page-premium">
      <div className="premium-container">
        <div className="premium-left">
          <div className="sticky-content">
            <span className="eyebrow">Galanteria Group</span>
            <h1>{language[lang]?.about?.[0]?.right1}</h1>
            <p className="intro-paragraph">{intro}</p>

            <div className="philosophy">
              <div className="phil-block">
                <h3>{lang === 'sq' ? 'Misioni' : lang === 'de' ? 'Unsere Mission' : 'Our Mission'}</h3>
                <p>{language[lang]?.about?.[0]?.bottom1}</p>
                <p className="phil-sub">{language[lang]?.about?.[0]?.bottom12}</p>
              </div>
              <div className="phil-block">
                <h3>{lang === 'sq' ? 'Vizioni' : lang === 'de' ? 'Unsere Vision' : 'Our Vision'}</h3>
                <p>{language[lang]?.about?.[0]?.bottom2}</p>
                <p className="phil-sub">{language[lang]?.about?.[0]?.bottom21}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="premium-right">
          <div className="hero-image">
            <img
              src={aboutimg}
              alt="The Galanteria Group showroom"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h2>1000+</h2>
              <p>{language[lang]?.about?.[0]?.left1}</p>
            </div>
            <div className="stat-card">
              <h2>200+</h2>
              <p>{language[lang]?.about?.[0]?.left2}</p>
            </div>
            <div className="stat-card stat-wide">
              <h2>15+</h2>
              <p>{language[lang]?.about?.[0]?.left3}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
