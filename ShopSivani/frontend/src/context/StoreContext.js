// ============================================================
//  ShopSivani — Global Context (Auth, Cart, Wishlist)
//  Developed by: PAKKI BONISHA SIVANI
// ============================================================

import React, { createContext, useContext, useReducer, useEffect } from 'react';

const StoreContext = createContext();

const initialState = {
  user:     JSON.parse(localStorage.getItem('shopsivani_user')) || null,
  cart:     JSON.parse(localStorage.getItem('shopsivani_cart')) || [],
  wishlist: JSON.parse(localStorage.getItem('shopsivani_wishlist')) || [],
};

const reducer = (state, action) => {
  switch (action.type) {

    // ── Auth ──
    case 'LOGIN':
      localStorage.setItem('shopsivani_user', JSON.stringify(action.payload));
      return { ...state, user: action.payload };

    case 'LOGOUT':
      localStorage.removeItem('shopsivani_user');
      return { ...state, user: null };

    // ── Cart ──
    case 'ADD_TO_CART': {
      const item   = action.payload;
      const exists = state.cart.find(x =>
        x._id === item._id && x.size === item.size && x.color === item.color
      );
      const cart = exists
        ? state.cart.map(x =>
            x._id === item._id && x.size === item.size && x.color === item.color
              ? { ...x, qty: x.qty + item.qty }
              : x
          )
        : [...state.cart, item];
      localStorage.setItem('shopsivani_cart', JSON.stringify(cart));
      return { ...state, cart };
    }

    case 'REMOVE_FROM_CART': {
      const cart = state.cart.filter((_, i) => i !== action.payload);
      localStorage.setItem('shopsivani_cart', JSON.stringify(cart));
      return { ...state, cart };
    }

    case 'UPDATE_QTY': {
      const cart = state.cart.map((item, i) =>
        i === action.payload.index ? { ...item, qty: action.payload.qty } : item
      );
      localStorage.setItem('shopsivani_cart', JSON.stringify(cart));
      return { ...state, cart };
    }

    case 'CLEAR_CART':
      localStorage.removeItem('shopsivani_cart');
      return { ...state, cart: [] };

    // ── Wishlist ──
    case 'TOGGLE_WISHLIST': {
      const id  = action.payload;
      const wl  = state.wishlist.includes(id)
        ? state.wishlist.filter(x => x !== id)
        : [...state.wishlist, id];
      localStorage.setItem('shopsivani_wishlist', JSON.stringify(wl));
      return { ...state, wishlist: wl };
    }

    default: return state;
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
