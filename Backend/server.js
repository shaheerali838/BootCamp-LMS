import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";
import seedAdmin from "./seed/seedAdmin.js";
import connectDB from "./config/db.js";
import teamRoutes from "./modules/teams/team.routes.js";

const PORT = process.env.PORT || 7000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/saylani-lms";

// Connect Database
await connectDB();

// Seed Admin
await seedAdmin();

// Middleware
app.use(express.json());

// Routes
app.use("/api/teams", teamRoutes);

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server Running 🚀",
  });
});

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
