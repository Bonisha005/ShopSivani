const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:    { type: String, required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, required: true },
  brand:       { type: String, required: true },
  category:    {
    type: String, required: true,
    enum: ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Accessories', 'Activewear'],
  },
  gender:      { type: String, enum: ['Men', 'Women', 'Unisex', 'Kids'], required: true },
  price:       { type: Number, required: true, default: 0 },
  originalPrice: { type: Number },
  images:      [{ type: String }],
  sizes:       [{ type: String, enum: ['XS','S','M','L','XL','XXL','Free Size'] }],
  colors:      [{ type: String }],
  stock:       { type: Number, required: true, default: 0 },
  reviews:     [reviewSchema],
  rating:      { type: Number, default: 0 },
  numReviews:  { type: Number, default: 0 },
  isFeatured:  { type: Boolean, default: false },
  isNewArrival:{ type: Boolean, default: false },
  tags:        [{ type: String }],
}, { timestamps: true });

// Auto-update rating on save
productSchema.pre('save', function (next) {
  if (this.reviews.length > 0) {
    this.rating = this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
