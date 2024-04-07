/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React from 'react'
import './Contact.scss'
import NavBar from '../../Components/NavBar/NavBar'
import icon1 from '../../assets/images/locationicon.png'
import icon2 from '../../assets/images/callicon.png'
import icon3 from '../../assets/images/emailicon.png'


const Contact = () => {
  return (
    <div>
      <NavBar/>
      <div className='contact-header'>
        <div>
          <h1>Contact Us</h1>
          <p>Get in touch and let us know how we can help</p>
        </div>
        </div>
        <div className='boxes-contact'>
          <div className='box-contact-1'>
            <div className='icon-container'>
              <img className='ic' src={icon1} alt='icon'></img>
            </div>
           <h3>Adress</h3>
           <p>#1 Junaid Plza,Mumbra-400612</p>
          </div>
          
          <div className='box-contact-1'>
            <div className='icon-container'>
              <img className='ic' src={icon2} alt='icon'></img>
            </div>
           <h3>Contact</h3>
           <p>+38344841272</p>
           <p>+38344841272</p>
          </div>


          <div className='box-contact-1'>
            <div className='icon-container'>
              <img className='ic' src={icon3} alt='icon'></img>
            </div>
           <h3>Email</h3>
           <p>galanteria@gmail.com</p>
           <p>galanteria@gmail.com</p>
          </div>

        </div>
        <div className='line'>

        </div>

        <div className='location-section'>
          <div className='location-text'>
          <h1>Find our Store in Prishtina</h1>
          <p>Visit our store in the city</p>
          </div>

          <div className='location-map'>
          </div>
          
          
        </div>
     


    </div>
  )
}

export default Contact