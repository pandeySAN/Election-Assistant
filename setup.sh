#!/bin/bash

# ElectBot Setup Script
echo "🗳️  ElectBot Setup Script"
echo "========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Backend Setup
echo "📦 Setting up backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "📝 Creating backend .env file..."
    cat > .env << EOF
PORT=5000
# Add your Gemini API Key here
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# Optional: Uncomment for production
# MONGODB_URI=mongodb://localhost:27017/election-assistant
# REDIS_URL=redis://localhost:6379
NODE_ENV=development
EOF
    echo "⚠️  Please edit backend/.env and add your GEMINI_API_KEY"
else
    echo "✅ Backend .env file already exists"
fi

echo "📦 Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Backend installation failed"
    exit 1
fi

cd ..
echo ""

# Frontend Setup
echo "📦 Setting up frontend..."
cd frontend

if [ ! -f ".env" ]; then
    echo "📝 Creating frontend .env file..."
    cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ElectBot
VITE_APP_VERSION=2.0.0
EOF
    echo "✅ Frontend .env file created"
else
    echo "✅ Frontend .env file already exists"
fi

echo "📦 Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Frontend installation failed"
    exit 1
fi

cd ..
echo ""

# Summary
echo "========================="
echo "✅ Setup Complete!"
echo "========================="
echo ""
echo "Next steps:"
echo "1. Edit backend/.env and add your GEMINI_API_KEY"
echo "   Get your API key from: https://makersuite.google.com/app/apikey"
echo ""
echo "2. Start the backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "3. Start the frontend (in a new terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Open http://localhost:5173 in your browser"
echo ""
echo "📚 For more information, see README.md"
echo ""
