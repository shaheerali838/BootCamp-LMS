import Student from "../../model/student.model.js";
import Admin from "../../model/admin.model.js";
import Batch from "../../model/batch.model.js";
import bcrypt from "bcryptjs";

// Check if email already exists
export const findStudentByEmail = async (email, excludeId = null) => {
  const query = { email: email.toLowerCase() };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  return await Student.findOne(query);
};

// Check if roll number already exists
export const findStudentByRollNumber = async (rollNumber, excludeId = null) => {
  const query = { rollNumber: rollNumber.trim() };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  return await Student.findOne(query);
};

// Create a new student
export const createStudentService = async (studentData) => {
  // Validate mentor existence and status
  if (studentData.mentorId) {
    const mentor = await Admin.findById(studentData.mentorId);
    if (!mentor) {
      const error = new Error("Assigned mentor does not exist.");
      error.statusCode = 404;
      throw error;
    }
    if (mentor.status !== "active") {
      const error = new Error("Assigned mentor is inactive.");
      error.statusCode = 400;
      throw error;
    }
  }

  // Validate batch existence
  if (studentData.batchId) {
    const batch = await Batch.findById(studentData.batchId);
    if (!batch) {
      const error = new Error("Selected batch does not exist.");
      error.statusCode = 404;
      throw error;
    }
  }

  const hashedPassword = await bcrypt.hash(studentData.password, 10);

  const student = await Student.create({
    ...studentData,
    rollNumber: studentData.rollNumber.trim(),
    firstName: studentData.firstName.trim(),
    lastName: studentData.lastName.trim(),
    email: studentData.email.toLowerCase().trim(),
    phoneNumber: studentData.phoneNumber.trim(),
    password: hashedPassword,
  });

  const studentObj = student.toObject();
  delete studentObj.password;
  return studentObj;
};

// Get all students with pagination, search, and populate
export const getStudentsService = async ({ page = 1, limit = 500, search = "" }) => {
  const skip = (page - 1) * limit;
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

  return {
    students,
    pagination: {
      totalItems: totalStudents,
      currentPage: page,
      totalPages: Math.ceil(totalStudents / limit),
      pageSize: limit,
    },
  };
};

// Get single student by ID
export const getStudentByIdService = async (id) => {
  return await Student.findById(id)
    .select("-password")
    .populate("batchId", "batchName program startDate endDate status")
    .populate("mentorId", "firstName lastName email");
};

// Get students by batch ID
export const getStudentsByBatchService = async (batchId) => {
  return await Student.find({ batchId })
    .select("-password")
    .populate("batchId", "batchName program startDate endDate status")
    .populate("mentorId", "firstName lastName email");
};

// Update student details
export const updateStudentService = async (id, updateData) => {
  const student = await Student.findById(id);
  if (!student) return null;

  if (updateData.rollNumber) student.rollNumber = updateData.rollNumber.trim();
  if (updateData.firstName) student.firstName = updateData.firstName.trim();
  if (updateData.lastName) student.lastName = updateData.lastName.trim();
  if (updateData.email) student.email = updateData.email.toLowerCase().trim();
  if (updateData.phoneNumber) student.phoneNumber = updateData.phoneNumber.trim();
  if (updateData.gender) student.gender = updateData.gender;
  if (updateData.dateOfBirth) student.dateOfBirth = updateData.dateOfBirth;
  if (updateData.batchId) {
    const batch = await Batch.findById(updateData.batchId);
    if (!batch) {
      const error = new Error("Selected batch does not exist.");
      error.statusCode = 404;
      throw error;
    }
    student.batchId = updateData.batchId;
  }
  if (updateData.mentorId) {
    const mentor = await Admin.findById(updateData.mentorId);
    if (!mentor) {
      const error = new Error("Assigned mentor does not exist.");
      error.statusCode = 404;
      throw error;
    }
    if (mentor.status !== "active") {
      const error = new Error("Assigned mentor is inactive.");
      error.statusCode = 400;
      throw error;
    }
    student.mentorId = updateData.mentorId;
  }

  if (updateData.password) {
    student.password = await bcrypt.hash(updateData.password, 10);
  }

  await student.save();

  const studentObj = student.toObject();
  delete studentObj.password;
  return studentObj;
};

// Update student status
export const updateStudentStatusService = async (id, status) => {
  return await Student.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).select("-password");
};

// Delete student
export const deleteStudentService = async (id) => {
  return await Student.findByIdAndDelete(id);
};
