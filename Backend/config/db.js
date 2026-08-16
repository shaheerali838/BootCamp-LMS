import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    console.log("MONGO_URI:", process.env.MONGO_URI ? "Set" : "Not Set");

    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);

      console.log("✅ MongoDB Connected");
    } else {
      console.log("⚠️ MONGO_URI is missing. Skipping MongoDB connection.");
    }
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
