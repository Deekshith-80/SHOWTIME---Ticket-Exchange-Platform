const mongoose = require("mongoose");

let cachedConnection = null;

const connectDB = async () => {
  try {
    if (cachedConnection) {
      console.log("🍃 Using cached Tenant Database connection");
      return cachedConnection;
    }

    mongoose.set("bufferCommands", false);

    cachedConnection = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 2,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      bufferCommands: false,
    });

    console.log("🍃 Tenant Database connected safely to Atlas Cluster");
    return cachedConnection;
  } catch (error) {
    console.error(`Database connection fault: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
