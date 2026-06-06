// ============================================================
//  ShopSivani — AI Fashion Stylist Chatbot
//  Developed by: PAKKI BONISHA SIVANI
//  Powered by: Claude AI (Anthropic)
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiSend, FiMessageCircle, FiTrash2 } from 'react-icons/fi';
import { useStore } from '../context/StoreContext';
import './AIChatbot.css';

const SYSTEM_PROMPT = `You are Siya, a friendly and knowledgeable AI Fashion Stylist for ShopSivani — a premium Indian fashion e-commerce store.

Your personality:
- Warm, enthusiastic, and encouraging
- Knowledgeable about fashion trends, styling, and Indian fashion
- Concise but helpful — keep responses under 120 words unless the user asks for detail
- Use fashion-forward language but stay accessible
- Occasionally use tasteful fashion emojis (👗 👠 ✨ 🛍️)

You can help with:
- Outfit suggestions and styling advice
- What to wear for occasions (wedding, office, date night, festival, casual)
- Color combinations and matching
- Body type and fit guidance
- Seasonal fashion tips
- Trending styles in India
- Budget-friendly styling tips
- Care and maintenance of clothes

ShopSivani sells: Tops, Bottoms, Dresses, Outerwear, Footwear, Accessories, Activewear for Women, Men, Unisex, and Kids.

If asked about specific products or prices, guide users to browse the shop at ShopSivani.
If asked something completely unrelated to fashion/shopping, gently redirect to fashion topics.
Always be positive and make users feel confident about their style choices.`;

const QUICK_PROMPTS = [
  '👗 Outfit for a wedding?',
  '💼 Office wear tips',
  '🎉 Festival outfit ideas',
  '❄️ Winter fashion trends',
  '👟 Casual street style',
  '🌈 How to mix colors?',
];

const TypingIndicator = () => (
  <div className="chat-bubble bot typing-bubble">
    <div className="typing-dots">
      <span /><span /><span />
    </div>
  </div>
);

const AIChatbot = () => {
  const { state } = useStore();
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${state.user?.name?.split(' ')[0] || 'there'}! ✨ I'm **Siya**, your personal AI Fashion Stylist at ShopSivani. Ask me anything — outfit ideas, styling tips, what to wear for any occasion. I'm here to make you look fabulous! 👗`,
    },
  ]);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Build history for Claude — exclude the greeting
      const apiMessages = newMessages
        .slice(1) // skip initial greeting
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system:   SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });

      const data  = await response.json();
      const reply = data.reply || "Sorry, I couldn't get a response. Please try again!";

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Oops! I'm having a little moment 😅 Please try again in a second.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: `Fresh start! ✨ I'm **Siya**, your ShopSivani Fashion Stylist. What can I help you style today? 👗`,
    }]);
  };

  const renderContent = (text) => {
    // Simple markdown: **bold**
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  return (
    <>
      {/* Floating button */}
      <button
        className={`chatbot-fab ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Fashion Stylist AI"
      >
        {open ? <FiX size={22} /> : <FiMessageCircle size={22} />}
        {!open && <span className="fab-badge">AI</span>}
      </button>

      {/* Chat window */}
      <div className={`chatbot-window ${open ? 'visible' : ''}`}>

        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-avatar">S</div>
          <div className="chatbot-meta">
            <p className="chatbot-name">Siya · Fashion Stylist</p>
            <p className="chatbot-status">
              <span className="status-dot" /> Powered by Claude AI
            </p>
          </div>
          <button className="icon-clear" onClick={clearChat} title="Clear chat">
            <FiTrash2 size={15} />
          </button>
          <button className="icon-clear" onClick={() => setOpen(false)}>
            <FiX size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.role === 'user' ? 'user' : 'bot'}`}>
              {msg.role === 'assistant' && <div className="bot-dot">S</div>}
              <p dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }} />
            </div>
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts — show only at start */}
        {messages.length <= 2 && !loading && (
          <div className="quick-prompts">
            {QUICK_PROMPTS.map(p => (
              <button key={p} className="quick-pill" onClick={() => sendMessage(p)}>{p}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="chatbot-input-row">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask Siya for style advice…"
            disabled={loading}
          />
          <button
            className="send-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            <FiSend size={16} />
          </button>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;
