import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../model/admin.model.js";
import ROLES from "../constants/roles.js";

const seedAdmin = async () => {
  if (mongoose.connection.readyState !== 1) {
    return;
  }

  try {
    // 1. Seed Super Admin
    const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || "superadmin@bootcamp.local").toLowerCase();
    const existingSuperAdmin = await Admin.findOne({ email: superAdminEmail });

    if (!existingSuperAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin@123", 10);
      await Admin.create({
        firstName: "Super",
        lastName: "Admin",
        email: superAdminEmail,
        password: hashedPassword,
        phoneNumber: "03001234567",
        role: ROLES.SUPER_ADMIN,
        profileImage: "",
        status: "active",
      });
      console.log("Default Super Admin Created:", superAdminEmail);
    }

    // 2. Seed Standard Admin
    const adminEmail = (process.env.ADMIN_EMAIL || "shaheer838838@gmail.com").toLowerCase();
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@123", 10);
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
      console.log("Default Admin Created:", adminEmail);
    }
  } catch (error) {
    console.log("Seed Error:", error.message);
  }
};

export default seedAdmin;