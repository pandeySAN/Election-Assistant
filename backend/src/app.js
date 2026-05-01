const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/db');
const { connectRedis } = require('./config/redis');

// Initialize Express app
const app = express();

// CORS — allow the Render frontend (set CORS_ORIGIN in Render env vars) + local dev
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server / health-check requests with no origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/chat', require('./routes/chat.routes'));
app.use('/api/timeline', require('./routes/timeline.routes'));
app.use('/api/quiz', require('./routes/quiz.routes'));
app.use('/api/glossary', require('./routes/glossary.routes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: global.USE_IN_MEMORY_DB ? 'in-memory' : 'connected',
    redis: global.USE_IN_MEMORY_CACHE ? 'in-memory' : 'connected'
  });
});

// 404 handler
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Attempt to connect to DBs, but don't crash if they fail
    // We will fallback to in-memory in services if they fail
    await connectDB();
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
