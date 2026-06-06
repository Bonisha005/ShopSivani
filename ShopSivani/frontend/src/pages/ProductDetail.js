import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiStar, FiTruck, FiRefreshCw, FiShield } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useStore } from '../context/StoreContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useStore();

  const [product, setProduct]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [selImg, setSelImg]         = useState(0);
  const [selSize, setSelSize]       = useState('');
  const [selColor, setSelColor]     = useState('');
  const [qty, setQty]               = useState(1);
  const [rating, setRating]         = useState(5);
  const [comment, setComment]       = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isWishlisted = state.wishlist.includes(id);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setSelSize(data.sizes?.[0] || '');
        setSelColor(data.colors?.[0] || '');
      } catch { toast.error('Product not found'); navigate('/products'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const addToCart = () => {
    if (!selSize) return toast.error('Please select a size');
    dispatch({
      type: 'ADD_TO_CART',
      payload: { _id: product._id, name: product.name, price: product.price,
        image: product.images[0], size: selSize, color: selColor, qty },
    });
    toast.success('Added to cart 🛍️');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!state.user) return toast.error('Please login to review');
    setSubmitting(true);
    try {
      await api.post(`/reviews/${id}`, { rating, comment });
      toast.success('Review submitted!');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setComment('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting review');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="spinner-wrap page"><div className="spinner"></div></div>;
  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="detail-page page container">
      <div className="detail-grid">

        {/* ── Images ── */}
        <div className="detail-images">
          <div className="thumbs">
            {product.images.map((img, i) => (
              <img key={i} src={img} alt={`${product.name} ${i}`}
                className={`thumb ${selImg === i ? 'active' : ''}`}
                onClick={() => setSelImg(i)} />
            ))}
          </div>
          <div className="main-img-wrap">
            <img src={product.images[selImg]} alt={product.name} className="main-img" />
            {discount > 0 && <span className="badge badge-red" style={{position:'absolute',top:'1rem',left:'1rem'}}>-{discount}% OFF</span>}
          </div>
        </div>

        {/* ── Info ── */}
        <div className="detail-info">
          <p className="detail-brand">{product.brand}</p>
          <h1 className="detail-name">{product.name}</h1>

          {product.numReviews > 0 && (
            <div className="detail-rating">
              {[1,2,3,4,5].map(s => (
                <FaStar key={s} size={16} color={s <= Math.round(product.rating) ? 'var(--gold)' : 'var(--gray-200)'} />
              ))}
              <span>{product.rating.toFixed(1)}</span>
              <span className="review-count">({product.numReviews} reviews)</span>
            </div>
          )}

          <div className="detail-price">
            <span className="price-big">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="price-strike">₹{product.originalPrice.toLocaleString()}</span>
            )}
            {discount > 0 && <span className="badge badge-red">{discount}% OFF</span>}
          </div>

          <p className="detail-desc">{product.description}</p>
          <hr className="divider" />

          {/* Size */}
          <div className="option-group">
            <label>Size: <strong>{selSize}</strong></label>
            <div className="option-pills">
              {product.sizes.map(s => (
                <button key={s}
                  className={`size-pill ${selSize === s ? 'active' : ''}`}
                  onClick={() => setSelSize(s)}>{s}</button>
              ))}
            </div>
          </div>

          {/* Color */}
          {product.colors.length > 0 && (
            <div className="option-group">
              <label>Color: <strong>{selColor}</strong></label>
              <div className="option-pills">
                {product.colors.map(c => (
                  <button key={c}
                    className={`color-pill ${selColor === c ? 'active' : ''}`}
                    onClick={() => setSelColor(c)}>{c}</button>
                ))}
              </div>
            </div>
          )}

          {/* Qty */}
          <div className="option-group">
            <label>Quantity</label>
            <div className="qty-control">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
            </div>
          </div>

          <div className="detail-actions">
            <button className="btn btn-primary" style={{flex:1}} onClick={addToCart}
              disabled={product.stock === 0}>
              <FiShoppingBag /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button
              className={`btn btn-outline wishlist-btn ${isWishlisted ? 'wished' : ''}`}
              onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', payload: id })}>
              <FiHeart fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="detail-perks">
            <div className="perk"><FiTruck /><span>Free delivery over ₹999</span></div>
            <div className="perk"><FiRefreshCw /><span>30-day easy returns</span></div>
            <div className="perk"><FiShield /><span>100% authentic products</span></div>
          </div>
        </div>
      </div>

      {/* ── Reviews ── */}
      <section className="reviews-section">
        <h2 className="section-title">Customer Reviews</h2>

        {product.reviews.length === 0 ? (
          <p style={{color:'var(--gray-400)'}}>No reviews yet. Be the first to review!</p>
        ) : (
          <div className="reviews-list">
            {product.reviews.map(r => (
              <div key={r._id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-avatar">{r.name[0].toUpperCase()}</div>
                  <div>
                    <p className="reviewer-name">{r.name}</p>
                    <div style={{display:'flex',gap:3}}>
                      {[1,2,3,4,5].map(s => (
                        <FaStar key={s} size={12} color={s <= r.rating ? 'var(--gold)' : 'var(--gray-200)'} />
                      ))}
                    </div>
                  </div>
                  <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="review-comment">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Write review */}
        {state.user && (
          <div className="write-review">
            <h3>Write a Review</h3>
            <form onSubmit={submitReview}>
              <div className="form-group">
                <label>Your Rating</label>
                <div style={{display:'flex',gap:'.5rem'}}>
                  {[1,2,3,4,5].map(s => (
                    <FaStar key={s} size={24} style={{cursor:'pointer'}}
                      color={s <= rating ? 'var(--gold)' : 'var(--gray-200)'}
                      onClick={() => setRating(s)} />
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea rows={4} value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Share your experience…" required />
              </div>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductDetail;
