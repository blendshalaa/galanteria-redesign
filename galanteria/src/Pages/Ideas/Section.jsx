/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import './Section.scss'

function Section({className,title,image1,image2,image3}) {

    function handleClick(){

    }

  return (
    <div>
        <div className={className}>
      <h2 className='title'>{title}</h2>
      <div className='img-container'>
        <img src={image1} alt='img'></img>
        <img src={image2} alt='img'></img>
        <img src={image3} alt='img'></img>
      </div>
      <div className='button-container'>
      <button className='button-idea' onClick={handleClick}>Watch Everything</button>
      </div>
    </div>

    </div>
  )
}

export default Section