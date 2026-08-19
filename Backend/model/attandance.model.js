import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      index: true,
    },
    date: {
      type: String, // "YYYY-MM-DD" formatted string for reliable day-level indexing & aggregation
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late", "Leave", "present", "absent", "late", "leave"],
      default: "Present",
      required: true,
    },
    checkInTime: {
      type: String,
      default: "--:--",
    },
    checkOutTime: {
      type: String,
      default: "--:--",
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Ensure only 1 attendance record per student per calendar date
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
