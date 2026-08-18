import dns from "dns";
import mongoose from "mongoose";

// Ensure Node uses public DNS resolvers to handle Atlas SRV (_mongodb._tcp) queries reliably
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
  }
} catch (e) {
  // Ignore if DNS server configuration is restricted
}

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    if (process.env.MONGO_URI) {
      console.log("Connecting to MongoDB...");
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      isConnected = true;
      console.log("✅ MongoDB Connected");
    } else {
      console.warn("⚠️ MONGO_URI is missing. Please set MONGO_URI in your environment variables.");
    }
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
