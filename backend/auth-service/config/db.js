const mongoose = require("mongoose");

let cachedConnection = null;

const connectDB = async () => {
  try {
    if (cachedConnection) {
      console.log(`🚀 Using cached MongoDB connection`);
      return cachedConnection;
    }

    mongoose.set("bufferCommands", false);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 2,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      bufferCommands: false,
    });

    cachedConnection = conn;
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    return cachedConnection;
  } catch (error) {
    console.error(`Database connection critical failure: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
