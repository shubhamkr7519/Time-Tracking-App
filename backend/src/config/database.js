const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Make sure it's looking for MONGODB_URI (not MONGO_URI)
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/insightful');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
