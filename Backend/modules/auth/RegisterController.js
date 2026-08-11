import Student from "../../model/student.model.js";

export const register = async (req, res) => {
  try {
    const {
      rollNumber,
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      dateOfBirth,
      batchId,
      mentorId,
    } = req.body;

    // Validate required fields
    if (
      !rollNumber ||
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !gender ||
      !dateOfBirth ||
      !batchId ||
      !mentorId
    ) {
      return res.status(400).json({
        success: false,
        message: "All required student fields must be provided.",
      });
    }

    // Check whether email already exists
    const existingStudent = await Student.findOne({
      email: email.toLowerCase(),
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student with this email already exists.",
      });
    }

    // Check whether roll number already exists
    const existingRollNumber = await Student.findOne({
      rollNumber,
    });

    if (existingRollNumber) {
      return res.status(400).json({
        success: false,
        message: "Roll number already exists.",
      });
    }

    // Create student
    const student = await Student.create({
      rollNumber,
      firstName,
      lastName,
      email: email.toLowerCase(),
      phoneNumber,
      gender,
      dateOfBirth,
      batchId,
      mentorId,
      status: "active",
    });

    return res.status(201).json({
      success: true,
      message: "Student registered successfully.",
      data: student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
