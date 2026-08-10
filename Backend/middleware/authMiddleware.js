import jwt from "jsonwebtoken";
import User from "../modules/Users/UserModel.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token required",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists",
            });
        }

        if (user.status !== "Active") {
            return res.status(403).json({
                success: false,
                message: "User account is inactive",
            });
        }

        if (user.tokenVersion !== decoded.tokenVersion) {
            return res.status(401).json({
                success: false,
                message: "Token has been invalidated",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token",
        });
    }
};