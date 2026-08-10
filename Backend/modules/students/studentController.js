import bcrypt from "bcryptjs";
import User from "../Users/userModel.js";
import Student from "./student.Model.js";

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

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: "student",
    });

    const student = await Student.create({
      user: user._id,
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
