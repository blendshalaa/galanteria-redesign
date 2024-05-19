/* eslint-disable no-unused-vars */
import React from 'react'
import projectimg from '../../assets/images/livingroom.png'
import '../CardsProjects/ProjectCard.scss'

function ProjectCard() {
  return (
    <div className='pcardmain'>
      <div className='img-project-container'>
        <img className='pimg' src={projectimg} alt='projimg'></img>
        <button className='hover-button'>View Details</button>
      </div>
      <div className='text-container'>
      <h1 className='project-title'>Title</h1>
      </div>
    </div>
  )
}

export default ProjectCard