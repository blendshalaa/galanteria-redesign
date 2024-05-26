/* eslint-disable no-unused-vars */
import React, {useEffect} from 'react'
import NavBar from '../../Components/NavBar/NavBar'
import '../Projects/Projects.scss'
import projectimg from '../../assets/images/livingroom.png'
import ProjectCard from '../../Components/CardsProjects/ProjectCard'
import Footer from '../Footer/Footer'


function Projects() {
  useEffect(() => {
    // Scroll to the top of the page with smooth behavior when the component mounts
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);
  return (
    <div>
        <NavBar/>
        <div className='projects-main'>
            <div className='header-projects'>
                <h1 className='project-h1'>Check out our <span>Projects</span></h1>
                <p className='project-p'>Lorem Ipsumm is simply dummy text of the printing and typesetting industry.<br></br> Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,<br></br>
                 when an unknown printer took a galley of type and scrambled it to make a type<br></br> specimen book. It has survived not only five centuries, but also the leap into<br></br> electronic typesetting, remaining essentially unchanged.</p>
            </div>
            <div className='cards'>
              <ProjectCard/>
              <ProjectCard/>
              <ProjectCard/>
            </div>
            <div className='cards-2'>
            <ProjectCard/>
              <ProjectCard/>
              <ProjectCard/>
            </div>

        </div>
      <Footer/>
    </div>
  )
}

export default Projects