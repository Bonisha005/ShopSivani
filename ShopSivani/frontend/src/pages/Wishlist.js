import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import api from '../utils/api';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { state } = useStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (state.wishlist.length === 0) { setLoading(false); return; }
      try {
        const results = await Promise.all(state.wishlist.map(id => api.get(`/products/${id}`)));
        setProducts(results.map(r => r.data));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [state.wishlist]);

  if (loading) return <div className="spinner-wrap page"><div className="spinner"></div></div>;

  return (
    <div className="page container" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
      <h1 className="section-title">My Wishlist
        <span style={{ fontSize: '1rem', color: 'var(--gray-400)', fontFamily: 'var(--font-body)' }}>
          {' '}({state.wishlist.length} items)
        </span>
      </h1>

      {state.wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--gray-400)' }}>
          <FiHeart size={64} color="var(--gray-200)" />
          <h2 style={{ marginTop: '1rem', marginBottom: '.5rem' }}>Your wishlist is empty</h2>
          <p style={{ marginBottom: '1.5rem' }}>Save items you love for later</p>
          <Link to="/products" className="btn btn-primary">Explore Products</Link>
        </div>
      ) : (
        <div className="products-grid" style={{ marginTop: '1.5rem' }}>
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
