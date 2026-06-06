# 🛍️ ShopSivani — Full Stack Fashion E-Commerce App

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/Razorpay-Payment-02042B?style=for-the-badge" />
</p>

> **Developed by: PAKKI BONISHA SIVANI**  
> A production-grade full-stack fashion e-commerce web application built with the MERN stack.

---

## ✨ Features

### 🛒 Customer Features
| Feature | Description |
|---|---|
| 🏠 **Home Page** | Hero banner, featured products, category grid, new arrivals |
| 🔍 **Search & Filter** | Real-time search by keyword, category, gender, sort by price/rating |
| 👗 **Product Detail** | Image gallery, size/color selector, quantity picker |
| ⭐ **Reviews & Ratings** | Add, view, and manage product reviews with star ratings |
| 🛒 **Shopping Cart** | Add/remove/update items, price breakdown |
| ❤️ **Wishlist** | Save favourite products, persisted in localStorage |
| 🔐 **Authentication** | Register, Login with JWT, Protected routes |
| 📦 **Checkout** | 3-step checkout: Shipping → Payment → Confirm |
| 💳 **Razorpay Payment** | UPI, cards, net banking integration |
| 📋 **Order Tracking** | Visual status tracker: Pending → Processing → Shipped → Delivered |
| 👤 **Profile** | Update name, email, password |

### 🛡️ Admin Features
| Feature | Description |
|---|---|
| 📊 **Dashboard** | Revenue, orders, products, users KPI cards |
| 📦 **Order Management** | View all orders, update status (Pending/Processing/Shipped/Delivered) |
| 🛍️ **Product Management** | Add, edit, delete products |
| 👥 **User Management** | View all users, delete users, admin badge |

---

## 🖥️ Tech Stack

```
Frontend          Backend           Database        Payment
─────────         ────────          ────────        ───────
React 18          Node.js 18        MongoDB         Razorpay
React Router 6    Express 4.18      Mongoose        
Context API       JWT Auth          Atlas / Local
react-toastify    bcryptjs
react-icons       Morgan
```

---

## 📁 Project Structure

```
ShopSivani/
├── backend/
│   ├── config/
│   │   ├── db.js          # MongoDB connection
│   │   └── seeder.js      # Seed sample data
│   ├── middleware/
│   │   └── auth.js        # JWT protect + admin middleware
│   ├── models/
│   │   ├── User.js        # User schema
│   │   ├── Product.js     # Product + Review schema
│   │   └── Order.js       # Order schema
│   ├── routes/
│   │   ├── authRoutes.js  # Register, Login, Profile
│   │   ├── productRoutes.js # CRUD + Search + Filter
│   │   ├── reviewRoutes.js  # Add/Delete reviews
│   │   ├── orderRoutes.js   # Create + Track orders
│   │   ├── userRoutes.js    # Admin user management
│   │   └── paymentRoutes.js # Razorpay integration
│   ├── server.js          # Express entry point
│   └── .env               # Environment variables
│
└── frontend/
    └── src/
        ├── context/
        │   └── StoreContext.js  # Auth + Cart + Wishlist state
        ├── components/
        │   ├── Navbar.js        # Responsive navbar with search
        │   └── ProductCard.js   # Product card with hover actions
        ├── pages/
        │   ├── Home.js          # Landing page
        │   ├── Products.js      # Listing + filter + pagination
        │   ├── ProductDetail.js # Detail page + reviews
        │   ├── Cart.js          # Cart with price summary
        │   ├── Auth.js          # Login + Register
        │   ├── Checkout.js      # 3-step checkout + Razorpay
        │   ├── Orders.js        # Order list + detail + tracker
        │   ├── Wishlist.js      # Saved products
        │   ├── Profile.js       # User profile editor
        │   └── Admin.js         # Admin dashboard
        └── utils/
            └── api.js           # Axios with JWT interceptor
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))
- Razorpay account (for payment)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/ShopSivani.git
cd ShopSivani
```

### 2. Configure environment
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI and Razorpay keys
```

### 3. Install all dependencies
```bash
npm run install-all
```

### 4. Seed sample data
```bash
npm run seed
```

### 5. Run the app
```bash
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## 🔐 Default Credentials

| Role  | Email | Password |
|-------|-------|----------|
| Admin | sivani@shopsivani.com | admin123 |
| User  | user@test.com | test123 |

---

## 🌐 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register user | — |
| POST | /api/auth/login | Login | — |
| GET  | /api/auth/profile | Get profile | ✅ |
| GET  | /api/products | List products (search/filter) | — |
| GET  | /api/products/:id | Product detail | — |
| POST | /api/products | Create product | Admin |
| PUT  | /api/products/:id | Update product | Admin |
| DELETE | /api/products/:id | Delete product | Admin |
| POST | /api/reviews/:productId | Add review | ✅ |
| POST | /api/orders | Place order | ✅ |
| GET  | /api/orders/myorders | My orders | ✅ |
| GET  | /api/orders | All orders | Admin |
| PUT  | /api/orders/:id/pay | Mark paid | ✅ |
| PUT  | /api/orders/:id/status | Update status | Admin |
| GET  | /api/users | All users | Admin |
| POST | /api/payment/create-order | Razorpay order | ✅ |
| POST | /api/payment/verify | Verify payment | ✅ |

---

## 🚀 Deployment

**Frontend:** [Vercel](https://vercel.com) — connect GitHub repo → auto deploy  
**Backend:** [Render](https://render.com) — Node.js service, add env variables  
**Database:** [MongoDB Atlas](https://www.mongodb.com/atlas) — free tier available

---

## 🙋‍♀️ Developer

**PAKKI BONISHA SIVANI**  
Full Stack Developer | React · Node.js · MongoDB  

---

*⭐ If you found this project helpful, please star the repository!*
