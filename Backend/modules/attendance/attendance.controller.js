import Attendance from "../../model/attandance.model.js";
import Student from "../../model/student.model.js";
import Batch from "../../model/batch.model.js";
import mongoose from "mongoose";

// Normalize status string e.g. "present" -> "Present"
const normalizeStatus = (status) => {
  if (!status) return "Present";
  const s = String(status).trim().toLowerCase();
  if (s === "present") return "Present";
  if (s === "absent") return "Absent";
  if (s === "late") return "Late";
  if (s === "leave" || s === "excused") return "Leave";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// ---------- GET ALL ATTENDANCE RECORDS (ADMIN / MENTOR) ----------
export const getAllAttendance = async (req, res) => {
  try {
    const { batchId, date, startDate, endDate, studentId, status } = req.query;
    const query = {};

    if (batchId && mongoose.Types.ObjectId.isValid(batchId)) {
      query.batchId = batchId;
    }

    if (studentId && mongoose.Types.ObjectId.isValid(studentId)) {
      query.studentId = studentId;
    }

    if (status) {
      query.status = new RegExp(`^${status.trim()}$`, "i");
    }

    if (date) {
      query.date = date.trim();
    } else if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate.trim();
      if (endDate) query.date.$lte = endDate.trim();
    }

    const records = await Attendance.find(query)
      .populate("studentId", "firstName lastName rollNumber email profilePicture gender")
      .populate("batchId", "batchName program")
      .populate("markedBy", "firstName lastName email")
      .sort({ date: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error("Get All Attendance Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance records",
      error: error.message,
    });
  }
};

// ---------- GET MY ATTENDANCE (LOGGED-IN STUDENT) ----------
export const getMyAttendance = async (req, res) => {
  try {
    const studentId = req.user._id;

    const records = await Attendance.find({ studentId })
      .populate("batchId", "batchName program")
      .populate("markedBy", "firstName lastName email")
      .sort({ date: -1 });

    const totalDays = records.length;
    const presentDays = records.filter((r) => r.status === "Present").length;
    const lateDays = records.filter((r) => r.status === "Late").length;
    const leaveDays = records.filter((r) => r.status === "Leave").length;
    const absentDays = records.filter((r) => r.status === "Absent").length;

    const attendancePercentage =
      totalDays > 0
        ? Math.round(((presentDays + lateDays) / totalDays) * 100)
        : 100;

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalDays,
          presentDays,
          lateDays,
          leaveDays,
          absentDays,
          attendancePercentage,
        },
        records,
      },
    });
  } catch (error) {
    console.error("Get My Attendance Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch your attendance records",
      error: error.message,
    });
  }
};

// ---------- GET SPECIFIC STUDENT ATTENDANCE BY ID ----------
export const getStudentAttendanceById = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: "Invalid student ID." });
    }

    const student = await Student.findById(studentId).select("firstName lastName rollNumber email profilePicture");
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    const records = await Attendance.find({ studentId })
      .populate("batchId", "batchName program")
      .populate("markedBy", "firstName lastName email")
      .sort({ date: -1 });

    const totalDays = records.length;
    const presentDays = records.filter((r) => r.status === "Present").length;
    const lateDays = records.filter((r) => r.status === "Late").length;
    const leaveDays = records.filter((r) => r.status === "Leave").length;
    const absentDays = records.filter((r) => r.status === "Absent").length;

    const attendancePercentage =
      totalDays > 0
        ? Math.round(((presentDays + lateDays) / totalDays) * 100)
        : 100;

    return res.status(200).json({
      success: true,
      student,
      stats: {
        totalDays,
        presentDays,
        lateDays,
        leaveDays,
        absentDays,
        attendancePercentage,
      },
      data: records,
    });
  } catch (error) {
    console.error("Get Student Attendance Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student attendance",
      error: error.message,
    });
  }
};

// ---------- MARK / UPDATE ATTENDANCE (BULK OR SINGLE) ----------
export const markAttendance = async (req, res) => {
  try {
    const recordsToProcess = Array.isArray(req.body.records)
      ? req.body.records
      : Array.isArray(req.body)
      ? req.body
      : [req.body];

    if (!recordsToProcess || recordsToProcess.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No attendance data provided.",
      });
    }

    const defaultDate = new Date().toISOString().split("T")[0];
    const updatedRecords = [];

    for (const item of recordsToProcess) {
      const studentId = item.studentId || item.student || item.id;
      if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
        continue;
      }

      const dateStr = item.date || defaultDate;
      const status = normalizeStatus(item.status);
      const checkInTime = item.checkInTime || (status === "Present" || status === "Late" ? "09:00 AM" : "--:--");
      const checkOutTime = item.checkOutTime || "--:--";
      const remarks = item.remarks || "";

      let batchId = item.batchId || item.batch;
      if (!batchId) {
        const studentObj = await Student.findById(studentId).select("batchId");
        if (studentObj && studentObj.batchId) {
          batchId = studentObj.batchId;
        }
      }

      const updated = await Attendance.findOneAndUpdate(
        { studentId, date: dateStr },
        {
          studentId,
          batchId: batchId || undefined,
          date: dateStr,
          status,
          checkInTime,
          checkOutTime,
          markedBy: req.user?._id || undefined,
          remarks,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      updatedRecords.push(updated);
    }

    return res.status(200).json({
      success: true,
      message: `Successfully marked attendance for ${updatedRecords.length} student(s).`,
      count: updatedRecords.length,
      data: updatedRecords,
    });
  } catch (error) {
    console.error("Mark Attendance Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark attendance",
      error: error.message,
    });
  }
};

// ---------- ATTENDANCE OVERVIEW ANALYTICS ----------
export const getAttendanceOverviewStats = async (req, res) => {
  try {
    const { batchId } = req.query;
    const matchQuery = {};
    if (batchId && mongoose.Types.ObjectId.isValid(batchId)) {
      matchQuery.batchId = new mongoose.Types.ObjectId(batchId);
    }

    const totalRecords = await Attendance.countDocuments(matchQuery);
    const presentCount = await Attendance.countDocuments({ ...matchQuery, status: "Present" });
    const lateCount = await Attendance.countDocuments({ ...matchQuery, status: "Late" });
    const leaveCount = await Attendance.countDocuments({ ...matchQuery, status: "Leave" });
    const absentCount = await Attendance.countDocuments({ ...matchQuery, status: "Absent" });

    const totalStudents = await Student.countDocuments(batchId ? { batchId } : {});

    const overallRate =
      totalRecords > 0
        ? Math.round(((presentCount + lateCount) / totalRecords) * 100)
        : 100;

    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalRecords,
        presentCount,
        lateCount,
        leaveCount,
        absentCount,
        overallRate,
      },
    });
  } catch (error) {
    console.error("Get Attendance Overview Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate attendance overview stats",
      error: error.message,
    });
  }
};

// ---------- DELETE ATTENDANCE RECORD ----------
export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid attendance ID." });
    }

    const deleted = await Attendance.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Attendance record not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance record deleted successfully",
    });
  } catch (error) {
    console.error("Delete Attendance Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete attendance record",
      error: error.message,
    });
  }
};
