import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useStore } from '../context/StoreContext';
import './Checkout.css';

const STEPS = ['Shipping', 'Payment', 'Confirm'];

const Checkout = () => {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState({
    fullName: state.user?.name || '', address: '', city: '',
    state: '', pincode: '', phone: '',
  });
  const [payMethod, setPayMethod] = useState('Razorpay');

  const subtotal = state.cart.reduce((a, i) => a + i.price * i.qty, 0);
  const shippingCost = subtotal >= 999 ? 0 : 99;
  const tax   = Math.round(subtotal * 0.05);
  const total = subtotal + shippingCost + tax;

  const handleShipping = e => {
    e.preventDefault();
    setStep(1);
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: state.cart.map(i => ({
          product: i._id, name: i.name, image: i.image,
          price: i.price, size: i.size, color: i.color, quantity: i.qty,
        })),
        shippingAddress: shipping,
        paymentMethod: payMethod,
        itemsPrice: subtotal, shippingPrice: shippingCost,
        taxPrice: tax, totalPrice: total,
      };

      if (payMethod === 'Razorpay') {
        // Create Razorpay order
        const { data: rzOrder } = await api.post('/payment/create-order', { amount: total });

        const options = {
          key: rzOrder.key || 'rzp_test_placeholder',
          amount: rzOrder.amount,
          currency: 'INR',
          name: 'ShopSivani',
          description: 'Fashion Purchase',
          order_id: rzOrder.id,
          handler: async (response) => {
            // Verify payment
            try {
              await api.post('/payment/verify', response);
              const { data: order } = await api.post('/orders', orderData);
              await api.put(`/orders/${order._id}/pay`, {
                ...response, status: 'completed', updateTime: new Date().toISOString(),
              });
              dispatch({ type: 'CLEAR_CART' });
              toast.success('Order placed successfully! 🎉');
              navigate(`/orders/${order._id}`);
            } catch { toast.error('Payment verification failed'); }
          },
          prefill: { name: shipping.fullName, contact: shipping.phone },
          theme: { color: '#c9a84c' },
        };

        // In production, load Razorpay script and open checkout
        // For demo: simulate success
        const { data: order } = await api.post('/orders', orderData);
        dispatch({ type: 'CLEAR_CART' });
        toast.success('Order placed! (Demo mode — Razorpay not loaded) 🎉');
        navigate(`/orders/${order._id}`);

      } else {
        // COD
        const { data: order } = await api.post('/orders', orderData);
        dispatch({ type: 'CLEAR_CART' });
        toast.success('Order placed successfully! 🎉');
        navigate(`/orders/${order._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="checkout-page page container">
      {/* Progress */}
      <div className="checkout-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`checkout-step ${i <= step ? 'active' : ''}`}>
            <div className="step-num">{i + 1}</div>
            <span>{s}</span>
            {i < STEPS.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        <div className="checkout-main">

          {/* Step 0: Shipping */}
          {step === 0 && (
            <div className="checkout-section fade-up">
              <h2>Shipping Address</h2>
              <form onSubmit={handleShipping}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input required value={shipping.fullName}
                      onChange={e => setShipping({ ...shipping, fullName: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input required value={shipping.phone} type="tel"
                      onChange={e => setShipping({ ...shipping, phone: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Street Address</label>
                  <input required value={shipping.address}
                    onChange={e => setShipping({ ...shipping, address: e.target.value })}
                    placeholder="House No., Street, Landmark" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input required value={shipping.city}
                      onChange={e => setShipping({ ...shipping, city: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input required value={shipping.state}
                      onChange={e => setShipping({ ...shipping, state: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Pincode</label>
                    <input required value={shipping.pincode} maxLength={6}
                      onChange={e => setShipping({ ...shipping, pincode: e.target.value })} />
                  </div>
                </div>
                <button className="btn btn-primary" type="submit">Continue to Payment →</button>
              </form>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="checkout-section fade-up">
              <h2>Payment Method</h2>
              {['Razorpay', 'Cash on Delivery'].map(m => (
                <label key={m} className={`pay-option ${payMethod === m ? 'active' : ''}`}>
                  <input type="radio" name="payMethod" value={m}
                    checked={payMethod === m} onChange={() => setPayMethod(m)} />
                  <div>
                    <p>{m}</p>
                    <small>{m === 'Razorpay' ? 'Pay securely with UPI, Cards, Net Banking' : 'Pay when your order arrives'}</small>
                  </div>
                  <span className="pay-icon">{m === 'Razorpay' ? '💳' : '💵'}</span>
                </label>
              ))}
              <div style={{display:'flex',gap:'1rem',marginTop:'1.5rem'}}>
                <button className="btn btn-outline" onClick={() => setStep(0)}>← Back</button>
                <button className="btn btn-primary" onClick={() => setStep(2)}>Review Order →</button>
              </div>
            </div>
          )}

          {/* Step 2: Confirm */}
          {step === 2 && (
            <div className="checkout-section fade-up">
              <h2>Review Your Order</h2>
              <div className="confirm-address">
                <h4>Delivering to</h4>
                <p>{shipping.fullName}</p>
                <p>{shipping.address}, {shipping.city}, {shipping.state} - {shipping.pincode}</p>
                <p>📱 {shipping.phone}</p>
              </div>
              <div className="confirm-items">
                {state.cart.map((item, i) => (
                  <div key={i} className="confirm-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <small>{item.size} · {item.color} · Qty: {item.qty}</small>
                    </div>
                    <p>₹{(item.price * item.qty).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',gap:'1rem',marginTop:'1.5rem'}}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-gold" onClick={placeOrder} disabled={loading}>
                  {loading ? 'Placing Order…' : `Place Order · ₹${total.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {state.cart.map((item, i) => (
            <div key={i} className="summary-item">
              <img src={item.image} alt={item.name} />
              <div><p>{item.name}</p><small>×{item.qty}</small></div>
              <p>₹{(item.price * item.qty).toLocaleString()}</p>
            </div>
          ))}
          <hr className="divider" />
          <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span></div>
          <div className="summary-row"><span>Tax (5%)</span><span>₹{tax}</span></div>
          <hr className="divider" />
          <div className="summary-row summary-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
