const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      unique: true,
      minlength: [3, "Team name must be at least 3 characters"],
      maxlength: [50, "Team name cannot exceed 50 characters"],
    },

    teamCode: {
      type: String,
      required: [true, "Team code is required"],
      trim: true,
      uppercase: true,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    maxMembers: {
      type: Number,
      default: 5,
      min: [1, "Minimum members should be 1"],
      max: [20, "Maximum members should be 20"],
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Team", teamSchema);