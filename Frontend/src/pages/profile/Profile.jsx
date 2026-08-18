import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  LogOut,
  Settings,
} from "lucide-react";

import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileInfo from "../../components/Profile/ProfileInfo";
import EditProfile from "./EditProfile";
import { useAuth } from "../../context/AuthContext";

const demoUser = {
  firstName: "Ayesha",
  lastName: "Siddiqui",
  email: "ayesha.siddiqui@smit.edu",
  phone: "03001234567",
  role: "STUDENT",
  gender: "Female",
  dateOfBirth: "2002-05-14",
  profileImage:
    "https://i.pravatar.cc/300?img=47",
};

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [showEditProfile, setShowEditProfile] =
    useState(false);

  // Demo data is used only when real user data is not available.
  const profileUser = user || demoUser;

  const role = (profileUser?.role || "STUDENT")
    .toUpperCase()
    .replace(/[\s_]+/g, "");

  const isStudent = role === "STUDENT";

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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#111528] sm:text-3xl">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information and account settings.
          </p>
        </div>

        {/* Profile Header */}
        <ProfileHeader
          user={profileUser}
          onEdit={() => setShowEditProfile(true)}
        />

        {/* Profile Information */}
        <div className="mt-6">
          <ProfileInfo
            user={profileUser}
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
                Manage your account security and session.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Change Password */}
            <button
              type="button"
              onClick={() =>
                navigate("/change-password")
              }
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
                  Update your account password
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
                  Sign out from your account
                </p>
              </div>
            </button>

          </div>
        </div>
      </div>

      {/* Edit Profile */}
      {showEditProfile && (
        <EditProfile
          user={profileUser}
          isStudent={isStudent}
          onClose={() =>
            setShowEditProfile(false)
          }
        />
      )}
    </div>
  );
}

export default Profile;