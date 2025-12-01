@echo off
echo ========================================
echo AutoGuru Backend Setup Script
echo ========================================
echo.

cd /d "c:\Users\ashut\Downloads\AutoGuru-muskan-dev (1)\backend"

echo Step 1: Checking if .env file exists...
if exist .env (
    echo [OK] .env file already exists
) else (
    echo [ACTION NEEDED] Creating .env file from template...
    copy env.example .env
    echo.
    echo ⚠️  IMPORTANT: Please edit the .env file and update:
    echo    - MONGODB_URI with your actual MongoDB connection string
    echo    - JWT_SECRET with a strong random secret key
    echo.
    pause
)

echo.
echo Step 2: Checking if node_modules exists...
if exist node_modules (
    echo [OK] Dependencies already installed
) else (
    echo [ACTION] Installing dependencies...
    call npm install
)

echo.
echo Step 3: Backend setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Edit .env file with your MongoDB URI and JWT secret
echo 2. Run 'npm run dev' to start the development server
echo 3. Server will run on http://localhost:5000
echo.
echo To start the server now, run:
echo   npm run dev
echo.
pause
