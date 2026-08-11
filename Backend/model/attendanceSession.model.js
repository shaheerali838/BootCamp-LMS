import mongoose from "mongoose";

const attendanceSessionSchema = new mongoose.Schema(
  {
    attendanceDate: {
      type: Date,
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true },
);

const AttendanceSession = mongoose.model(
  "AttendanceSession",
  attendanceSessionSchema,
);
export default Attendance;
