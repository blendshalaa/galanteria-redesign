/* eslint-disable no-unused-vars */
import React, { useRef, useState, useContext, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './HomePage.scss';
import NavBar from '../../Components/NavBar/NavBar';
import sl1 from '../../assets/images/MT004.jpg';
import sl2 from '../../assets/images/o001.jpg';
import sl3 from '../../assets/images/lightttc.jpg';
import sl4 from '../../assets/images/w001.jpg';
import sl5 from '../../assets/images/gili.png';
import s1 from '../../assets/images/milano1.jpg';
import s2 from '../../assets/images/resim_20459.jpg';
import s3 from '../../assets/images/a003.jpg';
import s4 from '../../assets/images/FOULARD.jpg';
import s5 from '../../assets/images/WS005.jpg';
import s6 from '../../assets/images/CB006.jpg';
import s7 from '../../assets/images/b1.jpg';
import s8 from '../../assets/images/MT003.jpg';
import s9 from '../../assets/images/ST001.png';
import s10 from '../../assets/images/RD003.jpg';
import s11 from '../../assets/images/aboutus.png';
import d1 from '../../assets/images/Frame 53.png';
import d2 from '../../assets/images/Frame 56.png';
import d3 from '../../assets/images/Frame 51.png';
import Footer from '../Footer/Footer';
import language from '../../lang';
import { Context } from '../../Components/Context/Products';
import Language from '../../Components/NavBar/Language';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import p1 from '../../assets/images/p1.avif';
import p2 from '../../assets/images/p2.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function HomePage() {
  
  const [{ lang }] = useContext(Context);
  const navigate = useNavigate(); // Create a navigate function

  const handleClick = () => {
    navigate('/WaitingChairs'); // Use navigate to go to /WaitingChairs
  };
  const handleClick2 = () => {
    navigate('/OfficeChairs'); // Use navigate to go to /WaitingChairs
  };
  const handleClick3 = () => {
    navigate('/WorkingTable'); // Use navigate to go to /WaitingChairs
  }; const handleClick4 = () => {
    navigate('/MeetingChairs'); // Use navigate to go to /WaitingChairs
  }; const handleClick5 = () => {
    navigate('/Workstation'); // Use navigate to go to /WaitingChairs
  }; const handleClick6 = () => {
    navigate('Cabinets'); // Use navigate to go to /WaitingChairs
  }; const handleClick7 = () => {
    navigate('/WaitingChairs'); // Use navigate to go to /WaitingChairs
  }; const handleClick8 = () => {
    navigate('/MeetingTable'); // Use navigate to go to /WaitingChairs
  }; const handleClick9 = () => {
    navigate('/Drawers'); // Use navigate to go to /WaitingChairs
  }; const handleClick10 = () => {
    navigate('/Others'); // Use navigate to go to /WaitingChairs
  };

  return (
    <div className="home-wrapper">
      <NavBar />

      <div className="hero">
        <div className='h1'>
          <img src={sl1} alt="" />
        </div>
        <div className='h2'>
          <img src={sl2} alt="" />
          <p>{language[lang]?.hero[0].title}
            <br /><b>{language[lang]?.hero[0].redtitle}</b> </p>
          <h6>{language[lang]?.hero[0].subtitle}</h6>
        </div>
        <div className='h3'>
          <img style={{ width: '320px', height: '423px', borderRadius: '10px', objectFit: 'cover' }} src={sl3} alt="" />
        </div>
        <div className='h4'>
          <img src={sl4} alt="" />
        </div>
        <div className='h5'>
          <img src={sl5} alt="" />
        </div>
      </div>

      <div className="slider">
        <h1>{language[lang]?.categories[0].title}</h1>
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          pagination={false}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 0,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 3,
            },
            1524: {
              slidesPerView: 5,
              spaceBetween: 3,
            },
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {/* <SwiperSlide className='s'>
            <img onClick={handleClick} src={s1} alt="" />
            <p>{language[lang]?.categories[0].product1}</p>
          </SwiperSlide> */}
          <SwiperSlide className='s'>
            <img onClick={handleClick2} src={s2} alt="" />
            <p>{language[lang]?.categories[0].product2}</p>
          </SwiperSlide>
          <SwiperSlide className='s'>
            <img onClick={handleClick3} src={s3} alt="" />
            <p>{language[lang]?.categories[0].product3}</p>
          </SwiperSlide>
          <SwiperSlide className='s'>
            <img onClick={handleClick4} src={s4} alt="" />
            <p>{language[lang]?.categories[0].product4}</p>
          </SwiperSlide> 
          <SwiperSlide className='s'>
            <img onClick={handleClick6} src={s6} alt="" />
            <p>{language[lang]?.categories[0].product6}</p>
          </SwiperSlide>
          <SwiperSlide className='s'>
            <img onClick={handleClick5} src={s5} alt="" />
            <p>{language[lang]?.categories[0].product5}</p>
          </SwiperSlide>
         
          <SwiperSlide className='s'>
            <img onClick={handleClick7} src={s7} alt="" />
            <p>{language[lang]?.categories[0].product7}</p>
          </SwiperSlide>
          <SwiperSlide className='s'>
            <img onClick={handleClick8} src={s8} alt="" />
            <p>{language[lang]?.categories[0].product8}</p>
          </SwiperSlide>
          <SwiperSlide className='s'>
            <img onClick={handleClick9} src={s9} alt="" />
            <p>{language[lang]?.categories[0].product9}</p>
          </SwiperSlide>
          <SwiperSlide className='s'>
            <img onClick={handleClick10} src={s10} alt="" />
            <p>{language[lang]?.categories[0].product10}</p>
          </SwiperSlide>
        </Swiper>
      </div>

      <div className='last-wrapper'>
        <h1>{language[lang]?.clients[0].title} </h1>

        <Swiper
          cssMode={true}
          navigation={true}
          pagination={true}
          mousewheel={true}
          keyboard={true}
          modules={[Navigation, Pagination, Mousewheel, Keyboard]}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className="text">
              <h1>{language[lang]?.clients[0].name1} </h1>
              <p>{language[lang]?.clients[0].text1} </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="text">
              <h1>{language[lang]?.clients[0].name2} </h1>
              <p>{language[lang]?.clients[0].text2} </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="text">
              <h1>{language[lang]?.clients[0].name3} </h1>
              <p>{language[lang]?.clients[0].text3} </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="text">
              <h1>{language[lang]?.clients[0].name4} </h1>
              <p>{language[lang]?.clients[0].text4} </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="text">
              <h1>{language[lang]?.clients[0].name5} </h1>
              <p>{language[lang]?.clients[0].text5} </p>
            </div>
          </SwiperSlide> <SwiperSlide>
            <div className="text">
              <h1>{language[lang]?.clients[0].name6} </h1>
              <p>{language[lang]?.clients[0].text6} </p>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

     
      <div className="partners">
        <h1>{language[lang]?.partners[0].partnertitle}</h1>
        <div className='sec'>
          <div className="text">
              <div className='p-text'>
            <h1>{language[lang]?.partners[0].up}</h1>
            <p>{language[lang]?.partners[0].down}</p>
          </div>
          <div className='p-text'>
            <h1>{language[lang]?.partners[0].up2}</h1>
            <p>{language[lang]?.partners[0].down2}</p>
          </div>
          </div>
        
          <div className='p-img'>
            <img src={p1} alt="" />
            <img src={p2} alt="" />
          </div>
        </div>
      </div>
    

      <Footer />
    </div>
  );
}
