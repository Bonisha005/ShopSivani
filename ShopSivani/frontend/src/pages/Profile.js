import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useStore } from '../context/StoreContext';

const Profile = () => {
  const { state, dispatch } = useStore();
  const [form, setForm] = useState({
    name: state.user?.name || '',
    email: state.user?.email || '',
    password: '', confirm: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password && form.password !== form.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', {
        name: form.name, email: form.email,
        ...(form.password && { password: form.password }),
      });
      dispatch({ type: 'LOGIN', payload: data });
      toast.success('Profile updated!');
      setForm(f => ({ ...f, password: '', confirm: '' }));
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page container" style={{ paddingTop: '5rem', paddingBottom: '4rem', maxWidth: 600 }}>
      <h1 className="section-title">My Profile</h1>
      <div className="card" style={{ padding: '2rem', marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--gold)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700, color: 'var(--black)',
          }}>
            {state.user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{state.user?.name}</p>
            <p style={{ color: 'var(--gray-400)', fontSize: '.85rem' }}>{state.user?.email}</p>
            {state.user?.isAdmin && <span className="badge badge-gold" style={{ marginTop: '.3rem' }}>Admin</span>}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input value={form.name} required onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={form.email} required onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>New Password <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(leave blank to keep current)</span></label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} placeholder="••••••••" />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
