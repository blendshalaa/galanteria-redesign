import React, { useContext } from 'react'
import './MeetingChairs.scss'
import NavBar from '../../Components/NavBar/NavBar'
import Footer from '../Footer/Footer'
import cr1 from '../../assets/images/CREW.jpg'
import sila from '../../assets/images/SILA.jpg'
import kona2 from '../../assets/images/KONA2.png'
import visa from '../../assets/images/VISA.png'
import miss from '../../assets/images/MISS.png'
import mora from '../../assets/images/MORA.png'
import donna from '../../assets/images/DONNA.png'
import foulard from '../../assets/images/foulardd.png'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import language from '../../lang'
import LangFlag from '../../Components/NavBar/LangFlag'
import Language from '../../Components/NavBar/Language'
import { Context } from '../../Components/Context/Products'


const MeetingChairs = () => {
  const [{ lang }] = useContext(Context);


  const navigate = useNavigate();

  const goToProduct = (e) => {
    navigate(`/product/${e}`);
    console.log("here", e);
  }

  return (
    <>
      <NavBar />
      <div className='officechairs-wrapper'>


        <div className='officechairs-text'>
          <h1> {language[lang]?.meetingChairs[0].title}</h1>
        </div>
        <div className='officechairs-images'>
          <div className='images'>
            <div>
              <img onClick={() => goToProduct('crew')} src={cr1} alt="" />
              <h4>Crew</h4>

            </div>
            <div>
              <img onClick={() => goToProduct('sila')} src={sila} alt="" />
              <h4>Sila</h4>

            </div>
            <div>
              <img onClick={() => goToProduct('kona2')} src={kona2} alt="" />
              <h4>Kona</h4>
            </div>
            <div>
              <img onClick={() => goToProduct('visa')} src={visa} alt="" />
              <h4>Visa</h4>
            </div>

          </div>
         
          <div className='images'>
            <div>
              <img onClick={() => goToProduct('miss')} src={miss} alt="" />
              <h4>Miss</h4>

            </div>
            <div>
              <img onClick={() => goToProduct('mora')} src={mora} alt="" />
              <h4>Mora</h4>
            </div>
            <div>
              <img onClick={() => goToProduct('donna')} src={donna} alt="" />
              <h4>Donna</h4>
            </div>
            <div>
              <img onClick={() => goToProduct('foulard')} src={foulard} alt="" />
              <h4>Foulard</h4>

            </div>
           

          </div>

         
          


        </div>


        <hr className='office' />

        <Footer />
      </div>
    </>

  )
}

export default MeetingChairs