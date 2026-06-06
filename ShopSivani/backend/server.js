// ============================================================
//  ShopSivani — Fashion E-Commerce Backend
//  Developed by: PAKKI BONISHA SIVANI
// ============================================================

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');

// Routes
const authRoutes    = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes   = require('./routes/orderRoutes');
const reviewRoutes  = require('./routes/reviewRoutes');
const userRoutes    = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const aiRoutes      = require('./routes/aiRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ── Routes ──
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/reviews',  reviewRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/payment',  paymentRoutes);
app.use('/api/ai',      aiRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ShopSivani API is running 🚀', developer: 'PAKKI BONISHA SIVANI' });
});

// ── Error handler ──
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`\n🚀 ShopSivani Server running on port ${PORT}`.green.bold)
);
