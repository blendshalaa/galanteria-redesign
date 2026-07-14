import React, { useState, useEffect } from 'react'
import Product1 from '../../Pages/Product1/Product1'
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const Product1Page = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data: productData, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (productData) {
        // Map Supabase fields to the old format expected by Product1 component
        setData({
          category: productData.category,
          name: productData.name,
          description: productData.description_sq || productData.description,
          photos: productData.images,
          firstphoto: productData.images?.[0]
        });
      }
      setLoading(false);
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0908' }}>
      <span className="spinner" style={{ width: 30, height: 30, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#C8722A', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>;
  }

  if (data) {
    return <Product1 data={data} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0908', color: '#fff', fontSize: '1.2rem' }}>
      Produkti nuk u gjet!
    </div>
  );
}

export default Product1Page;