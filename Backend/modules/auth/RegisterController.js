import bcrypt from "bcryptjs";
import User from "../Users/UserModel.js";
import Student from "../Student/Student.Model.js";

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

        // Check Email
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        // Check Student Code
        const existingStudent = await Student.findOne({ studentCode });

        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: "Student Code already exists",
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            profileImage,
            role: "student",
            status: "Active",
        });

        // Create Student
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