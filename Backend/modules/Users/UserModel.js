import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["admin", "student"],
            default: "student",
        },

        phone: {
            type: String,
        },

        profileImage: {
            type: String,
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },

        // Phase 2
        refreshTokenHash: {
            type: String,
            default: null,
        },

        refreshTokenExpiresAt: {
            type: Date,
            default: null,
        },

        tokenVersion: {
            type: Number,
            default: 0,
        },

        resetPasswordTokenHash: {
            type: String,
            default: null,
        },

        resetPasswordExpiresAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);