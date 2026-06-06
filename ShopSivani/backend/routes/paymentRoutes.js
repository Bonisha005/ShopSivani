const express      = require('express');
const asyncHandler = require('express-async-handler');
const crypto       = require('crypto');
const { protect }  = require('../middleware/auth');

const router = express.Router();

// @POST /api/payment/create-order  — create Razorpay order
router.post('/create-order', protect, asyncHandler(async (req, res) => {
  // In production: use razorpay npm package
  // const Razorpay = require('razorpay');
  // const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  // const order = await instance.orders.create({ amount: req.body.amount * 100, currency: 'INR', receipt: `receipt_${Date.now()}` });

  // Mock response for development:
  res.json({
    id: `order_mock_${Date.now()}`,
    amount: req.body.amount * 100,
    currency: 'INR',
    key: process.env.RAZORPAY_KEY_ID,
  });
}));

// @POST /api/payment/verify  — verify Razorpay signature
router.post('/verify', protect, asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body      = razorpay_order_id + '|' + razorpay_payment_id;
  const expected  = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret')
    .update(body)
    .digest('hex');

  if (expected === razorpay_signature) {
    res.json({ success: true, message: 'Payment verified' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }
}));

module.exports = router;
