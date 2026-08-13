import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Student from "../../model/student.model.js";
import sendEmail from "../../utils/sendEmail.js";

// ---------- CREATE STUDENT ----------
export const createStudent = async (req, res) => {
  try {
    const {
      rollNumber,
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      gender,
      dateOfBirth,
      batchId,
      mentorId,
    } = req.body;

    const existingStudent = await Student.findOne({
      email: email.toLowerCase(),
    });
    if (existingStudent) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }

    const existingRollNumber = await Student.findOne({
      rollNumber: rollNumber.trim(),
    });
    if (existingRollNumber) {
      return res
        .status(409)
        .json({ success: false, message: "Roll number already exists" });
    }



    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      rollNumber: rollNumber.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phoneNumber: phoneNumber.trim(),
      gender,
      dateOfBirth,
      batchId,
      mentorId,
    });

    // Send the Welcome Email
    try {
      await sendEmail({
        to: student.email,
        subject: "Welcome to the LMS Bootcamp",
        html: `
          <h3>Welcome, ${student.firstName}!</h3>
          <p>Your student account has been successfully created.</p>
          <p><strong>Your Login Credentials:</strong></p>
          <ul>
            <li>Email: ${student.email}</li>
            <li>Password: ${password}</li>
          </ul>
          <p>Please log in and change your password as soon as possible.</p>
        `,
      });
      console.log("Welcome email sent successfully to", student.email);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    const studentResponse = student.toObject();
    delete studentResponse.password;

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: studentResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create student",
      error: error.message,
    });
  }
};

// ---------- GET ALL STUDENTS ----------
export const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { search } = req.query;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query = {
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
          { rollNumber: searchRegex },
        ],
      };
    }

    const totalStudents = await Student.countDocuments(query);
    const students = await Student.find(query)
      .select("-password")
      .populate("batchId", "batchName program startDate endDate status")
      .populate("mentorId", "firstName lastName email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: students,
      pagination: {
        totalItems: totalStudents,
        currentPage: page,
        totalPages: Math.ceil(totalStudents / limit),
        pageSize: limit,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch students",
        error: error.message,
      });
  }
};

// ---------- GET STUDENT BY ID ----------
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student ID" });
    }

    const student = await Student.findById(id)
      .select("-password")
      .populate("batchId", "batchName program startDate endDate status")
      .populate("mentorId", "firstName lastName email");

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    return res.status(200).json({ success: true, data: student });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch student",
        error: error.message,
      });
  }
};

// ---------- GET STUDENTS BY BATCH ----------
export const getStudentsByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(batchId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid batch ID" });
    }

    const students = await Student.find({ batchId })
      .select("-password")
      .populate("batchId", "batchName program startDate endDate status")
      .populate("mentorId", "firstName lastName email");

    return res
      .status(200)
      .json({ success: true, count: students.length, data: students });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch students by batch",
        error: error.message,
      });
  }
};

// ---------- UPDATE STUDENT ----------
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student ID" });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const {
      rollNumber,
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      gender,
      dateOfBirth,
      batchId,
      mentorId,
    } = req.body;

    if (email && email.toLowerCase() !== student.email) {
      const existingEmail = await Student.findOne({
        email: email.toLowerCase(),
        _id: { $ne: id },
      });
      if (existingEmail)
        return res
          .status(409)
          .json({ success: false, message: "Email already exists" });
    }

    if (rollNumber && rollNumber !== student.rollNumber) {
      const existingRoll = await Student.findOne({
        rollNumber,
        _id: { $ne: id },
      });
      if (existingRoll)
        return res
          .status(409)
          .json({ success: false, message: "Roll number already exists" });
    }

    if (rollNumber) student.rollNumber = rollNumber.trim();
    if (firstName) student.firstName = firstName.trim();
    if (lastName) student.lastName = lastName.trim();
    if (email) student.email = email.toLowerCase().trim();
    if (phoneNumber) student.phoneNumber = phoneNumber.trim();
    if (gender) student.gender = gender;
    if (dateOfBirth) student.dateOfBirth = dateOfBirth;
    if (batchId) student.batchId = batchId;
    if (mentorId) student.mentorId = mentorId;

    if (password) {
      student.password = await bcrypt.hash(password, 10);
    }

    await student.save();

    const studentResponse = student.toObject();
    delete studentResponse.password;

    return res
      .status(200)
      .json({
        success: true,
        message: "Student updated successfully",
        data: studentResponse,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to update student",
        error: error.message,
      });
  }
};

// ---------- UPDATE STUDENT STATUS ----------
export const updateStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student ID" });
    }

    if (!["active", "inactive"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Status must be active or inactive" });
    }

    const student = await Student.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    ).select("-password");

    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

    return res.status(200).json({
      success: true,
      message: `Student ${status === "active" ? "activated" : "deactivated"} successfully`,
      data: student,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to update student status",
        error: error.message,
      });
  }
};

// ---------- DELETE STUDENT ----------
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student ID" });
    }

    const student = await Student.findById(id);
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

    await Student.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete student",
        error: error.message,
      });
  }
};
