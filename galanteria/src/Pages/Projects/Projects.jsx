/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Projects.scss';
import language from '../../lang';
import { Context } from '../../Components/Context/Products';
import useSEO from '../../Hooks/useSEO';

import project1 from '../../assets/images/bottom2.jpg';
import project2 from '../../assets/images/mile11.jpg';
import project3 from '../../assets/images/tika.jpg';
import project4 from '../../assets/images/usmile1.jpg';
import project5 from '../../assets/images/integrime1.jpg';
import project6 from '../../assets/images/kultur2.jpg';

const Projects = () => {
  useSEO({
    title: 'Our Projects | Galanteria Group',
    description: 'Explore our portfolio of completed projects. See how Galanteria Group transforms spaces with elegant, functional furniture design and installations.'
  });

  const [{ lang }] = useContext(Context);
  const navigate = useNavigate();

  const goToProject = (slug) => navigate(`/project/${slug}`);

  const images = [
    { src: project1, alt: { sq: 'BottomLine Prishtinë dhe Gjenevë', en: 'BottomLine Prishtina and Geneva', de: 'BottomLine Prishtina und Genf' } },
    { src: project2, alt: { sq: 'Millennium Challenge Account Kosovo', en: 'Millennium Challenge Account Kosovo', de: 'Millennium Challenge Account Kosovo' } },
    { src: project5, alt: { sq: 'Ministria e Integrimeve - Republika e Kosovës', en: 'Ministry of Integration - Republic of Kosovo', de: 'Ministerium für Integration - Republik Kosovo' } },
    { src: project6, alt: { sq: 'Ministria e Kulturës - Republika e Kosovës', en: 'Ministry of Culture - Republic of Kosovo', de: 'Ministerium für Kultur - Republik Kosovo' } },
    { src: project3, alt: { sq: 'Tika - Qendra Për Rehabilitimin dhe Edukimin Special', en: 'Tika - Center for Rehabilitation and Special Education', de: 'Tika - Zentrum für Rehabilitation und Sonderpädagogik' } },
    { src: project4, alt: { sq: 'U-smile office - Liège', en: 'U-smile office - Liège', de: 'U-smile Büro - Liège' } },
  ];

  return (
    <div className='projects-wrapper'>

      {/* Editorial Page Header */}
      <div className='projects-header-bento'>
        <div className='header-top'>
          <span className='bento-eyebrow'>Galanteria Group</span>
          <div className='header-line'></div>
        </div>
        <h1>{language[lang]?.projects[0].title} <em>{language[lang]?.projects[0].title2}</em></h1>
      </div>

      {/* Full-bleed editorial grid — no two-column split containers */}
      <div className='projects-grid'>
        {/* First image: large feature */}
        <div
          className='project-card project-card--large'
          onClick={() => goToProject(images[0].alt['en'].toLowerCase())}
        >
          <img src={images[0].src} alt={images[0].alt[lang]} />
          <div className='project-card-info'>
            <span>{images[0].alt[lang]}</span>
          </div>
        </div>

        {/* Second image: tall right */}
        <div
          className='project-card project-card--tall'
          onClick={() => goToProject(images[1].alt['en'].toLowerCase())}
        >
          <img src={images[1].src} alt={images[1].alt[lang]} />
          <div className='project-card-info'>
            <span>{images[1].alt[lang]}</span>
          </div>
        </div>

        {/* Remaining: uniform grid */}
        {images.slice(2).map((img, i) => (
          <div
            key={i}
            className='project-card'
            onClick={() => goToProject(img.alt['en'].toLowerCase())}
          >
            <img src={img.src} alt={img.alt[lang]} />
            <div className='project-card-info'>
              <span>{img.alt[lang]}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Projects;
