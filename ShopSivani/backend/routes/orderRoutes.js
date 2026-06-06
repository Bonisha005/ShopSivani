const express      = require('express');
const asyncHandler = require('express-async-handler');
const Order        = require('../models/Order');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @POST /api/orders
router.post('/', protect, asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod,
          itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;

  if (!orderItems?.length)
    return res.status(400).json({ message: 'No items in order' });

  const order = await Order.create({
    user: req.user._id,
    orderItems, shippingAddress, paymentMethod,
    itemsPrice, shippingPrice, taxPrice, totalPrice,
  });
  res.status(201).json(order);
}));

// @GET /api/orders/myorders
router.get('/myorders', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
}));

// @GET /api/orders  — admin: all orders
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
}));

// @GET /api/orders/:id
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
}));

// @PUT /api/orders/:id/pay
router.put('/:id/pay', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = req.body;
  order.status = 'Processing';
  const updated = await order.save();
  res.json(updated);
}));

// @PUT /api/orders/:id/deliver  — admin
router.put('/:id/deliver', protect, admin, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.status = 'Delivered';
  const updated = await order.save();
  res.json(updated);
}));

// @PUT /api/orders/:id/status  — admin
router.put('/:id/status', protect, admin, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = req.body.status;
  const updated = await order.save();
  res.json(updated);
}));

module.exports = router;
