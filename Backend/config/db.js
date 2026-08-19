import dns from "dns";
import mongoose from "mongoose";

// Ensure Node uses IPv4 first for reliable DNS lookups
try {
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
  }
} catch (e) {
  // Ignore if unsupported
}

let isConnected = false;

const connectDB = async (retryCount = 0) => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn("⚠️ MONGO_URI is missing. Please set MONGO_URI in your environment variables.");
    return;
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);

    // If querySrv or ECONNREFUSED error, attempt setting public DNS fallback and retry
    if (retryCount === 0 && (error.message.includes("querySrv") || error.message.includes("ECONNREFUSED"))) {
      console.log("🔄 Retrying MongoDB connection with fallback DNS servers (8.8.8.8, 1.1.1.1)...");
      try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
      } catch (dnsErr) {
        // ignore
      }
      return await connectDB(retryCount + 1);
    }

    if (retryCount < 2) {
      console.log(`🔄 Retrying MongoDB connection in 3 seconds (attempt ${retryCount + 1}/2)...`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return await connectDB(retryCount + 1);
    }

    console.error("❌ Could not connect to MongoDB after multiple attempts.");
    process.exit(1);
  }
};

export default connectDB;
