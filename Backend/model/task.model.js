import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    sprintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sprint",
    },

    assignedStudentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },

    assignedTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: String,
      default: "Medium",
      trim: true,
    },

    status: {
      type: String,
      default: "Pending",
      trim: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
