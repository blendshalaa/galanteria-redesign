/* eslint-disable no-unused-vars */
import React from 'react'
import './Ideas.scss'
import NavBar from '../../Components/NavBar/NavBar'
import livingroom from '../../assets/images/livingroom.png'
import livingroom2 from '../../assets/images/livingroom2.png'
import livingroom3 from '../../assets/images/livingroom3.png'
import Section from './Section'
import Footer from '../Footer/Footer'

const Ideas = () => {
  return (
    <div>
      <NavBar/>
      <h1 className='ideas-header'>Ideas for the interior</h1>
      <div className='line'></div>
      <div className='secondary-nav'>
      <ul className='nav-sec'>
  <li className='nav-link'><a href='#living-room'>Living Room</a></li>
  <li className='nav-link'><a href='#bedroom'>Bedroom</a></li>
  <li className='nav-link'><a href='#chairs'>Chairs</a></li>
  <li className='nav-link'><a href='#bathroom'>Bathroom</a></li>
  <li className='nav-link'><a href='#kitchen'>Kitchen</a></li>
</ul>

      </div>
      <div className='line'></div>
      <div>
      <div className='sections'>
        <Section title='Living Room'
        className='living-room'
        image1={livingroom}
        image2={livingroom2}
        image3={livingroom3}/>
      </div>
      <div className='line'>

      </div>
      <div className='sections'>
        <Section title='Living Room'
        className='living-room'
        image1={livingroom}
        image2={livingroom2}
        image3={livingroom3}/>
      </div>
      <div className='line'>
        
      </div>
      <div className='sections'>
        <Section title='Living Room'
        className='living-room'
        image1={livingroom}
        image2={livingroom2}
        image3={livingroom3}/>
      </div>
      <div className='line'>
        
      </div>
      <div className='sections'>
        <Section title='Living Room'
        className='living-room'
        image1={livingroom}
        image2={livingroom2}
        image3={livingroom3}/>
      </div>
      <div className='line'>
        
        </div>

      <div className='sections'>
        <Section title='Living Room'
        className='living-room'
        image1={livingroom}
        image2={livingroom2}
        image3={livingroom3}/>
      </div>
     
      
      
      <div className='line'>
        
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Ideas