import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import AIRecommendations from '../components/AIRecommendations';
import './Home.css';

const categories = [
  { label: 'Dresses',     icon: '👗', q: 'Dresses' },
  { label: 'Tops',        icon: '👚', q: 'Tops' },
  { label: 'Bottoms',     icon: '👖', q: 'Bottoms' },
  { label: 'Footwear',    icon: '👠', q: 'Footwear' },
  { label: 'Accessories', icon: '👜', q: 'Accessories' },
  { label: 'Activewear',  icon: '🏋️', q: 'Activewear' },
];

const Home = () => {
  const [featured,    setFeatured]    = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [f, n] = await Promise.all([
          api.get('/products/featured'),
          api.get('/products/new-arrivals'),
        ]);
        // Safely handle any response format
        setFeatured(Array.isArray(f.data) ? f.data : f.data?.products || []);
        setNewArrivals(Array.isArray(n.data) ? n.data : n.data?.products || []);
      } catch (err) {
        console.error(err);
        setFeatured([]);
        setNewArrivals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home page">

      {/* Hero */}
      <section className="hero">
        <div className="hero-content fade-up">
          <p className="section-label">New Collection 2024</p>
          <h1>Wear Your<br /><em>Story</em></h1>
          <p className="hero-sub">Curated fashion for every moment — from sunrise to soirée</p>
          <div className="hero-btns">
            <Link to="/products?gender=Women" className="btn btn-primary">Shop Women</Link>
            <Link to="/products?gender=Men"   className="btn btn-outline">Shop Men</Link>
          </div>
        </div>
        <div className="hero-img-grid">
          <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600" alt="hero1" className="hero-img-1" />
          <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400" alt="hero2" className="hero-img-2" />
        </div>
      </section>

      {/* Categories */}
      <section className="section container">
        <p className="section-label">Browse By</p>
        <h2 className="section-title">Categories</h2>
        <div className="categories-grid">
          {categories.map(cat => (
            <Link to={`/products?category=${cat.q}`} key={cat.q} className="cat-card">
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-label">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="section container">
        <p className="section-label">Hand Picked</p>
        <h2 className="section-title">Featured Pieces</h2>
        {loading ? (
          <div className="spinner-wrap"><div className="spinner"></div></div>
        ) : featured.length === 0 ? (
          <p style={{color:'var(--gray-400)',textAlign:'center',padding:'2rem'}}>
            Products coming soon! 🛍️
          </p>
        ) : (
          <div className="products-grid">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/products" className="btn btn-outline">View All Products</Link>
        </div>
      </section>

      {/* Promo strip */}
      <section className="promo-strip">
        <div className="container promo-inner">
          <div className="promo-item"><span>🚚</span><p>Free Delivery over ₹999</p></div>
          <div className="promo-item"><span>🔄</span><p>Easy 30-Day Returns</p></div>
          <div className="promo-item"><span>🔐</span><p>Secure Payments</p></div>
          <div className="promo-item"><span>✨</span><p>Premium Quality</p></div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="section container">
        <AIRecommendations />
      </section>

      {/* New Arrivals */}
      <section className="section container">
        <p className="section-label">Just Landed</p>
        <h2 className="section-title">New Arrivals</h2>
        {loading ? (
          <div className="spinner-wrap"><div className="spinner"></div></div>
        ) : newArrivals.length === 0 ? (
          <p style={{color:'var(--gray-400)',textAlign:'center',padding:'2rem'}}>
            New arrivals coming soon! ✨
          </p>
        ) : (
          <div className="products-grid">
            {newArrivals.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <h3 className="footer-logo">ShopSivani</h3>
            <p>Fashion that speaks before you do.</p>
          </div>
          <div>
            <h4>Shop</h4>
            <Link to="/products?gender=Women">Women</Link>
            <Link to="/products?gender=Men">Men</Link>
            <Link to="/products?isNewArrival=true">New Arrivals</Link>
          </div>
          <div>
            <h4>Help</h4>
            <a href="#!">Shipping Policy</a>
            <a href="#!">Returns</a>
            <a href="#!">Contact Us</a>
          </div>
          <div>
            <h4>Developer</h4>
            <p style={{color:'var(--gold)',fontWeight:600}}>PAKKI BONISHA SIVANI</p>
            <p style={{fontSize:'.8rem',color:'var(--gray-400)'}}>React · Node.js · MongoDB · Gemini AI</p>
          </div>
        </div>
        <div className="footer-bottom container">
          <p>© 2024 ShopSivani by PAKKI BONISHA SIVANI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;