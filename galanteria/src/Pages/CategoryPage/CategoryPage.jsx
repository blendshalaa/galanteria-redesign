import React, { useEffect, useState, useContext } from 'react';
import { supabase } from '../../lib/supabase';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import language from '../../lang';
import { Context } from '../../Components/Context/Products';
import './CategoryPage.scss';

const CategoryPage = ({ category, title }) => {
  const [{ lang }] = useContext(Context);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    
    const fetchProducts = async () => {
      setLoading(true);
      // We do an ilike to handle slight variations in case (e.g. 'Tavolina Pune' vs 'Tavolinë Pune')
      let query = supabase.from('products').select('*');
      
      // Since data migration might have used old category names like "Arbeits Tisch" or "Tavolinë Pune",
      // we'll try to match it as closely as possible.
      if (category === 'Tavolina Pune') {
        query = query.in('category', ['Tavolinë Pune', 'Tavolina Pune', 'Arbeits Tisch', 'Arbeits Tische']);
      } else {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [category]);

  const goToProduct = (slug) => {
    navigate(`/product/${slug}`);
  };

  return (
    <>
      <NavBar />
      <div className='category-page-wrapper'>
        <div className='category-header'>
          <h1>{title}</h1>
        </div>
        
        {loading ? (
          <div className="loading-state">
            <span className="spinner" /> Duke ngarkuar...
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>Nuk ka produkte në këtë kategori për momentin.</p>
          </div>
        ) : (
          <div className='category-grid'>
            {products.map((product) => (
              <div 
                key={product.id} 
                className='category-item'
                onClick={() => goToProduct(product.slug)}
              >
                <div className='image-wrapper'>
                  <img src={product.images?.[0] || 'https://placehold.co/600x600/1a1815/555?text=No+Image'} alt={product.name} />
                  <div className='overlay'>
                    <span className='view-btn'>
                      {lang === 'sq' ? 'Shiko Produktin' : lang === 'de' ? 'Produkt ansehen' : 'View Product'}
                    </span>
                  </div>
                </div>
                <h4>{product.name}</h4>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
