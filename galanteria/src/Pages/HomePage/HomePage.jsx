/* eslint-disable no-unused-vars */
import React, { useRef, useState, useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './HomePage.scss';
import NavBar from '../../Components/NavBar/NavBar'
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
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import p1 from '../../assets/images/p1.avif'
import p2 from '../../assets/images/p2.png'
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

      </Swiper>



    </div>
    <div className="mid">
    <div class="overlay"></div>

      <div className="mid-text">
            <h1 >{language[lang]?.partners[0].title}</h1> 
<p>{language[lang]?.partners[0].subtitle}</p>
      </div>

    </div>
    <div className="partners">
      <h1>{language[lang]?.partners[0].partnertitle}</h1>
      <div className='sec'>
         <div className='p-text'>
        <h1>{language[lang]?.partners[0].up}</h1> 
        <p>{language[lang]?.partners[0].down}</p>


      </div>
      <div className='p-img'>

        <img src={p1} alt="" />
        <img src={p2} alt="" />
      </div>
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