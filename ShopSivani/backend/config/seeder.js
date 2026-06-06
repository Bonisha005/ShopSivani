// ── Run: node config/seeder.js ──
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const colors   = require('colors');
const bcrypt   = require('bcryptjs');
const User     = require('../models/User');
const Product  = require('../models/Product');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    // Hash passwords manually so pre-save hook doesn't double-hash
    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('admin123', salt);
    const userPass  = await bcrypt.hash('test123', salt);

    await User.insertMany([
      { name: 'Sivani Admin', email: 'sivani@shopsivani.com', password: adminPass, isAdmin: true },
      { name: 'Test User',    email: 'user@test.com',         password: userPass },
    ]);

    await Product.insertMany([
      { name: 'Floral Wrap Dress', description: 'Elegant floral wrap dress perfect for any occasion. Made with soft breathable fabric.', brand: 'Zara', category: 'Dresses', gender: 'Women', price: 1499, originalPrice: 2499, images: ['https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400'], sizes: ['XS','S','M','L','XL'], colors: ['Floral Pink','Blue Floral'], stock: 50, isFeatured: true, isNewArrival: true, tags: ['dress','floral','summer'] },
      { name: 'Slim Fit Chinos', description: 'Classic slim-fit chinos for a smart casual look. Perfect for office and outings.', brand: 'H&M', category: 'Bottoms', gender: 'Men', price: 999, originalPrice: 1599, images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'], sizes: ['S','M','L','XL','XXL'], colors: ['Beige','Navy','Olive'], stock: 80, isFeatured: true, tags: ['chinos','casual','office'] },
      { name: 'Oversized Hoodie', description: 'Super cozy oversized hoodie, ideal for lazy days and casual outings.', brand: 'Nike', category: 'Tops', gender: 'Unisex', price: 1799, originalPrice: 2299, images: ['https://images.unsplash.com/photo-1556821840-3a63f15232d0?w=400'], sizes: ['S','M','L','XL','XXL'], colors: ['Grey','Black','White'], stock: 60, isFeatured: true, isNewArrival: true, tags: ['hoodie','casual','winter'] },
      { name: 'Denim Jacket', description: 'Timeless denim jacket that goes with everything. A wardrobe essential.', brand: "Levi's", category: 'Outerwear', gender: 'Unisex', price: 2499, originalPrice: 3499, images: ['https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=400'], sizes: ['S','M','L','XL'], colors: ['Light Blue','Dark Blue'], stock: 35, isFeatured: true, tags: ['denim','jacket','classic'] },
      { name: 'Strappy Heels', description: 'Elegant strappy heels for a night out or special occasion.', brand: 'Aldo', category: 'Footwear', gender: 'Women', price: 2199, originalPrice: 3299, images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400'], sizes: ['S','M','L'], colors: ['Black','Nude','Red'], stock: 25, tags: ['heels','party','elegant'] },
      { name: 'Leather Crossbody Bag', description: 'Compact leather crossbody bag with adjustable strap. Fits all your essentials.', brand: 'Coach', category: 'Accessories', gender: 'Women', price: 3499, originalPrice: 5499, images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'], sizes: ['Free Size'], colors: ['Brown','Black','Tan'], stock: 20, isFeatured: true, tags: ['bag','leather','accessories'] },
      { name: 'Yoga Leggings', description: 'High-waist yoga leggings with moisture-wicking fabric. Perfect for workouts.', brand: 'Adidas', category: 'Activewear', gender: 'Women', price: 1299, originalPrice: 1999, images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400'], sizes: ['XS','S','M','L','XL'], colors: ['Black','Navy','Purple'], stock: 70, isNewArrival: true, tags: ['yoga','activewear','fitness'] },
      { name: 'Linen Shirt', description: 'Breathable linen shirt for summer days. Relaxed fit for ultimate comfort.', brand: 'Mango', category: 'Tops', gender: 'Men', price: 899, originalPrice: 1299, images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400'], sizes: ['S','M','L','XL','XXL'], colors: ['White','Sky Blue','Sand'], stock: 90, isNewArrival: true, tags: ['linen','summer','casual'] },
    ]);

    console.log('✅ Data seeded successfully!'.green.bold);
    console.log('   Admin: sivani@shopsivani.com / admin123'.cyan);
    console.log('   User:  user@test.com / test123'.cyan);
    process.exit(0);
  } catch (err) {
    console.error(`❌ Seeder error: ${err}`.red.bold);
    process.exit(1);
  }
};

seedData();