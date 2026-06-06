import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useStore } from '../context/StoreContext';
import './Auth.css';

export const Login = () => {
  const { dispatch } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      dispatch({ type: 'LOGIN', payload: data });
      toast.success(`Welcome back, ${data.name}! 👋`);
      navigate(redirect ? `/${redirect}` : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page page">
      <div className="auth-card">
        <div className="auth-brand">ShopSivani</div>
        <h2>Welcome Back</h2>
        <p className="auth-sub">Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={form.email} required
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} required
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••" />
          </div>
          <button className="btn btn-primary auth-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">Don't have an account? <Link to="/register">Create one</Link></p>
      </div>

      <div className="auth-visual">
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800" alt="fashion" />
        <div className="auth-overlay">
          <p>"Style is a way to say who you are without having to speak."</p>
          <span>— Rachel Zoe</span>
        </div>
      </div>
    </div>
  );
};

export const Register = () => {
  const { dispatch } = useStore();
  const navigate     = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name: form.name, email: form.email, password: form.password });
      dispatch({ type: 'LOGIN', payload: data });
      toast.success(`Welcome to ShopSivani, ${data.name}! 🎉`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page page">
      <div className="auth-card">
        <div className="auth-brand">ShopSivani</div>
        <h2>Create Account</h2>
        <p className="auth-sub">Join thousands of fashion lovers</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input value={form.name} required
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Your name" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={form.email} required
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} required
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Min 6 characters" />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" value={form.confirm} required
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              placeholder="Repeat password" />
          </div>
          <button className="btn btn-primary auth-btn" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>

      <div className="auth-visual">
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800" alt="fashion" />
        <div className="auth-overlay">
          <p>"Fashion is the armor to survive everyday life."</p>
          <span>— Bill Cunningham</span>
        </div>
      </div>
    </div>
  );
};
