import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { useStore } from '../context/StoreContext';
import './Cart.css';

const Cart = () => {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const { cart } = state;

  const subtotal   = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
  const shipping   = subtotal >= 999 ? 0 : 99;
  const tax        = Math.round(subtotal * 0.05);
  const total      = subtotal + shipping + tax;

  if (cart.length === 0) return (
    <div className="page container cart-empty">
      <FiShoppingBag size={64} color="var(--gray-200)" />
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added anything yet.</p>
      <Link to="/products" className="btn btn-primary">Start Shopping</Link>
    </div>
  );

  return (
    <div className="page container cart-page">
      <h1 className="section-title">Shopping Cart <span style={{fontSize:'1rem',color:'var(--gray-400)',fontFamily:'var(--font-body)'}}>({cart.length} items)</span></h1>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {cart.map((item, idx) => (
            <div key={idx} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-img" />
              <div className="cart-item-info">
                <p className="cart-item-name">{item.name}</p>
                <p className="cart-item-meta">Size: {item.size} &nbsp;|&nbsp; Color: {item.color}</p>
                <div className="cart-item-bottom">
                  <div className="qty-control">
                    <button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { index: idx, qty: Math.max(1, item.qty - 1) } })}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { index: idx, qty: item.qty + 1 } })}>+</button>
                  </div>
                  <p className="cart-item-price">₹{(item.price * item.qty).toLocaleString()}</p>
                  <button className="remove-btn" onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: idx })}>
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Link to="/products" className="btn btn-outline btn-sm" style={{marginTop:'1rem'}}>
            <FiArrowLeft /> Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span style={{color:'var(--green)'}}>Free</span> : `₹${shipping}`}</span></div>
          <div className="summary-row"><span>Tax (5%)</span><span>₹{tax}</span></div>
          <hr className="divider" />
          <div className="summary-row summary-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          {shipping > 0 && <p className="free-ship-note">Add ₹{(999 - subtotal).toLocaleString()} more for free shipping!</p>}
          <button className="btn btn-primary" style={{width:'100%',marginTop:'1.25rem'}}
            onClick={() => state.user ? navigate('/checkout') : navigate('/login?redirect=checkout')}>
            Proceed to Checkout
          </button>
          <div className="secure-note">🔒 Secure & Encrypted Checkout</div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
