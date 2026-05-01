const redis = require('redis');

let redisClient;

const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    console.warn('⚠️ REDIS_URL not found. Running with in-memory fallback cache.');
    global.USE_IN_MEMORY_CACHE = true;
    return;
  }

  try {
    redisClient = redis.createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));
    redisClient.on('connect', () => console.log('🔄 Connecting to Redis...'));
    redisClient.on('ready', () => console.log('✅ Redis Ready'));
    await redisClient.connect();
    console.log('✅ Redis Connected');
    global.USE_IN_MEMORY_CACHE = false;
  } catch (error) {
    console.error(`❌ Error connecting to Redis: ${error.message}`);
    console.warn('⚠️ Falling back to in-memory cache.');
    global.USE_IN_MEMORY_CACHE = true;
  }
};

const getRedisClient = () => redisClient;

module.exports = { connectRedis, getRedisClient };
