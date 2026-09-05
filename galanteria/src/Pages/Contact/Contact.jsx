import './Contact.scss';
import language from '../../lang';
import useLang from '../../Hooks/useLang';
import useSEO from '../../Hooks/useSEO';
import ContactForm from '../../Components/ContactForm/ContactForm';
import { EMAILS, PHONES, SITE_URL } from '../../config/contact';

/**
 * Contact page.
 *
 * The page previously contained no form at all — just read-only info blocks and
 * a map. A visitor's only options were to dial a number, open their mail client
 * or tap WhatsApp, none of which the client could see or follow up on.
 *
 * Phone numbers now come from config/contact.js. They used to be hardcoded here
 * *and* in the footer, and the two lists had drifted apart, so the site
 * advertised different numbers on different pages.
 */
const Contact = () => {
  const { lang, t } = useLang();

  useSEO({
    title: 'Contact Us | Galanteria Group',
    description:
      'Get in touch with Galanteria Group. Visit our showroom in Podujevë, send us a message, or call us directly for premium furniture enquiries.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      url: `${SITE_URL}/Contact`,
      mainEntity: {
        '@type': 'Organization',
        name: 'Galanteria Group',
        telephone: PHONES.map((phone) => phone.label),
        email: EMAILS[0]?.label,
      },
    },
  });

  return (
    <div className="contact-page-bento">
      <div className="bento-container">
        <div className="bento-header">
          <div className="header-top">
            <span className="bento-eyebrow">Galanteria Group</span>
            <div className="header-line" />
          </div>
          <h1>{language[lang]?.contact?.[0]?.title}</h1>
          <p className="editorial-intro">{language[lang]?.contact?.[0]?.subtitle}</p>
        </div>

        <div className="bento-grid-contact">
          <div className="bento-box bento-map">
            <iframe
              className="map-iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2921.754710513295!2d21.190889575659696!3d42.92021389952976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1354afa471710343%3A0xfeff29f135d13fa3!2sGalanteria%20sh.p.k!5e0!3m2!1sen!2s!4v1712843581952!5m2!1sen!2s"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Galanteria Showroom Map"
            />
          </div>

          <div className="bento-box bento-info">
            <div className="info-watermark" aria-hidden="true">PR</div>
            <div className="info-inner">
              <div className="info-top">
                <span className="info-label">{t('labelLocation')}</span>
              </div>
              <div className="info-mid">
                <h3>{language[lang]?.contact?.[0]?.left1}</h3>
              </div>
              <div className="info-bottom">
                <p>{language[lang]?.contact?.[0]?.left12}</p>
                <p>{language[lang]?.contact?.[0]?.left13}</p>
              </div>
            </div>
          </div>

          <div className="bento-box bento-info bento-info-accent">
            <div className="info-watermark" aria-hidden="true">+</div>
            <div className="info-inner">
              <div className="info-top">
                <span className="info-label">{t('labelPhone')}</span>
              </div>
              <div className="info-mid">
                <h3>{language[lang]?.contact?.[0]?.left2}</h3>
              </div>
              <div className="info-bottom">
                {PHONES.map((phone) => (
                  <a key={phone.href} href={phone.href}>{phone.label}</a>
                ))}
              </div>
            </div>
          </div>

          <div className="bento-box bento-info">
            <div className="info-watermark" aria-hidden="true">@</div>
            <div className="info-inner">
              <div className="info-top">
                <span className="info-label">Email</span>
              </div>
              <div className="info-mid">
                <h3>Galanteria</h3>
              </div>
              <div className="info-bottom">
                {EMAILS.map((email) => (
                  <a
                    key={email.href}
                    href={email.href}
                    {...(email.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {email.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* The conversion path the site did not have.
            ContactForm renders its own visible <h2> in `.cf-header`, so the
            screen-reader-only <h2> that used to sit here was a second heading
            with identical text. */}
        <section className="contact-form-section" aria-label={t('contactFormTitle')}>
          <ContactForm />
        </section>
      </div>
    </div>
  );
};

export default Contact;
