// ============================================================
//  ShopSivani — AI Product Recommendations
//  Developed by: PAKKI BONISHA SIVANI
//  Powered by: Claude AI (Anthropic)
// ============================================================

import React, { useState } from 'react';
import { FiStar, FiZap, FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './AIRecommendations.css';

const OCCASIONS = ['Casual Day Out', 'Office/Work', 'Wedding', 'Date Night', 'Festival', 'Gym/Workout', 'Party', 'Travel'];
const STYLES    = ['Minimal', 'Trendy', 'Classic', 'Bohemian', 'Streetwear', 'Elegant', 'Sporty'];
const BUDGETS   = ['Under ₹500', '₹500–₹1500', '₹1500–₹3000', 'Above ₹3000'];
const GENDERS   = ['Women', 'Men', 'Unisex'];

const AIRecommendations = () => {
  const [step, setStep]     = useState(0); // 0=form, 1=loading, 2=results
  const [form, setForm]     = useState({ occasion: '', style: '', budget: '', gender: '', extra: '' });
  const [results, setResults] = useState([]);
  const [aiNote, setAiNote]   = useState('');
  const [error, setError]     = useState('');

  const toggle = (field, val) =>
    setForm(f => ({ ...f, [field]: f[field] === val ? '' : val }));

  const getRecommendations = async () => {
    if (!form.occasion || !form.gender) return;
    setStep(1);
    setError('');

    try {
      // 1. Fetch available products from the store
      const { data } = await api.get('/products?pageSize=50');
      const products = data.products || [];

      // 2. Build a concise product catalogue for Claude
      const catalogue = products.map(p =>
        `ID:${p._id} | ${p.name} | ${p.brand} | ${p.category} | ${p.gender} | ₹${p.price} | Rating:${p.rating?.toFixed(1)||'New'}`
      ).join('\n');

      const prompt = `You are a fashion recommendation AI for ShopSivani, an Indian fashion store.

User preferences:
- Occasion: ${form.occasion}
- Style: ${form.style || 'Any'}
- Budget: ${form.budget || 'Any'}
- Gender: ${form.gender}
- Extra notes: ${form.extra || 'None'}

Available products in store:
${catalogue}

Task: Recommend exactly 4 products from the list above that best match the user's preferences. Consider occasion, style, budget, gender, and rating.

Respond ONLY with a valid JSON object in this exact format (no markdown, no explanation):
{
  "note": "A warm 2-sentence personalised style note for the user",
  "recommendations": [
    { "id": "product_id_here", "reason": "One sentence why this suits them" },
    { "id": "product_id_here", "reason": "One sentence why this suits them" },
    { "id": "product_id_here", "reason": "One sentence why this suits them" },
    { "id": "product_id_here", "reason": "One sentence why this suits them" }
  ]
}`;

      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const aiData = await response.json();
      const rawText = aiData.result || '{}';

      // 3. Parse JSON response
      const clean = rawText.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);

      // 4. Map IDs back to full product objects
      const recommended = parsed.recommendations
        .map(r => {
          const product = products.find(p => p._id === r.id);
          return product ? { ...product, aiReason: r.reason } : null;
        })
        .filter(Boolean);

      setAiNote(parsed.note || '');
      setResults(recommended);
      setStep(2);

    } catch (err) {
      console.error(err);
      setError('Could not generate recommendations. Please try again.');
      setStep(0);
    }
  };

  const reset = () => {
    setStep(0);
    setResults([]);
    setAiNote('');
    setForm({ occasion: '', style: '', budget: '', gender: '', extra: '' });
  };

  // ── Form ──
  if (step === 0) return (
    <div className="ai-reco-section">
      <div className="ai-reco-header">
        <div className="ai-badge"><FiZap size={14} /> AI Powered</div>
        <h2 className="section-title">Get Personalised Picks ✨</h2>
        <p className="ai-reco-sub">Tell us your vibe — our AI stylist will curate the perfect products just for you.</p>
      </div>

      <div className="ai-form">
        {/* Gender */}
        <div className="ai-form-group">
          <label>Shopping for <span className="required">*</span></label>
          <div className="pill-group">
            {GENDERS.map(g => (
              <button key={g}
                className={`option-pill ${form.gender === g ? 'active' : ''}`}
                onClick={() => toggle('gender', g)}>{g}</button>
            ))}
          </div>
        </div>

        {/* Occasion */}
        <div className="ai-form-group">
          <label>Occasion <span className="required">*</span></label>
          <div className="pill-group">
            {OCCASIONS.map(o => (
              <button key={o}
                className={`option-pill ${form.occasion === o ? 'active' : ''}`}
                onClick={() => toggle('occasion', o)}>{o}</button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div className="ai-form-group">
          <label>Style Preference</label>
          <div className="pill-group">
            {STYLES.map(s => (
              <button key={s}
                className={`option-pill ${form.style === s ? 'active' : ''}`}
                onClick={() => toggle('style', s)}>{s}</button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="ai-form-group">
          <label>Budget</label>
          <div className="pill-group">
            {BUDGETS.map(b => (
              <button key={b}
                className={`option-pill ${form.budget === b ? 'active' : ''}`}
                onClick={() => toggle('budget', b)}>{b}</button>
            ))}
          </div>
        </div>

        {/* Extra */}
        <div className="ai-form-group">
          <label>Anything else? <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional)</span></label>
          <input
            value={form.extra}
            onChange={e => setForm(f => ({ ...f, extra: e.target.value }))}
            placeholder="e.g. I prefer pastel colours, cotton fabric, petite size…"
            className="ai-extra-input"
          />
        </div>

        {error && <p className="ai-error">⚠️ {error}</p>}

        <button
          className="btn btn-primary ai-cta"
          onClick={getRecommendations}
          disabled={!form.occasion || !form.gender}
        >
          <FiZap size={16} /> Generate My Picks
        </button>
      </div>
    </div>
  );

  // ── Loading ──
  if (step === 1) return (
    <div className="ai-reco-section">
      <div className="ai-loading">
        <div className="ai-spinner">
          <div /><div /><div /><div />
        </div>
        <h3>Siya is styling your picks…</h3>
        <p>Our AI is scanning the catalogue to find your perfect matches ✨</p>
        <div className="loading-steps">
          <p className="loading-step active">📦 Scanning product catalogue…</p>
          <p className="loading-step">🧠 Analysing your style preferences…</p>
          <p className="loading-step">✨ Curating your personalised picks…</p>
        </div>
      </div>
    </div>
  );

  // ── Results ──
  return (
    <div className="ai-reco-section">
      <div className="ai-reco-header">
        <div className="ai-badge"><FiZap size={14} /> AI Curated</div>
        <h2 className="section-title">Your Personalised Picks ✨</h2>
        {aiNote && (
          <div className="ai-note">
            <span className="ai-note-icon">💬</span>
            <p>{aiNote}</p>
          </div>
        )}
      </div>

      <div className="ai-results-grid">
        {results.map((product, i) => {
          const discount = product.originalPrice
            ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
          return (
            <Link to={`/product/${product._id}`} key={product._id} className="ai-product-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="ai-product-img">
                <img src={product.images?.[0]} alt={product.name} />
                <div className="ai-rank-badge">#{i + 1} Pick</div>
                {discount > 0 && <div className="discount-tag">-{discount}%</div>}
              </div>
              <div className="ai-product-info">
                <p className="ai-brand">{product.brand}</p>
                <h4 className="ai-name">{product.name}</h4>
                {product.rating > 0 && (
                  <div className="ai-rating">
                    <FiStar size={12} fill="var(--gold)" color="var(--gold)" />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>
                )}
                <p className="ai-price">₹{product.price?.toLocaleString()}</p>
                <div className="ai-reason">
                  <span>🤖</span>
                  <p>{product.aiReason}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="ai-results-footer">
        <button className="btn btn-outline" onClick={reset}>
          <FiRefreshCw size={15} /> Try Different Preferences
        </button>
        <Link to="/products" className="btn btn-primary">View All Products →</Link>
      </div>
    </div>
  );
};

export default AIRecommendations;
