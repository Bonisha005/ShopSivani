@echo off
echo.
echo  ================================================
echo   ShopSivani - Fashion E-Commerce by PAKKI BONISHA SIVANI
echo  ================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo ERROR: Node.js not found!
  echo Download from: https://nodejs.org
  pause
  exit /b 1
)

echo [1/3] Installing all packages (first time only - takes 2 mins)...
call npm run install-all

echo.
echo [2/3] Adding sample products and users...
call npm run seed

echo.
echo [3/3] Starting app...
echo.
echo  Frontend: http://localhost:3000
echo  Backend:  http://localhost:5000
echo  Admin:    sivani@shopsivani.com / admin123
echo.
call npm run dev
pause
