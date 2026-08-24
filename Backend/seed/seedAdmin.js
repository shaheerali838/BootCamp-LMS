import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../model/admin.model.js";
import ROLES from "../constants/roles.js";

/**
 * Ensures system administrators exist without creating any dummy data.
 * Safe to execute on startup.
 */
const seedAdmin = async () => {
  if (mongoose.connection.readyState !== 1) {
    return;
  }

  try {
    // 1. Ensure Super Admin
    const superAdminEmail = (
      process.env.SUPER_ADMIN_EMAIL || "superadmin@bootcamp.local"
    ).toLowerCase().trim();

    const existingSuperAdmin = await Admin.findOne({
      $or: [{ email: superAdminEmail }, { role: ROLES.SUPER_ADMIN }],
    });

    if (!existingSuperAdmin) {
      const hashedPassword = await bcrypt.hash(
        process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin@123",
        10
      );
      await Admin.create({
        firstName: "System",
        lastName: "Administrator",
        email: superAdminEmail,
        password: hashedPassword,
        phoneNumber: "03000000000",
        role: ROLES.SUPER_ADMIN,
        profileImage: "",
        status: "active",
      });
      console.log("✅ Default Super Admin Created:", superAdminEmail);
    }

    // 2. Ensure Primary Admin
    const adminEmail = (
      process.env.ADMIN_EMAIL || "shaheer838838@gmail.com"
    ).toLowerCase().trim();

    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || "Admin@123",
        10
      );
      await Admin.create({
        firstName: process.env.ADMIN_FIRST_NAME || "Shaheer",
        lastName: process.env.ADMIN_LAST_NAME || "Admin",
        email: adminEmail,
        password: hashedPassword,
        phoneNumber: process.env.ADMIN_PHONE || "03009876543",
        role: ROLES.ADMIN,
        profileImage: "",
        status: "active",
      });
      console.log("✅ Default Admin Created:", adminEmail);
    }
  } catch (error) {
    console.error("Seed Error:", error.message);
  }
};

export default seedAdmin;
