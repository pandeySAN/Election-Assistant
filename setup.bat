@echo off
REM ElectBot Setup Script for Windows
echo.
echo ===============================
echo ElectBot Setup Script
echo ===============================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js v18 or higher.
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Backend Setup
echo Setting up backend...
cd backend

if not exist .env (
    echo Creating backend .env file...
    (
        echo PORT=5000
        echo # Add your Gemini API Key here
        echo GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
        echo.
        echo # Optional: Uncomment for production
        echo # MONGODB_URI=mongodb://localhost:27017/election-assistant
        echo # REDIS_URL=redis://localhost:6379
        echo NODE_ENV=development
    ) > .env
    echo WARNING: Please edit backend\.env and add your GEMINI_API_KEY
) else (
    echo Backend .env file already exists
)

echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed
    pause
    exit /b 1
)
echo Backend dependencies installed successfully
cd ..
echo.

REM Frontend Setup
echo Setting up frontend...
cd frontend

if not exist .env (
    echo Creating frontend .env file...
    (
        echo VITE_API_URL=http://localhost:5000/api
        echo VITE_APP_NAME=ElectBot
        echo VITE_APP_VERSION=2.0.0
    ) > .env
    echo Frontend .env file created
) else (
    echo Frontend .env file already exists
)

echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully
cd ..
echo.

REM Summary
echo.
echo ===============================
echo Setup Complete!
echo ===============================
echo.
echo Next steps:
echo 1. Edit backend\.env and add your GEMINI_API_KEY
echo    Get your API key from: https://makersuite.google.com/app/apikey
echo.
echo 2. Start the backend server:
echo    cd backend ^&^& npm run dev
echo.
echo 3. Start the frontend (in a new terminal):
echo    cd frontend ^&^& npm run dev
echo.
echo 4. Open http://localhost:5173 in your browser
echo.
echo For more information, see README.md
echo.
pause
