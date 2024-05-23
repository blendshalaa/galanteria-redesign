import React, { useContext, useState } from 'react';
import './Others.scss';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../Footer/Footer';
import o1 from '../../assets/images/RD001.jpg'
import o2 from '../../assets/images/RD002.jpg'
import o3 from '../../assets/images/RD003.jpg'
import o4 from '../../assets/images/RD004.png'


import { useNavigate } from 'react-router-dom';
import language from '../../lang';
import { Context } from '../../Components/Context/Products';

const Others = () => {
  const [{ lang }] = useContext(Context);
  const [expandedImage, setExpandedImage] = useState(null);

  const navigate = useNavigate();

  const goToProduct = (e) => {
    navigate(`/product/${e}`);
    console.log("here", e);
  }

  const handleImageClick = (photo) => {
    setExpandedImage(photo);
  };

  const handleCloseExpandedImage = () => {
    setExpandedImage(null);
  };

  const images = [
    { src: o1, alt: "RD001" }, { src: o2, alt: "RD002" }, { src: o3, alt: "RD003" }, { src: o4, alt: "RD004" },
   
  ];

  return (
    <div>
      <NavBar />
      <div className='workstation-wrapper'>
        {expandedImage && (
          <div className="expanded-image-overlay" onClick={handleCloseExpandedImage}>
            <img src={expandedImage} alt="Expanded" />
          </div>
        )}
        <div className='workstation-text'>
          <h1>{language[lang]?.others[0].title}</h1>
        </div>
        <div className='workstation-images'>
          {images.map((image, index) => (
            <div key={index} className='image-container'>
              <img src={image.src} alt={image.alt} onClick={() => handleImageClick(image.src)} />
              <h4>{image.alt}</h4>
            </div>
          ))}
        </div>
        <hr className='office' />
        <Footer />
      </div>
    </div>
  );
}

export default Others;
