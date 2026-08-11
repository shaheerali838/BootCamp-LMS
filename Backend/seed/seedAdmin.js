import bcrypt from "bcryptjs";
import Admin from "../model/admin.model.js";

const seedAdmin = async () => {
  try {
    // Check Admin Exists
    const existingAdmin = await Admin.findOne({
      role: "admin",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    // Create Admin
    await Admin.create({
      firstName: process.env.ADMIN_FIRST_NAME,
      lastName: process.env.ADMIN_LAST_NAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      phoneNumber: process.env.ADMIN_PHONE,
      role: "admin",
      profileImage: "",
      status: "active",
    });

    console.log("Default Admin Created Successfully");
  } catch (error) {
    console.log("Seed Error:", error);
  }
};

export default seedAdmin;
