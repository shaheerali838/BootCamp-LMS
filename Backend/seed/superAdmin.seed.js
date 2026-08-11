import "dotenv/config";
import bcrypt from "bcryptjs";
import Admin from "../model/admin.model.js";
import connectDB from "../config/db.js";
import ROLES from "../constants/roles.js";

const seedSuperAdmin = async () => {
  try {
    await connectDB();

    const existingSuperAdmin = await Admin.findOne({
      role: ROLES.SUPER_ADMIN,
    });

    if (existingSuperAdmin) {
      console.log("Super Admin already exists.");
      process.exit(0);
    }

    const password = "SuperAdmin@123";

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = await Admin.create({
      firstName: "System",
      lastName: "Administrator",
      email: "superadmin@bootcamp.local",
      password: hashedPassword,
      role: ROLES.SUPER_ADMIN,
      phoneNumber: "03000000000",
      status: "active",
    });

    console.log("Super Admin created successfully.");
    console.log(`Email: ${superAdmin.email}`);
    console.log(`Password: ${password}`);

    process.exit(0);
  } catch (error) {
    console.error("Failed to create Super Admin:", error.message);
    process.exit(1);
  }
};

seedSuperAdmin();
