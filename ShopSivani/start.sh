#!/bin/bash
echo ""
echo "================================================"
echo " ShopSivani - Fashion E-Commerce"
echo " Developed by: PAKKI BONISHA SIVANI"
echo "================================================"
echo ""

if ! command -v node &>/dev/null; then
  echo "ERROR: Node.js not found. Install from https://nodejs.org"
  exit 1
fi

# Try to start MongoDB
brew services start mongodb-community 2>/dev/null || sudo systemctl start mongod 2>/dev/null || true
sleep 1

echo "[1/3] Installing packages..."
npm run install-all

echo ""
echo "[2/3] Seeding sample data..."
npm run seed

echo ""
echo "[3/3] Starting app..."
echo ""
echo "  Frontend → http://localhost:3000"
echo "  Backend  → http://localhost:5000"
echo "  Admin    → sivani@shopsivani.com / admin123"
echo ""
npm run dev
