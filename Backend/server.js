import "dotenv/config";
import app from "./app.js";
import seedAdmin from "./seed/seedAdmin.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 7000;

// Connect to MongoDB
await connectDB();

// Seed default admin
await seedAdmin();

// Start server
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
