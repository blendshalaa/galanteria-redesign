/* eslint-disable no-unused-vars */
import React from 'react'
import './Aboutus.scss'
import NavBar from '../../Components/NavBar/NavBar'
import aboutimg from '../../assets/images/aboutus.png'
import periudhaimg from '../../assets/images/p3.png'
import periudhaimg1 from '../../assets/images/periudha1.png'
import Footer from '../Footer/Footer'



const Aboutus = () => {
  return (
    <div className='mainAbout'>
      <NavBar/>
      <div className='about-us-header'>
        <div className='aboutusheaderP'>
        <h1 className='aboutus-h1'>Who we are</h1>
        <p className='aboutus-p'>At Galanteria, we’re here to help you create a space that reflects you and what<br></br> you love. We’ll put it all together for you. Free one-on-one design help, in our<br></br> store or in your home!</p>
        </div>
        <div className='img-container'>
        <img className='aboutimg' src={aboutimg}></img>
        </div>
        <div className='statsTable'>
  <div className='stats-text'>
    <div>
      <h2 className='stats-h2'>600+</h2>
      <p className='stats-p'>Models Finished</p>
    </div>
    <div>
      <h2 className='stats-h2'>200+</h2>
      <p className='stats-p'>Unique assortments</p>
    </div>
    <div>
      <h2 className='stats-h2'>30+</h2>
      <p className='stats-p'>Across the country</p>
    </div>
  </div>
</div>

</div>
<div className='solutions'>
  <h2 className='solution-h2'>WE ARE BEST SOLUTIONS<br/> FOR YOUR HOME</h2>

  <div className='boxes'>
    <div className='box'>
      <h2 className='box-h2'>OUR VISION</h2>
      <p className='box-p'>Excellence and development of <br/>human, technical and technological<br/> capacities, for the fulfillment of the <br/>companys mission.</p>
    </div>
    <div className='box'>
      <h2 className='box-h2'>WHAT WE OFFER</h2>
      <p className='box-p'>Office furniture, School Furniture,<br/>  University Furniture, Hotel Furniture<br/>  Working desks, shelves, cupboards,<br/> conference  tables, hangnails etc.</p>
    </div>
    <div className='box'>
      <h2 className='box-h2'>WHAT WE OFFER</h2>
      <p className='box-p'>Office furniture, School Furniture,<br/>  University Furniture, Hotel Furniture<br/>  Working desks, shelves, cupboards,<br/> conference  tables, hangnails etc.</p>
    </div>
  </div>
</div>
<div className='line'>

</div>

<div className='periudhat'>
  <div className='periudha-1'>
    <div className='pimg-container'>
      <img src={periudhaimg} alt='foto'></img>
    </div>
    <div className='text-periudha'>
      <h3 className='h3-periudha'>Periudha <span className='periudha-span'>1987-1999</span></h3>
      <p className='periudha-p'>Excellence and development of human,<br/> technical and technological capacities,<br/> for the fulfillment of the companys mission.</p>
    </div>
  </div>
  <div className='periudha-2'>
    
    <div className='text-periudha'>
      <h3 className='h3-periudha'>Periudha <span className='periudha-span'>1987-1999</span></h3>
      <p className='periudha-p'>Excellence and development of human,<br/> technical and technological capacities,<br/> for the fulfillment of the companys mission.</p>
    </div>
    <div className='pimg-container'>
      <img src={periudhaimg1}></img>
    </div>
  </div>

</div>




<div className='periudhat-2'>
<div className='periudha-1'>
    <div className='pimg-container'>
      <img src={periudhaimg} alt='foto'></img>
    </div>
    <div className='text-periudha'>
      <h3 className='h3-periudha'>Periudha <span className='periudha-span'>1987-1999</span></h3>
      <p className='periudha-p'>Excellence and development of human,<br/> technical and technological capacities,<br/> for the fulfillment of the companys mission.</p>
    </div>
  </div>
  <div className='periudha-2'>
    
    <div className='text-periudha'>
      <h3 className='h3-periudha'>Periudha <span className='periudha-span'>1987-1999</span></h3>
      <p className='periudha-p'>Excellence and development of human,<br/> technical and technological capacities,<br/> for the fulfillment of the companys mission.</p>
    </div>
    <div className='pimg-container'>
      <img src={periudhaimg1}></img>
    </div>
  </div>
</div>
<div className='line'>
</div>

<Footer/>

      </div>
  )
}

export default Aboutus