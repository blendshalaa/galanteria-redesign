import React, { useState, useEffect, useContext } from 'react'
import Product1 from '../../Pages/Product1/Product1'
import ErrorPage from '../../Pages/Error/ErrorPage';
import { Context } from '../../Components/Context/Products';
import { useParams } from 'react-router-dom';
import { dataProducts } from '../../data/products';

const Product1Page = () => {
  const [data, setData] = useState();
  const [{ lang }] = useContext(Context)
  const { slug } = useParams();
  console.log("HERE", slug);

  useEffect(() => {
    const selectedData = dataProducts[lang][slug];
    setData(selectedData);
  }, [slug, lang])


  if (data){

    return (
        <Product1 data={data} />
      )
    }
    return <ErrorPage />
}

export default Product1Page