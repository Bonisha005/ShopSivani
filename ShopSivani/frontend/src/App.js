// ============================================================
//  ShopSivani — Fashion E-Commerce App
//  Developed by: PAKKI BONISHA SIVANI
//  Stack: React · Node.js · MongoDB · Claude AI
// ============================================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import { StoreProvider } from './context/StoreContext';
import Navbar            from './components/Navbar';
import AIChatbot         from './components/AIChatbot';
import Home              from './pages/Home';
import Products          from './pages/Products';
import ProductDetail     from './pages/ProductDetail';
import Cart              from './pages/Cart';
import { Login, Register } from './pages/Auth';
import Checkout          from './pages/Checkout';
import { OrdersList, OrderDetail } from './pages/Orders';
import Wishlist          from './pages/Wishlist';
import Profile           from './pages/Profile';
import Admin             from './pages/Admin';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem('shopsivani_user'));
  if (!user) { window.location.href = '/login'; return null; }
  if (adminOnly && !user.isAdmin) { window.location.href = '/'; return null; }
  return children;
};

function App() {
  return (
    <StoreProvider>
      <Router>
        <Navbar />

        {/* 🤖 AI Chatbot — floats on every page */}
        <AIChatbot />

        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/products"     element={<Products />} />
          <Route path="/product/:id"  element={<ProductDetail />} />
          <Route path="/cart"         element={<Cart />} />
          <Route path="/login"        element={<Login />} />
          <Route path="/register"     element={<Register />} />
          <Route path="/wishlist"     element={<Wishlist />} />

          <Route path="/checkout" element={
            <ProtectedRoute><Checkout /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute><OrdersList /></ProtectedRoute>
          } />
          <Route path="/orders/:id" element={
            <ProtectedRoute><OrderDetail /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
          } />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="dark"
        />
      </Router>
    </StoreProvider>
  );
}

export default App;
