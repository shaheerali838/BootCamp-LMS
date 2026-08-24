import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLoader } from "react-icons/fi";

/**
 * Normalizes user role to canonical uppercase format:
 * 'SUPERADMIN', 'ADMIN', 'MENTOR', 'STUDENT'
 */
export const getNormalizedRole = (user) => {
  if (!user) return "";
  const rawRole = user.role || (user.rollNumber || user.rollNo ? "STUDENT" : "ADMIN");
  const cleaned = String(rawRole).toUpperCase().replace(/[\s_]+/g, "");
  if (cleaned === "SUPERADMIN" || cleaned === "SUPER_ADMIN") return "SUPERADMIN";
  if (cleaned === "MENTOR") return "MENTOR";
  if (cleaned === "STUDENT") return "STUDENT";
  return "ADMIN";
};

/**
 * Gets the home dashboard landing URL for the given user
 */
export const getRoleDashboard = (user) => {
  const role = getNormalizedRole(user);
  if (role === "SUPERADMIN") return "/superadmin/dashboard";
  if (role === "STUDENT") return "/student/dashboard";
  return "/dashboard";
};

/**
 * ProtectedRoute:
 * - Verifies user is authenticated (redirects to /login if unauthenticated)
 * - Verifies user has one of the allowedRoles (redirects to their role dashboard if unauthorized)
 */
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FiLoader className="animate-spin text-[#0476b9]" size={32} />
      </div>
    );
  }

  const storedUser = (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();
  const storedToken = localStorage.getItem("accessToken");

  const currentUser = user || storedUser;
  const isAuth = isAuthenticated || (!!currentUser && !!storedToken);

  if (!isAuth || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0) {
    const userRole = getNormalizedRole(currentUser);
    const normalizedAllowed = allowedRoles.map((r) =>
      String(r).toUpperCase().replace(/[\s_]+/g, "")
    );

    const hasPermission =
      normalizedAllowed.includes(userRole) ||
      (userRole === "SUPERADMIN" && (normalizedAllowed.includes("ADMIN") || normalizedAllowed.includes("MENTOR")));

    if (!hasPermission) {
      return <Navigate to={getRoleDashboard(currentUser)} replace />;
    }
  }

  return children;
};

/**
 * PublicOnlyRoute:
 * - If user is already logged in, redirects them directly to their role dashboard
 */
export const PublicOnlyRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FiLoader className="animate-spin text-[#0476b9]" size={32} />
      </div>
    );
  }

  const storedUser = (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();
  const storedToken = localStorage.getItem("accessToken");

  const currentUser = user || storedUser;
  const isAuth = isAuthenticated || (!!currentUser && !!storedToken);

  if (isAuth && currentUser) {
    return <Navigate to={getRoleDashboard(currentUser)} replace />;
  }

  return children;
};

export default ProtectedRoute;