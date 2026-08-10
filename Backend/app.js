import express from "express";
import cors from "cors";
import mainRouter from "./routes/index.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use(cookieParser());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

// Mount all routes at /api
app.use("/api", mainRouter);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Saylani Bootcamp LMS API" });
});

export default app;
