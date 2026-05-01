const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI not found. Running with in-memory fallback models.');
    global.USE_IN_MEMORY_DB = true;
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    global.USE_IN_MEMORY_DB = false;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    console.warn('⚠️ Falling back to in-memory models.');
    global.USE_IN_MEMORY_DB = true;
  }
};

module.exports = { connectDB };
