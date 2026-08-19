// =========================================================================
// Profile Page Component
// Displays personalized profile details dynamically for Super Admin, Admin, and Student
// =========================================================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  LogOut,
  Settings,
  Shield,
  UserCheck,
  GraduationCap,
} from "lucide-react";

// Correct path imports with cross-platform casing
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileInfo from "../../components/profile/ProfileInfo";
import EditProfile from "./EditProfile";
import { useAuth } from "../../context/AuthContext";

// Fallback demo user if not logged in (e.g. preview mode)
const demoStudent = {
  firstName: "Ayesha",
  lastName: "Siddiqui",
  email: "ayesha.siddiqui@smit.edu",
  phone: "03001234567",
  role: "STUDENT",
  rollNumber: "SMIT-2024-001",
  gender: "Female",
  dateOfBirth: "2002-05-14",
  profileImage: "",
};

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [showEditProfile, setShowEditProfile] = useState(false);

  // ================= ROLE RESOLUTION (SUPER ADMIN, ADMIN, STUDENT) =================
  const profileUser = user || demoStudent;

  const rawRole = profileUser?.role || (profileUser?.rollNumber ? "STUDENT" : "ADMIN");
  const role = String(rawRole).toLowerCase().replace(/[\s_]+/g, "");

  const isSuperAdmin = role === "superadmin";
  const isStudent = role === "student";
  const isAdmin = !isSuperAdmin && !isStudent;

  const roleLabel = isSuperAdmin
    ? "Super Admin"
    : isStudent
      ? "Student"
      : "Admin / Mentor";

  const RoleIcon = isSuperAdmin ? Shield : isStudent ? GraduationCap : UserCheck;
  // ===============================================================================

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#111528] sm:text-3xl">
                My Profile
              </h1>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  isSuperAdmin
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : isStudent
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "bg-blue-100 text-blue-700 border border-blue-200"
                }`}
              >
                <RoleIcon size={13} />
                {roleLabel}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Manage your personal information, profile photo, and account security.
            </p>
          </div>
        </div>

        {/* Profile Header (Cover, Avatar Upload, and Summary Badges) */}
        <ProfileHeader
          user={profileUser}
          roleType={isSuperAdmin ? "superadmin" : isStudent ? "student" : "admin"}
          onEdit={() => setShowEditProfile(true)}
        />

        {/* Profile Information (Role-specific attributes) */}
        <div className="mt-6">
          <ProfileInfo
            user={profileUser}
            isSuperAdmin={isSuperAdmin}
            isAdmin={isAdmin}
            isStudent={isStudent}
          />
        </div>

        {/* Account Settings */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0476b9]">
              <Settings size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#111528]">
                Account Settings
              </h2>
              <p className="text-sm text-gray-500">
                Manage your account security and authentication.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Change Password */}
            <button
              type="button"
              onClick={() => navigate("/change-password")}
              className="group flex cursor-pointer items-center gap-4 rounded-xl border border-gray-200 p-4 text-left transition hover:border-[#0476b9] hover:bg-blue-50/40"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0476b9] transition group-hover:bg-[#0476b9] group-hover:text-white">
                <LockKeyhole size={20} />
              </div>

              <div>
                <p className="font-semibold text-gray-800">
                  Change Password
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Update your login password securely
                </p>
              </div>
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="group flex cursor-pointer items-center gap-4 rounded-xl border border-gray-200 p-4 text-left transition hover:border-red-200 hover:bg-red-50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 transition group-hover:bg-red-500 group-hover:text-white">
                <LogOut size={20} />
              </div>

              <div>
                <p className="font-semibold text-gray-800">
                  Logout
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Sign out from your active session
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfile
          user={profileUser}
          isSuperAdmin={isSuperAdmin}
          isAdmin={isAdmin}
          isStudent={isStudent}
          onClose={() => setShowEditProfile(false)}
        />
      )}
    </div>
  );
}

export default Profile;