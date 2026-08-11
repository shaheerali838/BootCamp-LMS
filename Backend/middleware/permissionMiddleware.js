import ROLE_PERMISSIONS from "../constants/rolePermissions.js";

export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const userRole = req.user.role
      ? req.user.role.toUpperCase()
      : "";

    const userPermissions = ROLE_PERMISSIONS[userRole];

    if (!userPermissions) {
      return res.status(403).json({
        success: false,
        message: "Role permissions not configured.",
      });
    }

    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }

    next();
  };
};