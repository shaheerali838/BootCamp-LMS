import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    evaluator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    attendance_percentage: {
      type: Number,
      required: true,
    },
    task_score: {
      type: Number,
      required: true,
    },
    project_score: {
      type: Number,
      required: true,
    },
    behavior_score: {
      type: Number,
      required: true,
    },
    overall_performance: {
      type: Number,
      required: true,
    },
    remarks: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

const Evaluation = mongoose.model("Evaluation", evaluationSchema);
export default Evaluation;
