import React, { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiUsers,
  FiCalendar,
  FiCamera,
  FiUser,
  FiAward,
  FiCheckCircle,
  FiLoader,
} from "react-icons/fi";

import { useStudent } from "../../../context/AcademicContext";

function StudentDetails() {
  const { id } = useParams();
  const { students, updateStudent } = useStudent();
  const fileInputRef = useRef(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const student = students.find(
    (item) => String(item._id || item.id) === String(id)
  );

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10MB.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadMessage("Uploading to Cloudinary...");

      const formData = new FormData();
      formData.append("profilePicture", file);

      await updateStudent(student._id || student.id, formData);
      setUploadMessage("Photo updated!");
      setTimeout(() => setUploadMessage(""), 3000);
    } catch (err) {
      console.error("Failed to upload student photo:", err);
      alert(err?.response?.data?.message || "Failed to update student photo.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!student) {
    return (
      <div className="p-5">
        <h1 className="text-xl font-semibold text-gray-800">
          Student not found
        </h1>

        <Link
          to="/students"
          className="inline-flex items-center gap-2 mt-4 text-blue-600 font-medium"
        >
          <FiArrowLeft />
          Back to Students
        </Link>
      </div>
    );
  }

  const studentName =
    student.name ||
    `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
    "Student";

  const studentPhoto =
    student.profilePicture || student.profileImage || student.image || "";

  const batchName =
    typeof student.batchId === "object"
      ? student.batchId?.batchName
      : student.batchName || student.batch || "Enrolled Batch";

  const mentorName =
    typeof student.mentorId === "object"
      ? `${student.mentorId?.firstName || ""} ${student.mentorId?.lastName || ""}`.trim()
      : student.mentorName || student.mentor || "Assigned Mentor";

  const initials =
    student.initials ||
    studentName
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    "ST";

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/students"
          className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition shadow-xs"
        >
          <FiArrowLeft size={18} />
        </Link>

        <div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">Home</span>
            <span className="text-gray-300">›</span>
            <Link to="/students" className="text-gray-500 hover:text-blue-600 font-medium">
              Students
            </Link>
            <span className="text-gray-300">›</span>
            <span className="font-bold text-gray-800">{studentName}</span>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar with Cloudinary Upload Trigger */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-blue-50 border-2 border-blue-100 overflow-hidden flex items-center justify-center text-2xl font-bold text-blue-600 shadow-sm relative">
              {studentPhoto ? (
                <img
                  src={studentPhoto}
                  alt={studentName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}

              {isUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                  <FiLoader size={24} className="animate-spin" />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Change student photo (Cloudinary)"
              className="absolute -bottom-1 -right-1 p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition cursor-pointer"
            >
              <FiCamera size={14} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {studentName}
              </h1>

              <span
                className={`px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${
                  student.status === "active" || student.status === "Active"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {student.status || "Active"}
              </span>

              {uploadMessage && (
                <span className="text-xs text-green-600 flex items-center gap-1 font-medium">
                  <FiCheckCircle size={14} /> {uploadMessage}
                </span>
              )}
            </div>

            <p className="text-xs font-mono text-gray-500 mt-1">
              Roll No: {student.rollNumber || student.rollNo || "N/A"}
            </p>

            <div className="flex flex-wrap gap-5 mt-4 text-xs text-gray-600">
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <FiMail className="text-blue-600" />
                <span>{student.email || "No email"}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <FiPhone className="text-blue-600" />
                <span>{student.phoneNumber || student.phone || "No phone"}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <FiAward className="text-blue-600" />
                <span>Batch: {batchName}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <FiUsers className="text-blue-600" />
                <span>Mentor: {mentorName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-semibold text-gray-500 uppercase">
            Attendance Rate
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {student.attendance || "100"}%
          </h2>
          <p className="text-[11px] text-green-600 mt-1">● Regular Status</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-semibold text-gray-500 uppercase">
            Enrolled Batch
          </p>
          <h2 className="text-xl font-bold text-gray-900 mt-2 truncate">
            {batchName}
          </h2>
          <p className="text-[11px] text-blue-600 mt-1">Active Bootcamp</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-semibold text-gray-500 uppercase">
            Assigned Mentor
          </p>
          <h2 className="text-xl font-bold text-gray-900 mt-2 truncate">
            {mentorName}
          </h2>
          <p className="text-[11px] text-purple-600 mt-1">Lead Instructor</p>
        </div>
      </div>

      {/* Overview Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
          <h2 className="text-sm font-bold text-gray-900 mb-2">
            Student Academic Profile
          </h2>
          <div className="space-y-2 text-xs text-gray-600 mt-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-400">Gender:</span>
              <span className="font-semibold capitalize">{student.gender || "Not specified"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-400">Date of Birth:</span>
              <span className="font-semibold">
                {student.dateOfBirth
                  ? new Date(student.dateOfBirth).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-400">Enrolled Since:</span>
              <span className="font-semibold">
                {student.createdAt
                  ? new Date(student.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "Recent"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
          <h2 className="text-sm font-bold text-gray-900 mb-2">
            Bootcamp Progress & Tasks
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            Student evaluation milestones, assigned sprint submissions, and attendance logs are automatically tracked in the system.
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentDetails;