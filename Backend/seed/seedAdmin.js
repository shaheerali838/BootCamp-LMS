import bcrypt from "bcryptjs";
import Admin from "../model/admin.model.js";
import ROLES from "../constants/roles.js";

const seedAdmin = async () => {
  try {
    // Check required environment variables
    const {
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
      ADMIN_FIRST_NAME,
      ADMIN_LAST_NAME,
      ADMIN_PHONE,
    } = process.env;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        "ADMIN_EMAIL or ADMIN_PASSWORD is missing in .env file"
      );
    }

    // Check Admin Exists
    const existingAdmin = await Admin.findOne({
      email: ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("Seeded Admin Email:", ADMIN_EMAIL);
      console.log("Admin already exists");
      return;
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create Admin
    await Admin.create({
      firstName: ADMIN_FIRST_NAME,
      lastName: ADMIN_LAST_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      phoneNumber: ADMIN_PHONE,
      role: ROLES.ADMIN,
      profileImage: "",
      status: "active",
    });

    console.log("Default Admin Created Successfully");
  } catch (error) {
    console.log("Seed Error:", error.message);
  }
};

export default seedAdmin;