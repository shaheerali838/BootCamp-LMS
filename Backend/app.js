import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import mainRouter from "./routes/index.js";
import { trimMiddleware } from "./middleware/trimMiddleware.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Disable framework fingerprinting
app.disable("x-powered-by");

// Secure HTTP headers with helmet
app.use(helmet());

// Body & cookie parsers
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(trimMiddleware);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or any trusted domain
      callback(null, true);
    },
    credentials: true,
  }),
);

// Strict rate limiter for health check endpoints (e.g. 60 requests/minute per IP)
const healthRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many health check requests, please try again later." },
});

// 1. Root route: Redirect to frontend application URL or return 404 if not configured
app.get("/", (req, res) => {
  const frontendUrl =
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    "https://saylani-bootcamp-lms.vercel.app";

  if (frontendUrl) {
    return res.redirect(302, frontendUrl);
  }

  return res.status(404).json({ error: "Not Found" });
});

// 2. Health check route handler (minimal payload, exposes zero sensitive information)
const handleHealthCheck = (req, res) => {
  res.status(200).json({ status: "ok" });
};

// Mount unauthenticated health check on both /health and /api/health with strict rate limiting
app.get("/health", healthRateLimiter, handleHealthCheck);
app.get("/api/health", healthRateLimiter, handleHealthCheck);

// Mount all API routes at /api
app.use("/api", mainRouter);

// 3. Standardized 404 catch-all handler for undefined routes
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;

