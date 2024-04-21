import React, { useRef, useState, useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './HomePage.scss';
import NavBar from '../../Components/NavBar/NavBar'
import { Pagination, Navigation } from 'swiper/modules';
import sl1 from '../../assets/images/Frame 16.png'
import sl2 from '../../assets/images/Frame 15.png'
import sl3 from '../../assets/images/Frame 12.png'
import sl4 from '../../assets/images/Frame 18.png'
import sl5 from '../../assets/images/Frame 17.png'
import s1 from '../../assets/images/s1.png'
import s2 from '../../assets/images/s2.png'
import s3 from '../../assets/images/s3.png'
import s4 from '../../assets/images/s4.png'
import s5 from '../../assets/images/aboutus.png'
import d1 from '../../assets/images/Frame 53.png'
import d2 from '../../assets/images/Frame 56.png'
import d3 from '../../assets/images/Frame 51.png'
import Footer from '../Footer/Footer';
import language from '../../lang';
import { Context } from '../../Components/Context/Products';
import Language from '../../Components/NavBar/Language';

export default function HomePage() {

  const [{ lang }] = useContext(Context);

  return (
    <div className="home-wrapper">
      
    <NavBar/>

<div className="hero">
  <div className='h1'>
    <img src={sl1} alt="" />
  </div>
  <div className='h2'>
    <img src={sl2} alt="" />
    <p> {language[lang]?.hero[0].title}
 <br /><b>{language[lang]?.hero[0].redtitle}</b> </p>
 <h6>{language[lang]?.hero[0].subtitle}</h6>

  </div>
  <div className='h3'>
    <img src={sl3} alt="" />
  </div>
  <div className='h4'>
    <img src={sl4} alt="" />
  </div>
  <div className='h5'>
    <img src={sl5} alt="" />
  </div>
</div>
    {/* <div className="slider1">
        <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
       // pagination={true}
        breakpoints={{
          400: {
            
            slidesPerView: 2,
            spaceBetween: 20,
          },
          640: {
            
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 10,
            
          },
        }}
         //navigation={true}
        // modules={[Pagination, Navigation]}
        className="mySwiper1"
      >
        <div className="swipers">
           
          <SwiperSlide  ><img className='a' src={sl1} alt="" /></SwiperSlide>
        <SwiperSlide className='s'><img className='b' src={sl2} alt="" />
        <p> {language[lang]?.hero[0].title}
 <br /><b>{language[lang]?.hero[0].redtitle}</b> </p>
        <h6>{language[lang]?.hero[0].subtitle}</h6>
        </SwiperSlide>
        <SwiperSlide ><img className='c' src={sl3} alt="" /></SwiperSlide>
        <SwiperSlide  ><img className='d' src={sl4} alt="" /></SwiperSlide>
        <SwiperSlide><img className='e' src={sl5} alt="" /></SwiperSlide>
        <SwiperSlide ><img className='e' src={s5} alt="" /></SwiperSlide>
        <SwiperSlide ><img className='c' src={sl3} alt="" /></SwiperSlide>


 

        </div>
       
      </Swiper>
    </div> */}
  
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
        <SwiperSlide className='s'><img src={s1} alt="" /><p>{language[lang]?.categories[0].product1}</p></SwiperSlide>
        <SwiperSlide className='s'><img src={s2} alt="" /><p>{language[lang]?.categories[0].product2}</p></SwiperSlide>
        <SwiperSlide  className='s'><img src={s3} alt="" /><p>{language[lang]?.categories[0].product3}</p></SwiperSlide>
        <SwiperSlide  className='s'><img src={s4} alt="" /><p>{language[lang]?.categories[0].product4}</p></SwiperSlide>
        <SwiperSlide  className='s'><img src={s1} alt="" /><p>{language[lang]?.categories[0].product1}</p></SwiperSlide>
        <SwiperSlide  className='s'><img src={s2} alt="" /><p>{language[lang]?.categories[0].product2}</p></SwiperSlide>
        <SwiperSlide  className='s'><img src={s3} alt="" /><p>{language[lang]?.categories[0].product3}</p></SwiperSlide>
        <SwiperSlide  className='s'><img src={s4} alt="" /><p>{language[lang]?.categories[0].product4}</p></SwiperSlide>
      </Swiper>
    </div>
    <div className="ideas">
      <div>
        <h1>{language[lang]?.ideas[0].title}</h1>
      </div>
      <div className='ideas-boxes'>
        <div >
          <img src={s1} alt="" />
        </div>
        <div>
        <img src={s2} alt="" />

        </div>
        <div>
        <img src={s3} alt="" />

        </div>
        <div >
          <img src={s1} alt="" />
        </div>

      </div>
      <div className='ideas-button'>
        <button>{language[lang]?.ideas[0].button}</button>
      </div>
    </div>
    <div className="choose">
      <div className='choose-up'>
        <div className='choose-box'>
          <h3>{language[lang]?.choose[0].title}</h3>
        </div>
        <div className='choose-box2'>
          <p>{language[lang]?.choose[0].text}</p>
        </div>
        <div className='choose-box3'>
          <img src={s5} alt="" />
        </div>
      </div>
      <div className='choose-down'>
        <div className='down-box'>
          <div><img src={d1} alt="" /></div>
          <div>
            <h3>{language[lang]?.choose[0].boxtitle1}</h3>
            <p>{language[lang]?.choose[0].boxtext1}</p>
          </div>

        </div>
        <div className='down-box'>
          <div><img src={d2} alt="" /></div>
          <div>
          <h3>{language[lang]?.choose[0].boxtitle2}</h3>
            <p>{language[lang]?.choose[0].boxtext2}</p>
          </div>

        </div>
        <div className='down-box'>
          <div><img src={d3} alt="" /></div>
          <div>
          <h3>{language[lang]?.choose[0].boxtitle3}</h3>
            <p>{language[lang]?.choose[0].boxtext3}</p>
          </div>

        </div>
      </div>
     
    </div>
    <Footer/>
  
    </div> 
  );
}