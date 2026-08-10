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

    let user;

    if (decoded.role === ROLES.ADMIN || decoded.role === ROLES.SUPER_ADMIN) {
      user = await Admin.findById(decoded.id).select("-password");
    } else if (decoded.role === ROLES.STUDENT) {
      user = await Student.findById(decoded.id).select("-password");
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
