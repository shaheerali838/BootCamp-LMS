require("./config/env");

const express = require("express");
const connectDB = require("./config/db");

// Models load
require("./models/User");
require("./modules/teams/team.model");

const teamRoutes = require("./modules/teams/team.routes");

const app = express();

// Database Connection
connectDB();

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

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});