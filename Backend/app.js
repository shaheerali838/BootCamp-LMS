import express from "express";
import cors from "cors";
import mainRouter from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount all routes at /api
app.use("/api", mainRouter);

// Root route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Saylani Bootcamp LMS API" });
});

export default app;
