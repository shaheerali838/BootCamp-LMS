import Student from "../../model/student.model.js";
import Admin from "../../model/admin.model.js";
import Batch from "../../model/batch.model.js";
import bcrypt from "bcryptjs";

// Check if email already exists
export const findStudentByEmail = async (email, excludeId = null) => {
  const query = { email: email.toLowerCase() };
  if (excludeId) {
    query._id = { $ne: excludeId }; // $ne = Not Equal (Update ke waqt apna ID chhor kar doosron mein dhoondo)
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
  let mentorId = studentData.mentorId;
  if (mentorId) {
    const mentor = await Admin.findById(mentorId);
    if (!mentor) {
      // If specified mentor ID is not found, fallback to any active admin
      const fallbackMentor = await Admin.findOne({ status: "active" });
      if (fallbackMentor) {
        mentorId = fallbackMentor._id;
      } else {
        const error = new Error("Assigned mentor does not exist.");
        error.statusCode = 404;
        throw error;
      }
    }
  } else {
    // If no mentor provided, assign to first active admin
    const defaultMentor = await Admin.findOne({ status: "active" });
    if (defaultMentor) {
      mentorId = defaultMentor._id;
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

  const rawPassword =
    studentData.password && String(studentData.password).trim()
      ? String(studentData.password).trim()
      : "Student@123";
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const student = await Student.create({
    ...studentData,
    mentorId: mentorId || studentData.mentorId,
    rollNumber: String(studentData.rollNumber || "").trim(),
    firstName: String(studentData.firstName || "").trim(),
    lastName: String(studentData.lastName || "").trim(),
    email: String(studentData.email || "").toLowerCase().trim(),
    phoneNumber: String(studentData.phoneNumber || studentData.phone || "").trim(),
    gender: String(studentData.gender || "male").toLowerCase(),
    dateOfBirth: studentData.dateOfBirth || "2002-01-01",
    status: studentData.status || "active",
    password: hashedPassword,
  });

  const studentObj = student.toObject();
  delete studentObj.password;
  return studentObj;
};

// Get all students with pagination, search, and populate
export const getStudentsService = async ({
  page = 1,
  limit = 1000,
  search = "",
}) => {
  // pagination skip formula
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
  if (updateData.phoneNumber)
    student.phoneNumber = updateData.phoneNumber.trim();
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

  if (updateData.profilePicture !== undefined) {
    student.profilePicture = updateData.profilePicture;
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
    { returnDocument: "after", runValidators: true },
  ).select("-password");
};

// Delete student
export const deleteStudentService = async (id) => {
  return await Student.findByIdAndDelete(id);
};
