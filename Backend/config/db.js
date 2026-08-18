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

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    console.log("MONGO_URI:", process.env.MONGO_URI ? "Set" : "Not Set");

    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      });

      console.log("✅ MongoDB Connected");
    } else {
      console.log("⚠️ MONGO_URI is missing. Skipping MongoDB connection.");
    }
  } catch (error) {
    console.log("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
