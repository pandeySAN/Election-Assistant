# 🚀 Quick Start Guide - ElectBot

## Step 1: Prerequisites Check
- ✅ Node.js v18 or higher installed
- ✅ npm or yarn package manager
- ✅ Google Gemini API Key (get from https://makersuite.google.com/app/apikey)

## Step 2: Automated Setup (Recommended)

### For Linux/Mac:
```bash
chmod +x setup.sh
./setup.sh
```

### For Windows:
```cmd
setup.bat
```

## Step 3: Manual Setup (If automated fails)

### Backend Setup:
```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```env
PORT=5000
GEMINI_API_KEY=your_actual_gemini_api_key_here
NODE_ENV=development
```

### Frontend Setup:
```bash
cd frontend
npm install
```

Create `.env` file in frontend folder (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

## Step 4: Run the Application

### Option A: Run both together (from root directory)
```bash
npm install  # Install concurrently
npm run dev
```

### Option B: Run separately (in two terminals)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Step 5: Access the Application

Open your browser and go to: **http://localhost:5173**

The backend will be running on: **http://localhost:5000**

## 🎉 You're Ready!

Start chatting with ElectBot to learn about elections!

## 🆘 Troubleshooting

### Backend won't start:
- Check if GEMINI_API_KEY is set in backend/.env
- Make sure port 5000 is not in use
- Check Node.js version: `node --version` (should be v18+)

### Frontend won't connect:
- Ensure backend is running first
- Check VITE_API_URL in frontend/.env points to http://localhost:5000/api
- Clear browser cache and restart

### Voice input not working:
- Voice input requires HTTPS in production
- For local development, grant microphone permissions in browser
- Voice input may not work in all browsers (Chrome/Edge recommended)

## 📖 Features to Try

1. **Chat** - Ask questions about elections
2. **Timeline** - Explore the election process step-by-step
3. **Quiz** - Test your knowledge
4. **Glossary** - Search for political terms
5. **Voice Input** - Click the microphone icon to speak
6. **Export** - Download your chat history

## 🌍 Supported Countries

- 🇮🇳 India
- 🇺🇸 United States
- 🇬🇧 United Kingdom

Select your country from the header dropdown!

## 💡 Tips

- Use the suggested prompts for quick starts
- Click on follow-up questions for deeper learning
- Export your chat for study reference
- Try the knowledge quiz to test what you've learned

---

Need more help? Check the full README.md or open an issue on GitHub.
