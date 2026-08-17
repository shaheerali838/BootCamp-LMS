import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    if (process.env.MONGO_URI) {
      console.log("Connecting to MongoDB...");
      await mongoose.connect(process.env.MONGO_URI);
      isConnected = true;
      console.log("✅ MongoDB Connected");
    } else {
      console.warn("⚠️ MONGO_URI is missing. Please set MONGO_URI in your environment variables.");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

export default connectDB;
