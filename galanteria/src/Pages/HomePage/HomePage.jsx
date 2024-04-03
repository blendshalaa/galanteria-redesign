import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './HomePage.scss';
import NavBar from '../../Components/NavBar/NavBar'

// import required modules
import { Pagination, Navigation } from 'swiper/modules';
import s1 from '../../assets/images/s1.png'
import s2 from '../../assets/images/s2.png'
import s3 from '../../assets/images/s3.png'
import s4 from '../../assets/images/s4.png'
import s5 from '../../assets/images/aboutus.png'

export default function App() {
  return (
    <>


    <NavBar/>

    <div className="slider1">
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
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 10,
          },
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper1"
      >
        <div className="swipers">
           
          <SwiperSlide  ><img className='a' src={s1} alt="" /></SwiperSlide>
        <SwiperSlide className='s'><img className='b' src={s2} alt="" />
        <p>FURNITURE AND ACCESSORIES <br /><b>FOR MODERN <br />INTERIER</b> </p>
        <h6>TAKE ADVANTAGE OF OUR IDEAS TO CREATE AN INTERIOR THAT SUITS YOU</h6>
        </SwiperSlide>
        <SwiperSlide ><img className='c' src={s3} alt="" /></SwiperSlide>
        <SwiperSlide  ><img className='d' src={s4} alt="" /></SwiperSlide>
        <SwiperSlide><img className='e' src={s5} alt="" /></SwiperSlide>
        {/* <SwiperSlide ><img className='e' src={s5} alt="" /></SwiperSlide> */}


 

        </div>
       
      </Swiper>
    </div>
  
    <div className="slider">
      <h1>Popular Categories</h1>
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
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 0,
          },
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide className='s'>
          <img src={s1} alt="" />
          <p>Couches</p>
          </SwiperSlide>
        <SwiperSlide className='s'><img src={s2} alt="" /><p>Chairs</p></SwiperSlide>
        <SwiperSlide  className='s'><img src={s3} alt="" /><p>Sofas</p></SwiperSlide>
        <SwiperSlide  className='s'><img src={s4} alt="" /><p>Living Rooms</p></SwiperSlide>
        <SwiperSlide  className='s'><img src={s1} alt="" /><p>Couches</p></SwiperSlide>
        <SwiperSlide  className='s'><img src={s2} alt="" /><p>Couches</p></SwiperSlide>
        <SwiperSlide  className='s'><img src={s3} alt="" /><p>Couches</p></SwiperSlide>
        <SwiperSlide  className='s'><img src={s4} alt="" /><p>Couches</p></SwiperSlide>
      </Swiper>
    </div>
    
    </>
  );
}
