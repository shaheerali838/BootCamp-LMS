import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";
import seedAdmin from "./seed/seedAdmin.js";

const PORT = process.env.PORT || 7000;
const MONGO_URI =
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/saylani-lms";

mongoose
    .connect(MONGO_URI)
    .then(async () => {
        console.log("Connected to MongoDB successfully");

        // Create Default Admin (Only First Time)
        await seedAdmin();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    });