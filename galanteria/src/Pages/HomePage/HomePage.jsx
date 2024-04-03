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
import d1 from '../../assets/images/Frame 53.png'
import d2 from '../../assets/images/Frame 56.png'
import d3 from '../../assets/images/Frame 51.png'

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

    <div className="ideas">
      <div>
        <h1>Need Ideas ?</h1>
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

      </div>
      <div className='ideas-button'>
        <button>See More</button>
      </div>
    </div>

    <div className="choose">
      <div className='choose-up'>
        <div className='choose-box'>
          <h3>Why choose us?</h3>
        </div>
        <div className='choose-box2'>
          <p>Our new designs, coupled with professional work and high <br /> quality production, stream the development of our industry. <br />   Galanteria Group has a wide range of products as Office <br /> furniture, School and Hotel furniture, as well as furniture for <br /> clients with special requirements.</p>
        </div>
        <div className='choose-box3'>
          <img src={s5} alt="" />
        </div>
      </div>
      <div className='choose-down'>
        <div className='down-box'>
          <div><img src={d1} alt="" /></div>
          <div>
            <h3>Warranty</h3>
            <p>We stand  behind the quality of our <br />products and offer warranty on all <br /> furniture pieces.Rest easy knowing <br /> that your investment is protected</p>
          </div>

        </div>
        <div className='down-box'>
          <div><img src={d2} alt="" /></div>
          <div>
            <h3>Affordable Price</h3>
            <p>We believe that quality furniture <br /> should be accesible to <br /> everyone.That’s why we offer a wide <br /> of products at affordable prices</p>
          </div>

        </div>
        <div className='down-box'>
          <div><img src={d3} alt="" /></div>
          <div>
            <h3>Free Shipping</h3>
            <p>We really understand our <br /> customers,so we will free shipping <br /> cost to any location quickly and <br /> safely.Enjoy shipping on all orders</p>
          </div>

        </div>
      </div>
    </div>
    
    </>
  );
}
