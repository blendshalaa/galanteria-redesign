/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React from 'react'
import './Contact.scss'
import NavBar from '../../Components/NavBar/NavBar'
import icon1 from '../../assets/images/locationicon.png'
import icon2 from '../../assets/images/callicon.png'
import icon3 from '../../assets/images/emailicon.png'
import Footer from '../../Pages/Footer/Footer'


const Contact = () => {
  return (
    <div>
      <NavBar/>
      <div className='contact-header'>
        <div>
          <h1>Contact Us</h1>
          <p className='contact-h-p'>Get in touch and let us know how we can help</p>
        </div>
        </div>
        <div className='boxes-contact'>
          <div className='box-contact-1'>
            <div className='icon-container'>
              <img className='ic' src={icon1} alt='icon'></img>
            </div>
           <h3>Adress</h3>
           <p className='contact-h-p'>#1 Junaid Plza,Mumbra-400612</p>
          </div>
          
          <div className='box-contact-1'>
            <div className='icon-container'>
              <img className='ic' src={icon2} alt='icon'></img>
            </div>
           <h3>Contact</h3>
           <p className='contact-h-p'>+38344841272</p>
           <p className='contact-h-p'>+38344841272</p>
          </div>


          <div className='box-contact-1'>
            <div className='icon-container'>
              <img className='ic' src={icon3} alt='icon'></img>
            </div>
           <h3>Email</h3>
           <p className='contact-h-p'>galanteria@gmail.com</p>
           <p className='contact-h-p'>galanteria@gmail.com</p>
          </div>

        </div>
        <div className='line'>

        </div>

        <div className='location-section'>
          <div className='location-text'>
          <h1>Find our Store in Prishtina</h1>
          <p className='contact-h-p'>Visit our store in the city</p>
          </div>

          <div className='map-responsive'>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2921.754710513295!2d21.190889575659696!3d42.92021389952976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1354afa471710343%3A0xfeff29f135d13fa3!2sGalanteria%20sh.p.k!5e0!3m2!1sen!2s!4v1712843581952!5m2!1sen!2s"
           width="600" height="450"
           allowfullscreen
           loading="lazy" referrerpolicy="no-referrer-when-downgrade"
           title='Responsive Google Map'></iframe>
          </div>
          
          
        </div>
      
     
<div className='line'>
  
</div>
<Footer/>
    </div>
  )
}

export default Contact