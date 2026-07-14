/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Projects.scss';
import language from '../../lang';
import { Context } from '../../Components/Context/Products';
import useSEO from '../../Hooks/useSEO';
import { supabase } from '../../lib/supabase';

const Projects = () => {
  useSEO({
    title: 'Our Projects | Galanteria Group',
    description: 'Explore our portfolio of completed projects. See how Galanteria Group transforms spaces with elegant, functional furniture design and installations.'
  });

  const [{ lang }] = useContext(Context);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const goToProject = (slug) => navigate(`/project/${slug}`);

  return (
    <div className='projects-wrapper'>

      {/* Editorial Page Header */}
      <div className='projects-header-bento'>
        <div className='header-top'>
          <span className='bento-eyebrow'>Galanteria Group</span>
          <div className='header-line'></div>
        </div>
        <h1>{language[lang]?.projects[0].title} <em>{language[lang]?.projects[0].title2}</em></h1>
      </div>

      {loading ? (
        <div style={{ padding: '100px 0', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
          <span className="spinner" style={{ display: 'inline-block', width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : projects.length === 0 ? (
        <div style={{ padding: '100px 0', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
          Nuk ka projekte për momentin.
        </div>
      ) : (
        /* Full-bleed editorial grid */
        <div className='projects-grid'>
          {/* First image: large feature */}
          {projects[0] && (
            <div
              className='project-card project-card--large'
              onClick={() => goToProject(projects[0].slug)}
            >
              <img src={projects[0].images?.[0] || 'https://placehold.co/600x400/111/555?text=No+Image'} alt={projects[0].title} />
              <div className='project-card-info'>
                <span>{projects[0].title}</span>
              </div>
            </div>
          )}

          {/* Second image: tall right */}
          {projects[1] && (
            <div
              className='project-card project-card--tall'
              onClick={() => goToProject(projects[1].slug)}
            >
              <img src={projects[1].images?.[0] || 'https://placehold.co/400x600/111/555?text=No+Image'} alt={projects[1].title} />
              <div className='project-card-info'>
                <span>{projects[1].title}</span>
              </div>
            </div>
          )}

          {/* Remaining: uniform grid */}
          {projects.slice(2).map((proj) => (
            <div
              key={proj.id}
              className='project-card'
              onClick={() => goToProject(proj.slug)}
            >
              <img src={proj.images?.[0] || 'https://placehold.co/400x400/111/555?text=No+Image'} alt={proj.title} />
              <div className='project-card-info'>
                <span>{proj.title}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Projects;
