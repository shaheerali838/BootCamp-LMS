import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../common/Breadcrumb";
import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  LogOut,
  ChevronDown,
  Shield,
  UserCheck,
  GraduationCap,
  KeyRound,
} from "lucide-react";

function Navbar() {
  const { isOpen } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // ================= ROLE & PROFILE DISPLAY RESOLUTION (ADDED) =================
  const rawRole = user?.role || (user?.rollNumber ? "STUDENT" : "ADMIN");
  const role = String(rawRole).toLowerCase().replace(/[\s_]+/g, "");

  const isSuperAdmin = role === "superadmin";
  const isStudent = role === "student";
  const isAdmin = !isSuperAdmin && !isStudent;

  const roleLabel = isSuperAdmin
    ? "Super Admin"
    : isStudent
      ? "Student"
      : "Admin";

  const RoleIcon = isSuperAdmin ? Shield : isStudent ? GraduationCap : UserCheck;

  const fullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    (isSuperAdmin ? "Super Admin" : isAdmin ? "Admin" : "Student");

  const avatarImage = user?.profilePicture || user?.profileImage || "";
  // =============================================================================

  const handleLogout = async () => {
    try {
      setShowDropdown(false);
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div
      className={`
        h-16 flex items-center justify-between px-4 sm:px-6 border-b border-gray-200 bg-white
        fixed top-0 right-0 z-20 transition-all duration-300
        ${isOpen ? "left-70" : "left-22.5"}
      `}
    >
      {/* Left: Breadcrumbs navigation */}
      <Breadcrumb />

      {/* ================= RIGHT: USER PROFILE QUICK BADGE (ADDED) ================= */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition cursor-pointer"
        >
          {/* Avatar Picture or Initial */}
          <div className="relative shrink-0">
            {avatarImage ? (
              <img
                src={avatarImage}
                alt={fullName}
                className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-xs"
              />
            ) : (
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-xs ${
                  isSuperAdmin
                    ? "bg-purple-700"
                    : isStudent
                      ? "bg-emerald-600"
                      : "bg-blue-600"
                }`}
              >
                {user?.firstName ? user.firstName.charAt(0).toUpperCase() : <User size={16} />}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          {/* User Name & Role Pill (Hidden on very small screens) */}
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-gray-800 leading-tight max-w-[130px] truncate">
              {fullName}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-semibold mt-0.5 ${
                isSuperAdmin
                  ? "text-purple-700"
                  : isStudent
                    ? "text-emerald-700"
                    : "text-blue-700"
              }`}
            >
              <RoleIcon size={10} />
              {roleLabel} {user?.rollNumber ? `(${user.rollNumber})` : ""}
            </span>
          </div>

          <ChevronDown
            size={15}
            className={`text-gray-400 transition-transform hidden sm:block ${
              showDropdown ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Profile Quick Dropdown Menu */}
        {showDropdown && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-gray-200 shadow-xl py-2 z-50 animate-fade-in"
          >
            {/* Header info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-900 truncate">
                {fullName}
              </p>
              <p className="text-[11px] text-gray-500 truncate">
                {user?.email || "No email"}
              </p>
            </div>

            {/* Links */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => {
                  setShowDropdown(false);
                  navigate("/profile");
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50/60 hover:text-[#0476b9] transition cursor-pointer"
              >
                <User size={15} />
                My Profile & Settings
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowDropdown(false);
                  navigate("/change-password");
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50/60 hover:text-[#0476b9] transition cursor-pointer"
              >
                <KeyRound size={15} />
                Change Password
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
      {/* =========================================================================== */}
    </div>
  );
}

export default Navbar;