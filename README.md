# 🗳️ ElectBot - Your Election Education Assistant

ElectBot is an advanced, AI-powered educational platform designed to help users understand election processes across different countries. Built with modern web technologies and featuring a smart, interactive UI.

## ✨ Features

### Smart UI & UX
- 🎨 **Modern Gradient Design** - Beautiful, professional interface with smooth animations
- 🎤 **Voice Input** - Hands-free interaction using speech recognition
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🌓 **Dark/Light Mode** - Toggle between themes for comfortable viewing
- ⚡ **Real-time Chat** - Instant responses with typing indicators
- 💾 **Export Functionality** - Download chat history for later reference
- 🔊 **Sound Effects** - Optional audio feedback for interactions

### AI-Powered Features
- 💬 **Intelligent Chat** - Powered by Google's Gemini AI
- 📚 **Contextual Learning** - Maintains conversation history for better context
- 🌍 **Multi-Country Support** - India, USA, and UK election systems
- 📊 **Election Timeline** - Interactive visual timeline of the election process
- 🎯 **Smart Suggestions** - AI-generated follow-up questions

### Developer Features
- 🔧 **Fallback Support** - Works without MongoDB/Redis using in-memory storage
- 🛡️ **Security Headers** - Helmet.js for enhanced security
- 📝 **Comprehensive Logging** - Winston logger for debugging
- 🚀 **Fast & Optimized** - Built with Vite for lightning-fast development
- 🎯 **State Management** - Redux Toolkit for predictable state updates

## 🏗️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Next-generation frontend tooling
- **Redux Toolkit** - State management
- **TailwindCSS 4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons

### Backend
- **Node.js & Express** - Server framework
- **Google Gemini AI** - Advanced AI responses
- **MongoDB** - Database (optional, falls back to in-memory)
- **Redis** - Caching (optional, falls back to in-memory)
- **Winston** - Logging
- **Helmet** - Security

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API Key (Get one from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env .env.local
```

4. Edit `.env` and add your Gemini API key:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here

# Optional - For production deployments
# MONGODB_URI=mongodb://localhost:27017/election-assistant
# REDIS_URL=redis://localhost:6379
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🚀 Usage

1. **Select Your Region** - Choose between India, USA, or UK from the header dropdown
2. **Start Chatting** - Ask questions about elections, voting, and electoral processes
3. **Use Voice Input** - Click the microphone icon to speak your questions
4. **Explore Timeline** - View the step-by-step election process
5. **Learn More** - Access educational content in the Learn tab
6. **Export Chat** - Download your conversation history anytime

## 🎯 Example Questions

- "How does voting work in India?"
- "What is an EVM?"
- "How are election results counted?"
- "Who can contest elections?"
- "What is the role of the Election Commission?"
- "How does postal voting work?"

## 📁 Project Structure

```
election-assistant/
├── backend/
│   ├── src/
│   │   ├── config/         # Database and API configurations
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Error handling, validation
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── app.js          # Express app setup
│   ├── .env                # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Chat/       # Chat interface
│   │   │   ├── Timeline/   # Election timeline
│   │   │   ├── Learn/      # Learning resources
│   │   │   ├── Header.jsx  # Top navigation
│   │   │   ├── Loading.jsx # Loading states
│   │   │   └── VoiceInput.jsx # Speech recognition
│   │   ├── store/          # Redux state management
│   │   ├── api/            # API client
│   │   ├── config/         # Theme and settings
│   │   └── App.jsx         # Main app component
│   ├── .env                # Environment variables
│   └── package.json
│
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables
```env
PORT=5000                              # Server port
GEMINI_API_KEY=your_key               # Required: Google Gemini API key
MONGODB_URI=mongodb://localhost:27017 # Optional: MongoDB connection
REDIS_URL=redis://localhost:6379      # Optional: Redis connection
NODE_ENV=development                  # Environment mode
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:5000/api  # Backend API URL
VITE_APP_NAME=ElectBot                  # Application name
VITE_APP_VERSION=2.0.0                  # Version number
```

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev    # Start with nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev    # Start Vite dev server
npm run build  # Build for production
npm run preview # Preview production build
```

## 🐛 Troubleshooting

### Backend Issues

**Issue: "GEMINI_API_KEY is missing"**
- Solution: Add your Gemini API key to the `.env` file

**Issue: MongoDB connection failed**
- Solution: The app will automatically fall back to in-memory storage. For production, ensure MongoDB is running.

**Issue: Port 5000 already in use**
- Solution: Change the `PORT` in `.env` file or stop the process using port 5000

### Frontend Issues

**Issue: API connection failed**
- Solution: Ensure backend is running on the correct port and `VITE_API_URL` is properly configured

**Issue: Voice input not working**
- Solution: Voice input requires HTTPS in production. For development, ensure your browser has microphone permissions.

## 📝 API Endpoints

### Chat
- `POST /api/chat` - Send a message and get AI response

### Timeline
- `GET /api/timeline?country={country}` - Get election timeline for a country

### Quiz
- `GET /api/quiz?country={country}` - Get quiz questions

### Glossary
- `GET /api/glossary?country={country}` - Get election terminology

### Health Check
- `GET /api/health` - Check server status

## 🔒 Security Features

- Helmet.js security headers
- CORS configuration
- Rate limiting (ready to implement)
- Input validation
- Error sanitization in production

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Set environment variables
2. Deploy with `npm start`
3. Ensure MongoDB and Redis are configured

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set `VITE_API_URL` to your backend URL

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for powering the conversational intelligence
- Lucide for beautiful icons
- Framer Motion for smooth animations
- TailwindCSS for the utility-first CSS framework

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ for civic education**
