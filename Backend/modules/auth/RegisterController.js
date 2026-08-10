import bcrypt from "bcryptjs";
import User from "../Users/UserModel.js";
import Student from "../Student/StudentModel.js";

export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            phone,
            profileImage,
            studentCode,
            gender,
            dob,
            batchId,
            mentorId,
        } = req.body;

        // --- Basic validation ---
        if (!firstName || !lastName || !email || !password || !studentCode) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: firstName, lastName, email, password, studentCode",
            });
        }

        // Normalize email to lowercase
        const normalizedEmail = email.toLowerCase();

        // Check if email already exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        // Check if student code already exists
        const existingStudent = await Student.findOne({ studentCode });
        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: "Student Code already exists",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await User.create({
            firstName,
            lastName,
            email: normalizedEmail,
            password: hashedPassword,
            phone,
            profileImage,
            role: "student",
            status: "Active",
        });

        // Create Student profile
        const student = await Student.create({
            user: user._id,
            studentCode,
            gender,
            dob,
            batchId,
            mentorId,
            status: "Active",
        });

        return res.status(201).json({
            success: true,
            message: "Student Registered Successfully",
            data: {
                user,
                student,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};