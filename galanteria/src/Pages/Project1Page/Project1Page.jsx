import React, { useState, useEffect, useContext } from 'react'
import Project1 from '../../Pages/Project1/Project1'
import ErrorPage from '../../Pages/Error/ErrorPage';
import { Context } from '../../Components/Context/Products';
import { useParams } from 'react-router-dom';
import { dataProjects } from '../../data/projects';

const Project1Page = () => {
  const [data, setData] = useState();
  const [{ lang }] = useContext(Context)
  const { slug } = useParams();
  console.log("HERE", slug);

  useEffect(() => {
    const selectedData = dataProjects[lang][slug];
    setData(selectedData);
  }, [slug, lang])


  if (data){

    return (
        <Project1 data={data} />
      )
    }
}

export default Project1Page