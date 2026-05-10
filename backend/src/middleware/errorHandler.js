const winston = require('winston');

// Logger configuration
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),

  defaultMeta: {
    service: 'election-assistant-api',
  },

  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === 'production'
          ? winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
          : winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ level, message, timestamp, stack }) => {
              return `${timestamp} ${level}: ${stack || message}`;
            })
          ),
    }),
  ],
});

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    stack: err.stack,
  });

  const statusCode = err.statusCode || 500;

  // Handle common errors
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    message = 'Validation failed';
  }

  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Token expired';
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
      }),
    },
  });
};

/**
 * 404 Not Found Middleware
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.originalUrl}`,
      statusCode: 404,
    },
  });
};

module.exports = {
  logger,
  errorHandler,
  notFoundHandler,
};