import React, { useContext, useState, useEffect } from 'react';
import './Product1.scss';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../Footer/Footer';
import language from '../../lang';
import { Context } from '../../Components/Context/Products';
import { useNavigate } from 'react-router-dom';

const Product1 = ({ data = {} }) => {
  useEffect(() => {
    // Scroll to the top of the page with smooth behavior when the component mounts
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);
  
  const [{ lang }] = useContext(Context);
  const [expandedImage, setExpandedImage] = useState(null);

  const navigate = useNavigate(); // Ensure useNavigate is imported and used

  const handleImageClick = (photo) => {
    setExpandedImage(photo);
  };

  const handleCloseExpandedImage = () => {
    setExpandedImage(null);
  };

  const handleBackClick = () => {
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
      navigate(-1);
      setTimeout(() => {
        window.scrollTo({
          top: parseInt(scrollPosition, 10),
          left: 0,
          behavior: 'smooth'
        });
      }, 0);
    } else {
      navigate(-1);
    }
  };

  const photos = data.photos || [];
  const codes = data.codep || [];

  return (
    <div className='product1-wrapper'>
      <NavBar />
      <div className="product">
        <svg onClick={handleBackClick} fill="#A7541E" height="80px" width="80px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 300.003 300.003">
          <g>
            <g>
              <path d="M150,0C67.159,0,0.001,67.159,0.001,150c0,82.838,67.157,150.003,149.997,150.003S300.002,232.838,300.002,150
                  C300.002,67.159,232.839,0,150,0z M189.226,218.202c-2.736,2.734-6.321,4.101-9.902,4.101c-3.582,0-7.169-1.367-9.902-4.103
                  l-56.295-56.292c-0.838-0.537-1.639-1.154-2.368-1.886c-2.796-2.799-4.145-6.479-4.077-10.144
                  c-0.065-3.667,1.281-7.35,4.077-10.146c0.734-0.731,1.53-1.349,2.368-1.886l56.043-56.043c5.47-5.465,14.34-5.467,19.808,0.003
                  c5.47,5.467,5.47,14.335,0,19.808l-48.265,48.265l48.514,48.516C194.695,203.864,194.695,212.732,189.226,218.202z"/>
            </g>
          </g>
        </svg>
        <div className="product-image">
          {expandedImage && (
            <div className="expanded-image-overlay" onClick={handleCloseExpandedImage}>
              <img src={expandedImage} alt="Expanded" />
            </div>
          )}
          <img src={data.firstphoto} alt="" onClick={() => handleImageClick(data.firstphoto)} />
        </div>
        <div className='product-text'>
          <h4>{data.category}</h4>
          <h5>{data.name}</h5>
        </div>
      </div>
      <div className='product-images'>
        {photos.map((photo, index) => (
          <div key={index} className="product-image-container">
            <img src={photo} alt="" onClick={() => handleImageClick(photo)} />
            <p className="image-caption">{data.name2[index]}</p>
          </div>
        ))}    
      </div>
      <hr />
      <Footer />
    </div>
  );
}

export default Product1;
