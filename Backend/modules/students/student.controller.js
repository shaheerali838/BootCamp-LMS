import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Student from "../../model/student.model.js";


//       Create a new Student  

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

    if (
      !rollNumber ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phoneNumber ||
      !gender ||
      !dateOfBirth ||
      !batchId ||
      !mentorId
    ) {
      return res.status(400).json({
        success: false,
        message: "All required student fields must be provided",
      });
    }

    const existingStudent = await Student.findOne({
      email: email.toLowerCase(),
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const existingRollNumber = await Student.findOne({
      rollNumber: rollNumber.trim(),
    });

    if (existingRollNumber) {
      return res.status(409).json({
        success: false,
        message: "Roll number already exists",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(batchId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mentor ID",
      });
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


//       Get all Students (Supports Pagination & Search)
 
export const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { search } = req.query;
    let query = {};

    // Search by Name, Email or Roll Number
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
    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};


//      Get Single Student by ID
 
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await Student.findById(id)
      .select("-password")
      .populate("batchId", "batchName program startDate endDate status")
      .populate("mentorId", "firstName lastName email");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student",
      error: error.message,
    });
  }
};


//     Get All Students in a Specific Batch
 
export const getStudentsByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(batchId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID",
      });
    }

    const students = await Student.find({ batchId })
      .select("-password")
      .populate("batchId", "batchName program startDate endDate status")
      .populate("mentorId", "firstName lastName email");

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch students by batch",
      error: error.message,
    });
  }
};


//       Update Student details

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
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

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    if (rollNumber && rollNumber !== student.rollNumber) {
      const existingRoll = await Student.findOne({
        rollNumber,
        _id: { $ne: id },
      });

      if (existingRoll) {
        return res.status(409).json({
          success: false,
          message: "Roll number already exists",
        });
      }
    }

    if (batchId && !mongoose.Types.ObjectId.isValid(batchId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID",
      });
    }

    if (mentorId && !mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mentor ID",
      });
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

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: studentResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update student",
      error: error.message,
    });
  }
};


//      Update Student status (active / inactive)

 
export const updateStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be active or inactive",
      });
    }

    const student = await Student.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Student ${status === "active" ? "activated" : "deactivated"} successfully`,
      data: student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update student status",
      error: error.message,
    });
  }
};


//     Delete Student

 
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await Student.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error: error.message,
    });
  }
};
