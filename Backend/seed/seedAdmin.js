import bcrypt from "bcryptjs";
import Admin from "../model/admin.model.js";
import Student from "../model/student.model.js";
import Batch from "../model/batch.model.js";
import ROLES from "../constants/roles.js";

const seedAdmin = async () => {
  try {
    // 1. Seed Super Admin
    const superAdminEmail = (
      process.env.SUPER_ADMIN_EMAIL || "superadmin@bootcamp.local"
    ).toLowerCase();
    let superAdmin = await Admin.findOne({ email: superAdminEmail });

    if (!superAdmin) {
      const hashedPassword = await bcrypt.hash(
        process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin@123",
        10,
      );
      superAdmin = await Admin.create({
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
    const adminEmail = (
      process.env.ADMIN_EMAIL || "shaheer838838@gmail.com"
    ).toLowerCase();
    let admin = await Admin.findOne({ email: adminEmail });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || "Admin@123",
        10,
      );
      admin = await Admin.create({
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

    // 3. Seed Default Batch
    let defaultBatch = await Batch.findOne({ batchName: "Cohort 2026-A" });
    if (!defaultBatch) {
      defaultBatch = await Batch.create({
        batchName: "Cohort 2026-A",
        program: "Full Stack Web Development",
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-06-30"),
        status: "active",
      });
      console.log("Default Batch Created: Cohort 2026-A");
    }

    // 4. Seed Default Student
    const studentEmail = "student@bootcamp.local";
    const existingStudent = await Student.findOne({ email: studentEmail });
    if (!existingStudent) {
      const studentHashedPassword = await bcrypt.hash("Student@123", 10);
      await Student.create({
        rollNumber: "SMIT-1001",
        firstName: "Ali",
        lastName: "Hassan",
        email: studentEmail,
        password: studentHashedPassword,
        phoneNumber: "03001112233",
        gender: "male",
        dateOfBirth: new Date("2002-05-15"),
        batchId: defaultBatch._id,
        mentorId: admin?._id || superAdmin?._id,
        status: "active",
      });
      console.log("Default Student Created:", studentEmail);
    }
  } catch (error) {
    console.log("Seed Error:", error.message);
  }
};

export default seedAdmin;
