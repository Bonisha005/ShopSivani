import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiPackage } from 'react-icons/fi';
import { useStore } from '../context/StoreContext';
import './Navbar.css';

const Navbar = () => {
  const { state, dispatch } = useStore();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const cartCount = state.cart.reduce((acc, item) => acc + item.qty, 0);

  const handleSearch = e => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?keyword=${searchVal}`);
      setShowSearch(false);
      setSearchVal('');
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">

        {/* Left — nav links */}
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><Link to="/products" onClick={() => setMenuOpen(false)}>Shop</Link></li>
          <li><Link to="/products?gender=Women" onClick={() => setMenuOpen(false)}>Women</Link></li>
          <li><Link to="/products?gender=Men" onClick={() => setMenuOpen(false)}>Men</Link></li>
          <li><Link to="/products?isNewArrival=true" onClick={() => setMenuOpen(false)}>New In</Link></li>
        </ul>

        {/* Centre — logo */}
        <Link to="/" className="logo">ShopSivani</Link>

        {/* Right — icons */}
        <div className="nav-icons">
          <button className="icon-btn" onClick={() => setShowSearch(s => !s)} aria-label="Search">
            <FiSearch size={20} />
          </button>

          <Link to="/wishlist" className="icon-btn" aria-label="Wishlist">
            <FiHeart size={20} />
            {state.wishlist.length > 0 && <span className="badge-dot">{state.wishlist.length}</span>}
          </Link>

          <Link to="/cart" className="icon-btn" aria-label="Cart">
            <FiShoppingBag size={20} />
            {cartCount > 0 && <span className="badge-dot">{cartCount}</span>}
          </Link>

          {state.user ? (
            <div className="user-menu">
              <button className="icon-btn"><FiUser size={20} /></button>
              <div className="dropdown">
                <p className="user-name">{state.user.name}</p>
                <Link to="/profile"><FiUser size={14} /> Profile</Link>
                <Link to="/orders"><FiPackage size={14} /> My Orders</Link>
                {state.user.isAdmin && <Link to="/admin">⚙️ Admin</Link>}
                <button onClick={handleLogout}><FiLogOut size={14} /> Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="icon-btn" aria-label="Login"><FiUser size={20} /></Link>
          )}

          <button className="icon-btn hamburger" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="search-bar container">
          <form onSubmit={handleSearch}>
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search for dresses, shoes, bags…"
              autoFocus
            />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
