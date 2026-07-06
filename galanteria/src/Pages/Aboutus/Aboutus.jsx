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
    <div className='about-page-premium'>
      <div className='premium-container'>
        
        {/* Left Side: Sticky Text Content */}
        <div className='premium-left'>
          <div className='sticky-content'>
            <span className='eyebrow'>Galanteria Group</span>
            <h1>{language[lang]?.about[0].right1}</h1>
            <p className='intro-paragraph'>{language[lang]?.about[0].right2}</p>
            
            <div className='philosophy'>
              <div className='phil-block'>
                <h3>{lang === 'sq' ? 'Misioni' : lang === 'de' ? 'Unsere Mission' : 'Our Mission'}</h3>
                <p>{language[lang]?.about[0].bottom1}</p>
                <p className='phil-sub'>{language[lang]?.about[0].bottom12}</p>
              </div>
              <div className='phil-block'>
                <h3>{lang === 'sq' ? 'Vizioni' : lang === 'de' ? 'Unsere Vision' : 'Our Vision'}</h3>
                <p>{language[lang]?.about[0].bottom2}</p>
                <p className='phil-sub'>{language[lang]?.about[0].bottom21}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Scrolling Visuals */}
        <div className='premium-right'>
          <div className='hero-image'>
            <img src={aboutimg} alt="Galanteria showroom" />
          </div>

          <div className='stats-grid'>
            <div className='stat-card'>
              <h2>1000+</h2>
              <p>{language[lang]?.about[0].left1}</p>
            </div>
            <div className='stat-card'>
              <h2>200+</h2>
              <p>{language[lang]?.about[0].left2}</p>
            </div>
            <div className='stat-card stat-wide'>
              <h2>15+</h2>
              <p>{language[lang]?.about[0].left3}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;