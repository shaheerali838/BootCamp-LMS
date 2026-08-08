import jwt from "jsonwebtoken";
import User from "../modules/Users/UserModel.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check Authorization Header
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Token not provided.",
            });
        }

        // Extract Token
        const token = authHeader.split(" ")[1];

        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find User
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Attach User
        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or Expired Token.",
        });
    }
};