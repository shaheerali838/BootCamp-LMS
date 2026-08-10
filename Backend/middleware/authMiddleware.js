import jwt from "jsonwebtoken";
import Admin from "../model/admin.model.js";

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

    // Find Admin
    const Admin = await Admin.findById(decoded.id).select("-password");

    if (!Admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    // Attach Admin
    req.Admin = Admin;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token.",
    });
  }
};
