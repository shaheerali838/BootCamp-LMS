import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        studentCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true,
        },

        dob: {
            type: Date,
            required: true,
        },

        batchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Batch",
            required: true,
        },

        mentorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Student", studentSchema);