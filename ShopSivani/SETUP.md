# ⚡ ShopSivani — Quick Setup Guide
**Developed by: PAKKI BONISHA SIVANI**
**Stack: React · Node.js · MongoDB · Google Gemini AI (FREE)**

---

## ✅ Step 1 — Install These First

| Tool | Download | Check in terminal |
|---|---|---|
| Node.js 18+ | https://nodejs.org | `node -v` |
| MongoDB | https://www.mongodb.com/try/download/community | `mongod --version` |

---

## 🤖 Step 2 — Get FREE Gemini API Key (2 minutes)

1. Go to → **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (starts with `AIza...`)
5. Open `backend/.env` and paste it:
```
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
✅ **100% Free — No credit card needed!**

---

## 🚀 Step 3 — Run the App

**Windows** — Double-click `start.bat`

**Mac / Linux** — Run in terminal:
```bash
chmod +x start.sh && ./start.sh
```

**Or manually:**
```bash
npm run install-all
npm run seed
npm run dev
```

✅ **Frontend:** http://localhost:3000
✅ **Backend API:** http://localhost:5000

---

## 🔐 Login Accounts (after seeding)

| Role  | Email | Password |
|-------|-------|----------|
| 👑 Admin | sivani@shopsivani.com | admin123 |
| 👤 User  | user@test.com | test123 |

---

## 🤖 AI Features

### 1. Siya — AI Fashion Stylist Chatbot
- Floating button (bottom-right corner) on every page
- Ask outfit advice, style tips, occasion wear suggestions
- Powered by Google Gemini (free)

### 2. AI Product Recommendations
- On the Home page — scroll down to "Get Personalised Picks"
- Select your gender, occasion, style, budget
- AI picks the best products from the catalogue for you

---

## 🛍️ App Features

- ✅ Product listing with search, filter, sort, pagination
- ✅ Product detail with image gallery, size/color picker
- ✅ Reviews & star ratings
- ✅ Shopping cart with price breakdown
- ✅ Wishlist (saved in browser)
- ✅ User register & login (JWT)
- ✅ 3-step checkout (Shipping → Payment → Confirm)
- ✅ Razorpay payment gateway
- ✅ Order tracking with status timeline
- ✅ User profile editor
- ✅ Admin dashboard (orders, products, users, analytics)

---

## 🐛 Common Issues

| Problem | Fix |
|---|---|
| `MongoDB connection refused` | Start MongoDB first (see below) |
| `Port 3000/5000 in use` | `npx kill-port 3000 5000` |
| `Module not found` | Run `npm run install-all` again |
| AI not responding | Check `GEMINI_API_KEY` in `backend/.env` |
| No products showing | Run `npm run seed` |

**Start MongoDB:**
- Windows: Search "MongoDB" in Start menu and run it
- Mac: `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`

---

## 🌐 Deploy Free Online

| Part | Platform | Steps |
|---|---|---|
| Frontend | **Vercel** | vercel.com → Import GitHub repo |
| Backend | **Render** | render.com → New Web Service → root: `backend` |
| Database | **MongoDB Atlas** | cloud.mongodb.com → Free cluster → get MONGO_URI |

---

*Built with ❤️ by PAKKI BONISHA SIVANI*
