import mongoose from "mongoose";

const sprintSchema = new mongoose.Schema(
  {
    milestoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Milestone",
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    sprintName: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  { timestamps: true },
);

const Sprint = mongoose.model("Sprint", sprintSchema);
export default Sprint;
