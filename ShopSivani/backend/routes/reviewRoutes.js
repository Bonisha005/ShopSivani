const express      = require('express');
const asyncHandler = require('express-async-handler');
const Product      = require('../models/Product');
const { protect }  = require('../middleware/auth');

const router = express.Router();

// @POST /api/reviews/:productId  — add review
router.post('/:productId', protect, asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const alreadyReviewed = product.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed)
    return res.status(400).json({ message: 'You have already reviewed this product' });

  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  await product.save();
  res.status(201).json({ message: 'Review added' });
}));

// @DELETE /api/reviews/:productId/:reviewId — delete own review
router.delete('/:productId/:reviewId', protect, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  product.reviews = product.reviews.filter(
    r => r._id.toString() !== req.params.reviewId ||
         r.user.toString() === req.user._id.toString()
  );
  await product.save();
  res.json({ message: 'Review removed' });
}));

module.exports = router;
