import React from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  VenusAndMars,
  Hash,
  Shield,
  Layers,
  Award,
  Clock,
} from "lucide-react";

function ProfileInfo({ user, isSuperAdmin, isAdmin, isStudent }) {
  // Format Date of Birth or Registration Date
  const formatDate = (dateValue) => {
    if (!dateValue) return "Not provided";
    try {
      const d = new Date(dateValue);
      if (isNaN(d.getTime())) return dateValue;
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateValue;
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#111528]">
          Personal & Account Information
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {isSuperAdmin
            ? "Super Administrator account credentials and system privileges."
            : isAdmin
              ? "Administrator & Mentor credentials and department information."
              : "Student enrollment and academic details."}
        </p>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* First Name */}
        <InfoCard
          icon={<User size={18} className="text-[#0476b9]" />}
          label="First Name"
          value={user?.firstName}
        />

        {/* Last Name */}
        <InfoCard
          icon={<User size={18} className="text-[#0476b9]" />}
          label="Last Name"
          value={user?.lastName}
        />

        {/* Email Address */}
        <InfoCard
          icon={<Mail size={18} className="text-[#0476b9]" />}
          label="Email Address"
          value={user?.email}
        />

        {/* Phone Number */}
        <InfoCard
          icon={<Phone size={18} className="text-[#0476b9]" />}
          label="Phone Number"
          value={user?.phoneNumber || user?.phone}
        />

        {/* ================= STUDENT SPECIFIC FIELDS (ADDED) ================= */}
        {isStudent && (
          <>
            <InfoCard
              icon={<Hash size={18} className="text-emerald-600" />}
              label="Roll Number / ID"
              value={user?.rollNumber || "Not assigned"}
              highlight
            />

            <InfoCard
              icon={<VenusAndMars size={18} className="text-emerald-600" />}
              label="Gender"
              value={user?.gender}
            />

            <InfoCard
              icon={<Calendar size={18} className="text-emerald-600" />}
              label="Date of Birth"
              value={formatDate(user?.dateOfBirth)}
            />

            <InfoCard
              icon={<Layers size={18} className="text-emerald-600" />}
              label="Program / Bootcamp"
              value={user?.batchName || "Saylani Tech Bootcamp"}
            />
          </>
        )}
        {/* =================================================================== */}

        {/* ================= SUPER ADMIN SPECIFIC FIELDS (ADDED) ============= */}
        {isSuperAdmin && (
          <>
            <InfoCard
              icon={<Shield size={18} className="text-purple-600" />}
              label="Role & Access"
              value="Super Admin (Full System Control)"
              highlight
            />

            <InfoCard
              icon={<Award size={18} className="text-purple-600" />}
              label="Privileges"
              value="All Modules, User Management, Configurations"
            />

            <InfoCard
              icon={<Clock size={18} className="text-purple-600" />}
              label="Account Type"
              value="Executive Administrator"
            />
          </>
        )}
        {/* =================================================================== */}

        {/* ================= ADMIN SPECIFIC FIELDS (ADDED) =================== */}
        {isAdmin && !isSuperAdmin && (
          <>
            <InfoCard
              icon={<Shield size={18} className="text-blue-600" />}
              label="Role & Access"
              value="Admin / Mentor"
              highlight
            />

            <InfoCard
              icon={<Award size={18} className="text-blue-600" />}
              label="Department"
              value="Bootcamp Mentorship & Operations"
            />

            <InfoCard
              icon={<Layers size={18} className="text-blue-600" />}
              label="Management Scope"
              value="Projects, Tasks, Attendance, Sprints"
            />
          </>
        )}
        {/* =================================================================== */}
      </div>
    </div>
  );
}

// Subcomponent for each info card
function InfoCard({ icon, label, value, highlight = false }) {
  return (
    <div
      className={`rounded-xl border p-4 transition ${
        highlight
          ? "border-blue-200 bg-blue-50/40"
          : "border-gray-200 bg-gray-50/60 hover:border-blue-100 hover:bg-blue-50/20"
      }`}
    >
      <div className="mb-1.5 flex items-center gap-2 text-gray-500">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </span>
      </div>

      <p className="wrap-break-word font-semibold text-gray-900 text-sm">
        {value || "Not provided"}
      </p>
    </div>
  );
}

export default ProfileInfo;
