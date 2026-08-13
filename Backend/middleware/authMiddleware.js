import jwt from "jsonwebtoken";
import Admin from "../model/admin.model.js";
import Student from "../model/student.model.js";
import ROLES from "../constants/roles.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token not provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userRole = decoded.role ? decoded.role.toUpperCase() : "";

    let user;

    if (userRole === ROLES.ADMIN || userRole === ROLES.SUPER_ADMIN) {
      user = await Admin.findById(decoded.userId).select("+password");
    } else if (userRole === ROLES.STUDENT) {
      user = await Student.findById(decoded.userId).select("+password");
    } else {
      return res.status(403).json({
        success: false,
        message: "Invalid user role.",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({
        success: false,
        message: "Token is no longer valid.",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "User account is inactive.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
