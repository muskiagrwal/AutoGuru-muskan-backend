@echo off
echo.
echo ========================================
echo   Testing Mechanic Signup (Email Only)
echo ========================================
echo.

curl -X POST http://localhost:5000/api/auth/mechanic/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@mechanic.com\",\"password\":\"password123\",\"businessName\":\"Test Auto Repair\",\"phone\":\"+61412345678\"}"

echo.
echo.
echo ========================================
echo   Testing Mechanic Login
echo ========================================
echo.

curl -X POST http://localhost:5000/api/auth/mechanic/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@mechanic.com\",\"password\":\"password123\"}"

echo.
echo.
