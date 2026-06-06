const express      = require('express');
const asyncHandler = require('express-async-handler');
const Product      = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @GET /api/products  — list with search, filter, sort, pagination
router.get('/', asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page     = Number(req.query.page)     || 1;

  const keyword  = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};
  const category = req.query.category ? { category: req.query.category } : {};
  const gender   = req.query.gender   ? { gender: req.query.gender }     : {};
  const minPrice = req.query.minPrice ? { price: { $gte: Number(req.query.minPrice) } } : {};
  const maxPrice = req.query.maxPrice ? { price: { $lte: Number(req.query.maxPrice) } } : {};

  const filter = { ...keyword, ...category, ...gender, ...minPrice, ...maxPrice };

  let sort = {};
  if (req.query.sort === 'price_asc')  sort = { price: 1 };
  if (req.query.sort === 'price_desc') sort = { price: -1 };
  if (req.query.sort === 'rating')     sort = { rating: -1 };
  if (req.query.sort === 'newest')     sort = { createdAt: -1 };

  const count    = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
}));

// @GET /api/products/featured
router.get('/featured', asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true }).limit(8);
  res.json(products);
}));

// @GET /api/products/new-arrivals
router.get('/new-arrivals', asyncHandler(async (req, res) => {
  const products = await Product.find({ isNewArrival: true }).limit(8);
  res.json(products);
}));

// @GET /api/products/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}));

// @POST /api/products  — admin only
router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample Product', description: 'Description', brand: 'Brand',
    category: 'Tops', gender: 'Women', price: 999, stock: 10,
    images: ['https://via.placeholder.com/400'],
    sizes: ['S','M','L'], colors: ['Black'],
  });
  const created = await product.save();
  res.status(201).json(created);
}));

// @PUT /api/products/:id  — admin only
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  Object.assign(product, req.body);
  const updated = await product.save();
  res.json(updated);
}));

// @DELETE /api/products/:id  — admin only
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.deleteOne();
  res.json({ message: 'Product deleted' });
}));

module.exports = router;
