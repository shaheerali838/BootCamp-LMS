import Student from "../../model/student.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { hashToken, generateResetToken } from "../../utils/token.js";
import sendEmail from "../../utils/sendEmail.js";

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

    const existingStudent = await Student.findOne({
      email: email.toLowerCase(),
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student with this email already exists.",
      });
    }

    const existingRollNumber = await Student.findOne({
      rollNumber,
    });

    if (existingRollNumber) {
      return res.status(400).json({
        success: false,
        message: "Roll number already exists.",
      });
    }

    // Generate temporary password and setup token
    const tempPassword = crypto.randomBytes(16).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const setupToken = generateResetToken();
    const hashedSetupToken = hashToken(setupToken);
    const setupTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

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
      password: hashedPassword,
      resetPasswordTokenHash: hashedSetupToken,
      resetPasswordExpiresAt: setupTokenExpiresAt,
    });

    // Send setup email
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const setupLink = `${clientUrl}/reset-password?token=${setupToken}`;

    await sendEmail({
      to: student.email,
      subject: "Welcome to Bootcamp LMS - Setup Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2>Welcome to Bootcamp LMS, ${student.firstName}!</h2>
          <p>Your student account has been successfully created.</p>
          <p>Please click the link below to set up your password and log in:</p>
          <p><a href="${setupLink}">${setupLink}</a></p>
          <p><i>This link will expire in 7 days.</i></p>
        </div>
      `,
    });

    const studentResponse = student.toObject();
    delete studentResponse.password;

    return res.status(201).json({
      success: true,
      message: "Student registered successfully. Setup email sent.",
      data: studentResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
