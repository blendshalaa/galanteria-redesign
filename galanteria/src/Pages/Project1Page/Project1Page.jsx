import React, { useState, useEffect } from 'react'
import Project1 from '../../Pages/Project1/Project1'
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const Project1Page = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      const { data: projectData, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (projectData) {
        // Map Supabase fields to the old format expected by Project1 component
        setData({
          name: projectData.title,
          description: projectData.description,
          photos: projectData.images,
          firstphoto: projectData.images?.[0]
        });
      }
      setLoading(false);
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0908' }}>
      <span className="spinner" style={{ width: 30, height: 30, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#C8722A', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>;
  }

  if (data) {
    return <Project1 data={data} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0908', color: '#fff', fontSize: '1.2rem' }}>
      Projekti nuk u gjet!
    </div>
  );
}

export default Project1Page;