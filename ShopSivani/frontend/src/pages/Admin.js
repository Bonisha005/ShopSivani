import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPackage, FiUsers, FiShoppingBag, FiDollarSign, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import api from '../utils/api';
import { useStore } from '../context/StoreContext';
import { toast } from 'react-toastify';
import './Admin.css';

const Admin = () => {
  const { state } = useStore();
  const navigate  = useNavigate();
  const [tab, setTab]         = useState('overview');
  const [orders, setOrders]   = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state.user?.isAdmin) { navigate('/'); return; }
    const fetchAll = async () => {
      try {
        const [o, p, u] = await Promise.all([
          api.get('/orders'), api.get('/products?pageSize=100'), api.get('/users'),
        ]);
        setOrders(o.data);
        setProducts(p.data.products);
        setUsers(u.data);
      } catch (err) { toast.error('Error loading admin data'); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const deleteProduct = async id => {
    if (!window.confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); setProducts(p => p.filter(x => x._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); }
  };

  const deleteUser = async id => {
    if (!window.confirm('Delete this user?')) return;
    try { await api.delete(`/users/${id}`); setUsers(u => u.filter(x => x._id !== id)); toast.success('User deleted'); }
    catch { toast.error('Delete failed'); }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  const totalRevenue = orders.filter(o => o.isPaid).reduce((a, o) => a + o.totalPrice, 0);

  if (loading) return <div className="spinner-wrap page"><div className="spinner"></div></div>;

  return (
    <div className="admin-page page container">
      <div className="admin-header">
        <div>
          <h1 className="section-title" style={{ margin: 0 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--gray-400)' }}>PAKKI BONISHA SIVANI · ShopSivani</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {[
          { icon: <FiDollarSign />, label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: '#22c55e' },
          { icon: <FiPackage />,    label: 'Total Orders',  value: orders.length,   color: '#3b82f6' },
          { icon: <FiShoppingBag />,label: 'Products',      value: products.length, color: 'var(--gold)' },
          { icon: <FiUsers />,      label: 'Users',         value: users.length,    color: '#8b5cf6' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-icon" style={{ background: k.color + '22', color: k.color }}>{k.icon}</div>
            <div>
              <p className="kpi-value">{k.value}</p>
              <p className="kpi-label">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {['orders','products','users'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Order ID</th><th>User</th><th>Date</th><th>Total</th><th>Payment</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id}>
                  <td><Link to={`/orders/${o._id}`} style={{color:'var(--gold)',fontWeight:600}}>#{o._id.slice(-8).toUpperCase()}</Link></td>
                  <td>{o.user?.name || 'N/A'}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>₹{o.totalPrice.toLocaleString()}</td>
                  <td><span style={{color:o.isPaid?'var(--green)':'var(--red)',fontWeight:600}}>{o.isPaid?'Paid':'Pending'}</span></td>
                  <td>
                    <select value={o.status} onChange={e => updateOrderStatus(o._id, e.target.value)} className="status-select">
                      {['Pending','Processing','Shipped','Delivered','Cancelled'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td><Link to={`/orders/${o._id}`} className="btn btn-outline btn-sm">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Products Tab */}
      {tab === 'products' && (
        <div className="admin-table-wrap">
          <div style={{marginBottom:'1rem',textAlign:'right'}}>
            <button className="btn btn-primary btn-sm" onClick={() => toast.info('Create product API: POST /api/products')}>
              <FiPlus /> Add Product
            </button>
          </div>
          <table className="admin-table">
            <thead><tr><th>Image</th><th>Name</th><th>Brand</th><th>Category</th><th>Price</th><th>Stock</th><th>Action</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td><img src={p.images[0]} alt={p.name} style={{width:44,height:56,objectFit:'cover',borderRadius:3}} /></td>
                  <td style={{fontWeight:600}}>{p.name}</td>
                  <td>{p.brand}</td>
                  <td>{p.category}</td>
                  <td>₹{p.price.toLocaleString()}</td>
                  <td><span style={{color:p.stock>0?'var(--green)':'var(--red)',fontWeight:600}}>{p.stock}</span></td>
                  <td style={{display:'flex',gap:'.4rem',paddingTop:'.75rem'}}>
                    <button className="btn btn-outline btn-sm" onClick={() => toast.info('Edit product: PUT /api/products/'+p._id)}><FiEdit size={14}/></button>
                    <button className="btn btn-sm" style={{background:'var(--red)',color:'#fff',border:'none'}} onClick={() => deleteProduct(p._id)}><FiTrash2 size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Action</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td style={{fontWeight:600}}>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.isAdmin ? 'badge-gold' : 'badge-black'}`}>{u.isAdmin?'Admin':'User'}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {!u.isAdmin && (
                      <button className="btn btn-sm" style={{background:'var(--red)',color:'#fff',border:'none'}} onClick={() => deleteUser(u._id)}>
                        <FiTrash2 size={14}/>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
