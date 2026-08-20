import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Edit3,
  User,
  Shield,
  UserCheck,
  GraduationCap,
  CheckCircle2,
  Loader2,
  KeyRound,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function ProfileHeader({ user, roleType, onEdit }) {
  const navigate = useNavigate();
  const { updateProfileImage } = useAuth();

  // Active profile image (from user prop or state)
  const [image, setImage] = useState(
    user?.profilePicture || user?.profileImage || user?.image || "",
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Synchronize when parent user prop updates
  useEffect(() => {
    setImage(user?.profilePicture || user?.profileImage || user?.image || "");
  }, [user?.profilePicture, user?.profileImage, user?.image]);

  // Determine role metadata
  const rawRole = user?.role || (user?.rollNumber ? "STUDENT" : "ADMIN");
  const role = String(rawRole)
    .toLowerCase()
    .replace(/[\s_]+/g, "");

  const isSuperAdmin = role === "superadmin" || roleType === "superadmin";
  const isStudent = role === "student" || roleType === "student";
  const isAdmin = !isSuperAdmin && !isStudent;

  const fullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    (isSuperAdmin ? "Super Admin" : isAdmin ? "Admin / Mentor" : "Student");

  // ================= PICTURE UPLOAD HANDLER (CLOUDINARY) =================
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10MB.");
      return;
    }

    try {
      setIsUploading(true);
      // Instant preview
      const previewUrl = URL.createObjectURL(file);
      setImage(previewUrl);

      // Upload file directly to backend & Cloudinary
      if (updateProfileImage) {
        await updateProfileImage(file);
      }

      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3500);
    } catch (err) {
      console.error("Error uploading profile image:", err);
      alert(
        err?.response?.data?.message ||
          "Failed to upload profile image to Cloudinary.",
      );
      setIsUploading(false);
      setImage(user?.profilePicture || user?.profileImage || "");
    }
  };
  // ============================================================================

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Cover Gradient */}
      <div className="h-32 bg-linear-to-r from-[#0476b9] via-[#056fa8] to-[#034d78] sm:h-40 relative">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
      </div>

      {/* Profile Content */}
      <div className="relative px-5 pb-6 sm:px-8">
        <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
          {/* Left Side: Avatar & Details */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
            {/* Profile Image & Camera Action */}
            <div className="relative group">
              <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg sm:h-32 sm:w-32 relative">
                {image ? (
                  <img
                    src={image}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                    <User size={52} />
                  </div>
                )}

                {/* Upload Spinner Overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                    <Loader2 size={24} className="animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* User Details & Badges */}
            <div className="pb-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-[#111528] flex items-center justify-center sm:justify-start gap-2">
                {fullName}
                {uploadSuccess && (
                  <span className="text-xs text-green-600 flex items-center gap-1 font-normal animate-fade-in">
                    <CheckCircle2 size={14} /> Photo updated!
                  </span>
                )}
              </h2>

              <p className="mt-0.5 text-sm text-gray-500 font-medium">
                {user?.email || "No email available"}
              </p>

              {/* Dynamic Role & Status Badges */}
              <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                {isSuperAdmin && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-semibold text-purple-700">
                    <Shield size={13} />
                    Super Admin
                  </span>
                )}

                {isAdmin && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-[#0476b9]">
                    <UserCheck size={13} />
                    Admin / Mentor
                  </span>
                )}

                {isStudent && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <GraduationCap size={13} />
                    Student {user?.rollNumber ? `• ${user.rollNumber}` : ""}
                  </span>
                )}

                <span className="rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-semibold text-green-700">
                  ● Active Account
                </span>
              </div>
            </div>
          </div>

          {/* Header Action Buttons (Edit Profile & Change Password) */}
          <div className="mx-auto flex flex-wrap items-center justify-center gap-2 sm:mx-0">
            <button
              type="button"
              onClick={() => navigate("/change-password")}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-xs transition hover:border-[#0476b9] hover:text-[#0476b9] hover:bg-blue-50/50"
            >
              <KeyRound size={16} />
              Change Password
            </button>

            <button
              type="button"
              onClick={onEdit}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0476b9] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#03669f] hover:shadow"
            >
              <Edit3 size={16} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
