/* eslint-disable no-unused-vars */
import React from 'react'
import NavBar from '../../Components/NavBar/NavBar'
import '../Projects/Projects.scss'
import projectimg from '../../assets/images/livingroom.png'

function Projects() {
  return (
    <div>
        <NavBar/>
        <div className='projects-main'>
            <div className='header-projects'>
                <h1 className='project-h1'>Check out our <span>Projects</span></h1>
                <p className='project-p'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.<br></br> Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,<br></br>
                 when an unknown printer took a galley of type and scrambled it to make a type<br></br> specimen book. It has survived not only five centuries, but also the leap into<br></br> electronic typesetting, remaining essentially unchanged.</p>
            </div>

        </div>
    </div>
  )
}

export default Projects