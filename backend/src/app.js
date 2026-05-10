const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/db');
const { connectRedis } = require('./config/redis');

// Initialize Express app
const app = express();

// Trust proxy (important for Render / reverse proxies)
app.set('trust proxy', 1);

// Allowed origins
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without origin (health checks, Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS policy does not allow access from origin: ${origin}`)
      );
    },
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'API is running',
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/chat', require('./routes/chat.routes'));
app.use('/api/timeline', require('./routes/timeline.routes'));
app.use('/api/quiz', require('./routes/quiz.routes'));
app.use('/api/glossary', require('./routes/glossary.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: global.USE_IN_MEMORY_DB ? 'in-memory' : 'connected',
    redis: global.USE_IN_MEMORY_CACHE ? 'in-memory' : 'connected',
  });
});

// Error handlers
const {
  errorHandler,
  notFoundHandler,
} = require('./middleware/errorHandler');

app.use(notFoundHandler);
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    console.log('Starting server...');

    // Connect services
    await connectDB();
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();