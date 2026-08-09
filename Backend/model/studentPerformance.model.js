import mongoose from "mongoose";

const studentPerformanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    attandance_percentage: {
      type: Number,
      required: true,
    },
    task_completion: {
      type: Number,
      required: true,
    },
    project_progress: {
      type: Number,
      required: true,
    },
    overall_performance: {
      type: Number,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const StudentPerformance = mongoose.model(
  "StudentPerformance",
  studentPerformanceSchema,
);
export default StudentPerformance;
