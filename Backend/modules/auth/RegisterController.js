import bcrypt from "bcryptjs";
import Admin from "../../model/admin.model.js";
import Student from "../../model/student.model.js";

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      profileImage,
      studentCode,
      gender,
      dob,
      batchId,
      mentorId,
    } = req.body;

    // Check Email
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Check Student Code
    const existingStudent = await Student.findOne({ studentCode });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student Code already exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Admin
    const Admin = await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber: phone,
      profileImage,
      role: "student",
      status: "active",
    });

    // Create Student
    const student = await Student.create({
      Admin: Admin._id,
      studentCode,
      gender,
      dob,
      batchId,
      mentorId,
      status: "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Student Registered Successfully",
      data: {
        Admin,
        student,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
