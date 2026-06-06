import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../utils/api';
import './Orders.css';

export const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/myorders')
      .then(r => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusColor = s => ({
    Pending:'var(--gold)', Processing:'#3b82f6',
    Shipped:'#8b5cf6', Delivered:'var(--green)', Cancelled:'var(--red)',
  }[s] || 'var(--gray-400)');

  if (loading) return <div className="spinner-wrap page"><div className="spinner"></div></div>;

  return (
    <div className="page container orders-page">
      <h1 className="section-title">My Orders</h1>
      {orders.length === 0 ? (
        <div style={{textAlign:'center',padding:'4rem',color:'var(--gray-400)'}}>
          <p style={{fontSize:'1.2rem',marginBottom:'1rem'}}>No orders yet</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</p>
                </div>
                <span className="order-status" style={{background:statusColor(order.status)+'22',color:statusColor(order.status)}}>
                  {order.status}
                </span>
              </div>
              <div className="order-items-preview">
                {order.orderItems.slice(0,3).map((item,i) => (
                  <img key={i} src={item.image} alt={item.name} title={item.name} />
                ))}
                {order.orderItems.length > 3 && <div className="more-items">+{order.orderItems.length-3}</div>}
              </div>
              <div className="order-footer">
                <p><strong>{order.orderItems.length}</strong> item(s) · <strong>₹{order.totalPrice.toLocaleString()}</strong></p>
                <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm">View Details →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(r => setOrder(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner-wrap page"><div className="spinner"></div></div>;
  if (!order)  return <div className="page container"><p>Order not found</p></div>;

  const statusSteps = ['Pending','Processing','Shipped','Delivered'];
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="page container order-detail-page">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem',flexWrap:'wrap',gap:'1rem'}}>
        <h1 className="section-title" style={{margin:0}}>Order #{order._id.slice(-8).toUpperCase()}</h1>
        <Link to="/orders" className="btn btn-outline btn-sm">← All Orders</Link>
      </div>

      {/* Status tracker */}
      {order.status !== 'Cancelled' && (
        <div className="status-tracker">
          {statusSteps.map((s, i) => (
            <div key={s} className={`tracker-step ${i <= currentStep ? 'done' : ''}`}>
              <div className="tracker-dot">{i <= currentStep ? '✓' : i+1}</div>
              <span>{s}</span>
              {i < statusSteps.length-1 && <div className="tracker-line" />}
            </div>
          ))}
        </div>
      )}

      <div className="order-detail-grid">
        <div>
          {/* Items */}
          <div className="order-section">
            <h3>Items Ordered</h3>
            {order.orderItems.map((item,i) => (
              <div key={i} className="order-item-row">
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <small>Size: {item.size} · Color: {item.color} · Qty: {item.quantity}</small>
                </div>
                <p>₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Shipping */}
          <div className="order-section">
            <h3>Shipping Address</h3>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            <p>📱 {order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Price summary */}
        <div className="order-section">
          <h3>Payment Summary</h3>
          <div className="summary-row"><span>Payment Method</span><span>{order.paymentMethod}</span></div>
          <div className="summary-row"><span>Payment Status</span>
            <span style={{color: order.isPaid ? 'var(--green)' : 'var(--red)', fontWeight:600}}>
              {order.isPaid ? '✓ Paid' : 'Pending'}
            </span>
          </div>
          <hr className="divider" />
          <div className="summary-row"><span>Subtotal</span><span>₹{order.itemsPrice.toLocaleString()}</span></div>
          <div className="summary-row"><span>Shipping</span><span>₹{order.shippingPrice}</span></div>
          <div className="summary-row"><span>Tax</span><span>₹{order.taxPrice}</span></div>
          <hr className="divider" />
          <div className="summary-row summary-total"><span>Total</span><span>₹{order.totalPrice.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
};
