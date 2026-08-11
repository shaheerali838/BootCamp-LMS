import bcrypt from "bcryptjs";
import Admin from "../../model/admin.model.js";
import Student from "../../model/student.model.js";

export const createStudent = async (req, res) => {
  try {
    const {
      rollNumber,
      firstName,
      lastName,
      email,
      password,
      phone,
      gender,
      dob,
      batchId,
    } = req.body;

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const Admin = await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: "student",
    });

    const student = await Student.create({
      Admin: Admin._id,
      rollNumber,
      gender,
      dob,
      batchId,
    });

    res.status(201).json({
      success: true,
      message: "Student Registered Successfully",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
