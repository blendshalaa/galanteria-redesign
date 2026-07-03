import React, { useContext, useEffect } from 'react';
import './Aboutus.scss';
import aboutimg from '../../assets/images/about.png';
import language from '../../lang';
import { Context } from '../../Components/Context/Products';
import useSEO from '../../Hooks/useSEO';

const Aboutus = () => {
  useSEO({
    title: 'About Us | Galanteria Group',
    description: 'Learn more about Galanteria Group. With over 25 years of experience, we provide premium office furniture and custom workstation solutions across Europe.'
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [{ lang }] = useContext(Context);

  return (
    <div className='about-page-bento'>
      <div className='bento-container'>
        
        {/* Page Header - Editorial Typography */}
        <div className='bento-header'>
          <div className='header-top'>
            <span className='bento-eyebrow'>Galanteria Group</span>
            <div className='header-line'></div>
          </div>
          <h1>
            {language[lang]?.about[0].right1}
          </h1>
          <p className='editorial-intro'>{language[lang]?.about[0].right2}</p>
        </div>

        {/* The Bento Grid */}
        <div className='bento-grid'>
          
          {/* Row 1 & 2 Left: Main Image (2x2) */}
          <div className='bento-box bento-image'>
            <img src={aboutimg} alt="Galanteria showroom" />
          </div>

          {/* Row 1 Right: Stat 1 & 2 (1x1 each) */}
          <div className='bento-box bento-stat'>
            <h2>1000+</h2>
            <p>{language[lang]?.about[0].left1}</p>
          </div>

          <div className='bento-box bento-stat'>
            <h2>200+</h2>
            <p>{language[lang]?.about[0].left2}</p>
          </div>

          {/* Row 2 Right: Stat 3 (2x1 wide) */}
          <div className='bento-box bento-stat bento-stat-wide'>
            <h2>15+</h2>
            <p>{language[lang]?.about[0].left3}</p>
          </div>

          {/* Row 3 & 4 Left: Mission (2x2) */}
          <div className='bento-box bento-mission bento-mission-accent'>
            <div className='mission-watermark'>M</div>
            <div className='mission-inner'>
              <div className='mission-top'>
                <span className='mission-label'>
                  {lang === 'sq' ? 'Misioni' : lang === 'de' ? 'Unsere Mission' : 'Our Mission'}
                </span>
              </div>
              <div className='mission-mid'>
                <h3>{language[lang]?.about[0].bottom1}</h3>
              </div>
              <div className='mission-bottom'>
                <p>{language[lang]?.about[0].bottom12}</p>
              </div>
            </div>
          </div>

          {/* Row 3 & 4 Right: Vision (2x2) */}
          <div className='bento-box bento-mission bento-vision'>
            <div className='mission-watermark'>V</div>
            <div className='mission-inner'>
              <div className='mission-top'>
                <span className='mission-label'>
                  {lang === 'sq' ? 'Vizioni' : lang === 'de' ? 'Unsere Vision' : 'Our Vision'}
                </span>
              </div>
              <div className='mission-mid'>
                <h3>{language[lang]?.about[0].bottom2}</h3>
              </div>
              <div className='mission-bottom'>
                <p>{language[lang]?.about[0].bottom21}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Aboutus;