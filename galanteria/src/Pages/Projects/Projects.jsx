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

  const goToProduct = (e) => {
    navigate(`/product/${e}`);
    console.log("here", e);
  };

  const images = [
    { src: project1, alt: "BottomLine Prishtina and Geneva" },     { src: project2, alt: "Millennium Challenge Account Kosovo" },

    { src: project5, alt: "Ministria e Integrimeve - Republika e Kosovës" },
    { src: project6, alt: "Ministria e Kulturës - Republika e Kosovës" },
    { src: project3, alt: "Tika - Qendra për Rehabilitimin dhe Edukimin Special" },
    { src: project4, alt: "U-smile office - Liège" },
   
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
                <img onClick={() => goToProduct(image.alt.toLowerCase())} src={image.src} alt={image.alt} />
                <h4>{image.alt}</h4>
              </div>
            ))}
          </div>
          <div className='images'>
            {images.slice(3).map((image, index) => (
              <div key={index}>
                <img onClick={() => goToProduct(image.alt.toLowerCase())} src={image.src} alt={image.alt} />
                <h4>{image.alt}</h4>
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
