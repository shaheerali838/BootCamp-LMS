import "dotenv/config";
import app from "../app.js";
import connectDB from "../config/db.js";
import seedAdmin from "../seed/seedAdmin.js";

let isSeeded = false;

export default async function handler(req, res) {
  try {
    await connectDB();
    if (!isSeeded) {
      await seedAdmin();
      isSeeded = true;
    }
    return app(req, res);
  } catch (error) {
    console.error("Vercel Serverless Handler DB Error:", error);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
}
