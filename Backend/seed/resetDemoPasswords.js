import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  const hashedStudent = await bcrypt.hash("Student@123", 10);
  const hashedAdmin = await bcrypt.hash("Admin@123", 10);
  const hashedSuperAdmin = await bcrypt.hash("SuperAdmin@123", 10);

  // Update students
  const resStudents = await mongoose.connection.collection("students").updateMany(
    {},
    { $set: { password: hashedStudent, status: "active" } }
  );
  console.log("Students updated:", resStudents.modifiedCount);

  // Ensure Admin
  const resAdmin = await mongoose.connection.collection("admins").updateOne(
    { email: "shaheer838838@gmail.com" },
    { $set: { password: hashedAdmin, status: "active" } }
  );
  console.log("Admin updated:", resAdmin.modifiedCount);

  // Ensure SuperAdmin
  const resSuperAdmin = await mongoose.connection.collection("admins").updateOne(
    { email: "superadmin@bootcamp.local" },
    { $set: { password: hashedSuperAdmin, status: "active" } }
  );
  console.log("SuperAdmin updated:", resSuperAdmin.modifiedCount);

  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
