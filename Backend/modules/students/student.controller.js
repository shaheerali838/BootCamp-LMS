import bcrypt from "bcryptjs";
import Student from "../../model/student.model.js";
import sendEmail from "../../utils/sendEmail.js";

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
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const existingRollNumber = await Student.findOne({
      rollNumber,
    });

    if (existingRollNumber) {
      return res.status(400).json({
        success: false,
        message: "Roll number already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      rollNumber,
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phoneNumber,
      gender,
      dateOfBirth,
      batchId,
      mentorId,
    });

    // --- NEW: Send the Welcome Email ---
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
      // We don't return an error here because the student WAS successfully created in the DB
    }
    // ------------------------------------

    const studentResponse = student.toObject();
    delete studentResponse.password;

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: studentResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select("-password")
      .populate("batchId", "batchName batchCode")
      .populate("mentorId", "firstName lastName email");

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
