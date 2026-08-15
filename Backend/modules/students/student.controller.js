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

// 1. Create a new Student
export const createStudent = async (req, res) => {
  try {
    const { email, rollNumber } = req.body;

    const existingEmail = await findStudentByEmail(email);
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const existingRoll = await findStudentByRollNumber(rollNumber);
    if (existingRoll) {
      return res.status(409).json({
        success: false,
        message: "Roll number already exists",
      });
    }

    const student = await createStudentService(req.body);

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

// 2. Get All Students (Pagination & Search)
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

// 3. Get Single Student by ID
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

// 4. Get All Students in a Specific Batch
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

// 5. Update Student details
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

    const updatedStudent = await updateStudentService(id, req.body);

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

// 6. Update Student Status (Active / Inactive)
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

// 7. Delete Student
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
