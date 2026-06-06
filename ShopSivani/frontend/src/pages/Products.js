import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { FiFilter, FiX } from 'react-icons/fi';
import './Products.css';

const CATEGORIES = ['Tops','Bottoms','Dresses','Outerwear','Footwear','Accessories','Activewear'];
const GENDERS    = ['Women','Men','Unisex','Kids'];
const SORTS      = [
  { label: 'Newest',       value: 'newest'     },
  { label: 'Price: Low',   value: 'price_asc'  },
  { label: 'Price: High',  value: 'price_desc' },
  { label: 'Top Rated',    value: 'rating'     },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pages, setPages]       = useState(1);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  const keyword  = searchParams.get('keyword')  || '';
  const category = searchParams.get('category') || '';
  const gender   = searchParams.get('gender')   || '';
  const sort     = searchParams.get('sort')     || 'newest';
  const page     = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ keyword, category, gender, sort, page, pageSize: 12 });
        const { data } = await api.get(`/products?${params}`);
        setProducts(data.products);
        setPages(data.pages);
        setTotal(data.total);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [keyword, category, gender, sort, page]);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  return (
    <div className="products-page page container">

      {/* Header */}
      <div className="products-header">
        <div>
          <h1 className="section-title" style={{ marginBottom: '.25rem' }}>
            {category || gender || keyword || 'All Products'}
          </h1>
          <p style={{ color: 'var(--gray-400)', fontSize: '.85rem' }}>{total} items</p>
        </div>
        <div className="products-controls">
          <select
            value={sort}
            onChange={e => setParam('sort', e.target.value)}
            className="sort-select"
          >
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button className="btn btn-outline btn-sm" onClick={() => setShowFilter(f => !f)}>
            <FiFilter /> Filter
          </button>
        </div>
      </div>

      <div className="products-layout">

        {/* Sidebar filter */}
        <aside className={`filter-sidebar ${showFilter ? 'open' : ''}`}>
          <div className="filter-header">
            <h3>Filters</h3>
            <button onClick={() => setShowFilter(false)} className="icon-btn"><FiX /></button>
          </div>

          <div className="filter-group">
            <h4>Category</h4>
            <button className={`filter-pill ${!category ? 'active' : ''}`} onClick={() => setParam('category','')}>All</button>
            {CATEGORIES.map(c => (
              <button key={c} className={`filter-pill ${category === c ? 'active' : ''}`} onClick={() => setParam('category', c)}>{c}</button>
            ))}
          </div>

          <div className="filter-group">
            <h4>Gender</h4>
            <button className={`filter-pill ${!gender ? 'active' : ''}`} onClick={() => setParam('gender','')}>All</button>
            {GENDERS.map(g => (
              <button key={g} className={`filter-pill ${gender === g ? 'active' : ''}`} onClick={() => setParam('gender', g)}>{g}</button>
            ))}
          </div>

          <button className="btn btn-outline btn-sm" style={{ marginTop: '1rem', width: '100%' }}
            onClick={() => setSearchParams({})}>Clear All</button>
        </aside>

        {/* Grid */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div className="spinner-wrap"><div className="spinner"></div></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>😕 No products found</p>
              <button className="btn btn-outline btn-sm" onClick={() => setSearchParams({})}>Clear filters</button>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
              {/* Pagination */}
              {pages > 1 && (
                <div className="pagination">
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      className={`page-btn ${page === p ? 'active' : ''}`}
                      onClick={() => setParam('page', p)}
                    >{p}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
