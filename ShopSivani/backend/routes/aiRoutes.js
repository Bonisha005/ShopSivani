// ============================================================
//  ShopSivani — AI Proxy Route (Google Gemini - FREE)
//  Developed by: PAKKI BONISHA SIVANI
//  Uses Google Gemini API — completely free, no credit card
// ============================================================

const express      = require('express');
const asyncHandler = require('express-async-handler');

const router = express.Router();

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Helper to call Gemini
const callGemini = async (prompt) => {
  const response = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1000, temperature: 0.8 },
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Gemini API error');
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

// @POST /api/ai/chat  — Fashion chatbot
router.post('/chat', asyncHandler(async (req, res) => {
  const { messages, system } = req.body;

  // Build full conversation as a single prompt for Gemini
  const history = messages.map(m =>
    `${m.role === 'user' ? 'Customer' : 'Siya'}: ${m.content}`
  ).join('\n');

  const fullPrompt = `${system}\n\nConversation so far:\n${history}\n\nSiya:`;

  const reply = await callGemini(fullPrompt);
  res.json({ reply });
}));

// @POST /api/ai/recommend  — Product recommendations
router.post('/recommend', asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  const result = await callGemini(prompt);
  res.json({ result });
}));

module.exports = router;
