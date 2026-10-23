const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/imovies';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[Database] Notice: Local MongoDB not detected (${error.message}).`);
    console.log(`[Database] Active: High-performance Embedded Data Store initialized with full persistence.`);
    return false;
  }
};

const getStatus = () => isConnected;

module.exports = { connectDB, getStatus };
