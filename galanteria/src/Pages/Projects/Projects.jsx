/* eslint-disable no-unused-vars */
import React, { useEffect, useContext } from 'react';
import './Projects.scss';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../Footer/Footer';
import project1 from '../../assets/images/bottom2.jpg';
import project2 from '../../assets/images/mile11.jpg';
import project3 from '../../assets/images/tika.jpg';
import project4 from '../../assets/images/usmile1.jpg';
import project5 from '../../assets/images/integrime1.jpg';
import project6 from '../../assets/images/kultur2.jpg';
import { useNavigate } from 'react-router-dom';
import language from '../../lang';
import { Context } from '../../Components/Context/Products';

const Projects = () => {
  useEffect(() => {
    // Scroll to the top of the page with smooth behavior when the component mounts
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  const [{ lang }] = useContext(Context);

  const navigate = useNavigate();

  const goToProject = (e) => {
    navigate(`/project/${e}`);
    console.log("here", e);
  };

  const images = [
    { 
      src: project1, 
      alt: {
        sq:"BottomLine Prishtinë dhe Gjenevë",
        en: "BottomLine Prishtina and Geneva",
        de: "BottomLine Prishtina und Genf"
      }
    },
    { 
      src: project2, 
      alt: {
        sq:"Millennium Challenge Account Kosovo",
        en: "Millennium Challenge Account Kosovo",
        de: "Millennium Challenge Account Kosovo"
      }
    },
    { 
      src: project5, 
      alt: {
        sq:"Ministria e Integrimeve - Republika e Kosovës",
        en: "Ministry of Integration - Republic of Kosovo",
        de: "Ministerium für Integration - Republik Kosovo"
      }
    },
    { 
      src: project6, 
      alt: {
        sq:"Ministria e Kulturës - Republika e Kosovës",
        en: "Ministry of Culture - Republic of Kosovo",
        de: "Ministerium für Kultur - Republik Kosovo"
      }
    },
    { 
      src: project3, 
      alt: {
        sq:"Tika - Qendra Për Rehabilitimin dhe Edukimin Special",
        en: "Tika - Center for Rehabilitation and Special Education",
        de: "Tika - Zentrum für Rehabilitation und Sonderpädagogik"
      }
    },
    { 
      src: project4, 
      alt: {
        sq: "U-smile office - Liège",
        en: "U-smile office - Liège",
        de: "U-smile Büro - Liège"
      }
    },
  ];

  return (
    <>
      <NavBar />
      <div className='projects-wrapper'>
        <div className='projects-text'>
          <h1>{language[lang]?.projects[0].title} <b>{language[lang]?.projects[0].title2}</b> </h1>
        </div>
        <div className='projects-images'>
          <div className='images'>
            {images.slice(0, 3).map((image, index) => (
              <div key={index}>
                <img onClick={() => goToProject(image.alt[lang].toLowerCase())} src={image.src} alt={image.alt[lang]} />
                <h4>{image.alt[lang]}</h4>
              </div>
            ))}
          </div>
          <div className='images'>
            {images.slice(3).map((image, index) => (
              <div key={index}>
                <img onClick={() => goToProject(image.alt[lang].toLowerCase())} src={image.src} alt={image.alt[lang]} />
                <h4>{image.alt[lang]}</h4>
              </div>
            ))}
          </div>
        </div>
        <hr className='office' />
        <Footer />
      </div>
    </>
  );
}

export default Projects;
