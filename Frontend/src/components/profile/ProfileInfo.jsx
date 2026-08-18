import React from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  VenusAndMars,
} from "lucide-react";

function ProfileInfo({ user, isStudent }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

      {/* Header */}
      <div className="mb-6">

        <h2 className="text-xl font-bold text-[#111528]">
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Your personal account information.
        </p>

      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        <InfoCard
          icon={<User size={18} />}
          label="First Name"
          value={user?.firstName}
        />

        <InfoCard
          icon={<User size={18} />}
          label="Last Name"
          value={user?.lastName}
        />

        <InfoCard
          icon={<Mail size={18} />}
          label="Email Address"
          value={user?.email}
        />

        <InfoCard
          icon={<Phone size={18} />}
          label="Phone Number"
          value={user?.phone}
        />

        {/* Student Only */}
        {isStudent && (
          <>
            <InfoCard
              icon={<VenusAndMars size={18} />}
              label="Gender"
              value={user?.gender}
            />

            <InfoCard
              icon={<Calendar size={18} />}
              label="Date of Birth"
              value={
                user?.dateOfBirth
                  ? new Date(
                      user.dateOfBirth
                    ).toLocaleDateString()
                  : ""
              }
            />
          </>
        )}

      </div>

    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 transition hover:border-blue-100 hover:bg-blue-50/30">

      <div className="mb-2 flex items-center gap-2 text-gray-500">
        {icon}

        <span className="text-sm">
          {label}
        </span>
      </div>

      <p className="break-words font-semibold text-gray-800">
        {value || "Not provided"}
      </p>

    </div>
  );
}

export default ProfileInfo;