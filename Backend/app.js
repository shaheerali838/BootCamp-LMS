import express from "express";
import cors from "cors";
import mainRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import { trimMiddleware } from "./middleware/trimMiddleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(trimMiddleware);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or any trusted domain
      callback(null, true);
    },
    credentials: true,
  }),
);

// Root route
app.get("/", (req, res) => {
  res.json({ success: true, message: "Welcome to Saylani Bootcamp LMS API" });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "OK", timestamp: new Date().toISOString() });
});

// Mount all routes at /api
app.use("/api", mainRouter);

export default app;
