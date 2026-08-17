import express from "express";
import cors from "cors";
import mainRouter from "./routes/index.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));

// Mount all routes at /api
app.use("/api", mainRouter);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Saylani Bootcamp LMS API" });
});

export default app;
