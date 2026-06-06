const express      = require('express');
const asyncHandler = require('express-async-handler');
const User         = require('../models/User');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @GET /api/users  — admin
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
}));

// @DELETE /api/users/:id  — admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await user.deleteOne();
  res.json({ message: 'User deleted' });
}));

// @PUT /api/users/:id  — admin
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.name    = req.body.name    || user.name;
  user.email   = req.body.email   || user.email;
  user.isAdmin = Boolean(req.body.isAdmin);
  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, isAdmin: updated.isAdmin });
}));

// Wishlist
router.post('/wishlist/:productId', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const pid  = req.params.productId;
  const idx  = user.wishlist.indexOf(pid);
  if (idx === -1) user.wishlist.push(pid);
  else            user.wishlist.splice(idx, 1);
  await user.save();
  res.json({ wishlist: user.wishlist });
}));

module.exports = router;
