// Load Environment Variables
require("./config/env");

// Models
require("./models/User");
require("./modules/teams/team.model");

const express = require("express");
const connectDB = require("./config/db");

const teamRoutes = require("./modules/teams/team.routes");
const userRoutes = require("./modules/users/user.routes");

const app = express();

// Connect Database
connectDB();

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