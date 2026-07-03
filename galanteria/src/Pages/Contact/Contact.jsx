import React, { useContext, useEffect } from 'react';
import './Contact.scss';
import language from '../../lang';
import { Context } from '../../Components/Context/Products';
import useSEO from '../../Hooks/useSEO';

const Contact = () => {
  useSEO({
    title: 'Contact Us | Galanteria Group',
    description: 'Get in touch with Galanteria Group. Find our showroom location in Pristina, email us, or call us directly for premium furniture inquiries.'
  });

  const gmailLink1 = "https://mail.google.com/mail/?view=cm&fs=1&to=galanteriashpk@gmail.com";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [{ lang }] = useContext(Context);

  return (
    <div className='contact-page-bento'>
      <div className='bento-container'>
        
        {/* Editorial Page Header */}
        <div className='bento-header'>
          <div className='header-top'>
            <span className='bento-eyebrow'>Galanteria Group</span>
            <div className='header-line'></div>
          </div>
          <h1>{language[lang]?.contact[0].title}</h1>
          <p className='editorial-intro'>{language[lang]?.contact[0].subtitle}</p>
        </div>

        {/* The Bento Grid */}
        <div className='bento-grid-contact'>
          
          {/* Map Block (Large, Left) */}
          <div className='bento-box bento-map'>
            <iframe 
              className='map-iframe' 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2921.754710513295!2d21.190889575659696!3d42.92021389952976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1354afa471710343%3A0xfeff29f135d13fa3!2sGalanteria%20sh.p.k!5e0!3m2!1sen!2s!4v1712843581952!5m2!1sen!2s"
              allowFullScreen
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title='Galanteria Showroom Map'
            ></iframe>
          </div>

          {/* Location Block */}
          <div className='bento-box bento-info'>
            <div className='info-watermark'>PR</div>
            <div className='info-inner'>
              <div className='info-top'>
                <span className='info-label'>
                  {lang === 'sq' ? 'Lokacioni' : lang === 'de' ? 'Standort' : 'Location'}
                </span>
              </div>
              <div className='info-mid'>
                <h3>{language[lang]?.contact[0].left1}</h3>
              </div>
              <div className='info-bottom'>
                <p>{language[lang]?.contact[0].left12}</p>
                <p>{language[lang]?.contact[0].left13}</p>
              </div>
            </div>
          </div>

          {/* Phone Block (Accent) */}
          <div className='bento-box bento-info bento-info-accent'>
            <div className='info-watermark'>+</div>
            <div className='info-inner'>
              <div className='info-top'>
                <span className='info-label'>
                  {lang === 'sq' ? 'Telefon' : lang === 'de' ? 'Telefon' : 'Phone'}
                </span>
              </div>
              <div className='info-mid'>
                <h3>{language[lang]?.contact[0].left2}</h3>
              </div>
              <div className='info-bottom'>
                <a href="tel:+38344259469">+383 44 259 469</a>
                <a href="tel:+38344945949">+383 44 945 949</a>
              </div>
            </div>
          </div>

          {/* Email Block */}
          <div className='bento-box bento-info'>
            <div className='info-watermark'>@</div>
            <div className='info-inner'>
              <div className='info-top'>
                <span className='info-label'>Email</span>
              </div>
              <div className='info-mid'>
                <h3>Galanteria</h3>
              </div>
              <div className='info-bottom'>
                <a href="mailto:info@galanteriagroup.com">info@galanteriagroup.com</a>
                <a href={gmailLink1} target="_blank" rel="noopener noreferrer">galanteriashpk@gmail.com</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;