import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useStore } from '../context/StoreContext';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { state, dispatch } = useStore();
  const isWishlisted = state.wishlist.includes(product._id);

  const toggleWishlist = e => {
    e.preventDefault();
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product._id });
    toast.info(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
  };

  const addToCart = e => {
    e.preventDefault();
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        _id: product._id, name: product.name,
        price: product.price, image: product.images[0],
        size: product.sizes[0] || 'Free Size',
        color: product.colors[0] || 'Default',
        qty: 1,
      },
    });
    toast.success('Added to cart 🛍️');
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-img-wrap">
        <img src={product.images[0]} alt={product.name} loading="lazy" />

        {discount > 0 && <span className="badge badge-red discount-badge">-{discount}%</span>}
        {product.isNewArrival && <span className="badge badge-black new-badge">New</span>}

        <div className="product-actions">
          <button
            className={`action-btn ${isWishlisted ? 'wished' : ''}`}
            onClick={toggleWishlist}
            title="Wishlist"
          >
            <FiHeart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <button className="action-btn" onClick={addToCart} title="Quick add">
            <FiShoppingBag size={18} />
          </button>
        </div>
      </div>

      <div className="product-info">
        <p className="product-brand">{product.brand}</p>
        <h3 className="product-name">{product.name}</h3>

        {product.numReviews > 0 && (
          <div className="product-rating">
            <FaStar size={12} color="var(--gold)" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="review-count">({product.numReviews})</span>
          </div>
        )}

        <div className="product-price">
          <span className="price-current">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
