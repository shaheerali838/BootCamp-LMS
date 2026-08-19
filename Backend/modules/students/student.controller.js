import {
  createStudentService,
  getStudentsService,
  getStudentByIdService,
  getStudentsByBatchService,
  updateStudentService,
  updateStudentStatusService,
  deleteStudentService,
  findStudentByEmail,
  findStudentByRollNumber,
} from "./student.service.js";
import sendEmail from "../../utils/sendEmail.js";
import cloudinary, { uploadToCloudinary } from "../../config/cloudinary.js";

// CREATE STUDENT 
export const createStudent = async (req, res) => {
  try {
    const { email, rollNumber, password } = req.body;

    const existingStudent = await findStudentByEmail(email);
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const existingRollNumber = await findStudentByRollNumber(rollNumber);
    if (existingRollNumber) {
      return res.status(409).json({
        success: false,
        message: "Roll number already exists",
      });
    }

    const studentPayload = { ...req.body };

    // Upload profile photo to Cloudinary if provided
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, {
          folder: "saylani_lms/students",
          resource_type: "image",
          public_id: `student_${Date.now()}`,
        });
        studentPayload.profilePicture = uploadResult.secure_url || uploadResult.url;
      } catch (uploadErr) {
        console.error("Cloudinary student photo upload error:", uploadErr);
      }
    } else if (
      studentPayload.profilePicture &&
      typeof studentPayload.profilePicture === "string" &&
      studentPayload.profilePicture.startsWith("data:image/")
    ) {
      try {
        const uploadResult = await cloudinary.uploader.upload(studentPayload.profilePicture, {
          folder: "saylani_lms/students",
          resource_type: "image",
          public_id: `student_${Date.now()}`,
        });
        studentPayload.profilePicture = uploadResult.secure_url || uploadResult.url;
      } catch (uploadErr) {
        console.error("Cloudinary student photo base64 upload error:", uploadErr);
      }
    }

    // Step 3: Service call to save student
    const student = await createStudentService(studentPayload);

    // Send Welcome Email
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
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
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
    const search = req.query.search || "";

    const result = await getStudentsService({ page, limit, search });

    return res.status(200).json({
      success: true,
      data: result.students,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

// ---------- GET SINGLE STUDENT ----------
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await getStudentByIdService(id);

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

// ---------- GET STUDENTS BY BATCH ----------
export const getStudentsByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const students = await getStudentsByBatchService(batchId);

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

// ---------- UPDATE STUDENT ----------
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, rollNumber } = req.body;

    if (email) {
      const existingEmail = await findStudentByEmail(email, id);
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    if (rollNumber) {
      const existingRoll = await findStudentByRollNumber(rollNumber, id);
      if (existingRoll) {
        return res.status(409).json({
          success: false,
          message: "Roll number already exists",
        });
      }
    }

    const updatePayload = { ...req.body };

    // Upload profile photo to Cloudinary if provided
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, {
          folder: "saylani_lms/students",
          resource_type: "image",
          public_id: `student_${id}_${Date.now()}`,
        });
        updatePayload.profilePicture = uploadResult.secure_url || uploadResult.url;
      } catch (uploadErr) {
        console.error("Cloudinary student photo update error:", uploadErr);
      }
    } else if (
      updatePayload.profilePicture &&
      typeof updatePayload.profilePicture === "string" &&
      updatePayload.profilePicture.startsWith("data:image/")
    ) {
      try {
        const uploadResult = await cloudinary.uploader.upload(updatePayload.profilePicture, {
          folder: "saylani_lms/students",
          resource_type: "image",
          public_id: `student_${id}_${Date.now()}`,
        });
        updatePayload.profilePicture = uploadResult.secure_url || uploadResult.url;
      } catch (uploadErr) {
        console.error("Cloudinary student photo update base64 error:", uploadErr);
      }
    }

    const updatedStudent = await updateStudentService(id, updatePayload);

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    return res.status(500).json({
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

    const student = await updateStudentStatusService(id, status);

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

// ---------- DELETE STUDENT ----------
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await deleteStudentService(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

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
