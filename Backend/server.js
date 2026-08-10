// Load Environment Variables
await import("./config/env.js");

// Models
await import("./models/User.js");
await import("./modules/teams/team.model.js");

import express from "express";
import connectDB from "./config/db.js";

import teamRoutes from "./modules/teams/team.routes.js";
import userRoutes from "./modules/users/user.routes.js";

const app = express();

// Connect Database
await connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/teams", teamRoutes);

app.use("/api/users", userRoutes);

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server Running 🚀",
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
