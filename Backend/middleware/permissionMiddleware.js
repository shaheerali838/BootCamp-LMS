import ROLE_PERMISSIONS from "../constants/rolePermissions.js";

export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const rawRole = (req.user.role || "").toUpperCase().replace(/[\s_]+/g, "");
    let userRole = req.user.role ? req.user.role.toUpperCase() : "";
    if (rawRole === "SUPERADMIN" || rawRole === "SUPERADMIN") userRole = "SUPER_ADMIN";
    else if (rawRole === "ADMIN") userRole = "ADMIN";
    else if (rawRole === "STUDENT") userRole = "STUDENT";

    const userPermissions = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS[req.user.role?.toUpperCase()];

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