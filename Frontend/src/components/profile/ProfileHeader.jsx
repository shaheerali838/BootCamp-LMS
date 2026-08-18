import React, { useState } from "react";
import {
  Camera,
  Edit3,
  User,
} from "lucide-react";

function ProfileHeader({ user, onEdit }) {
  const [image, setImage] = useState(
    user?.profileImage || user?.image || ""
  );

  const role = (user?.role || "STUDENT")
    .toUpperCase()
    .replace(/[\s_]+/g, "");

  const fullName =
    `${user?.firstName || ""} ${
      user?.lastName || ""
    }`.trim() || "User";

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setImage(imageUrl);

    /*
     * Frontend preview only.
     * Backend upload can be connected later.
     */
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* Cover */}
      <div className="h-32 bg-gradient-to-r from-[#0476b9] via-[#056fa8] to-[#034d78] sm:h-40" />

      {/* Profile Content */}
      <div className="relative px-5 pb-6 sm:px-8">

        <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">

          {/* Left Side */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">

            {/* Profile Image */}
            <div className="relative">

              <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg sm:h-32 sm:w-32">

                {image ? (
                  <img
                    src={image}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User
                      size={52}
                      className="text-gray-400"
                    />
                  </div>
                )}

              </div>

              {/* Camera */}
              <label className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#0476b9] text-white shadow-md transition hover:bg-[#03669f]">

                <Camera size={17} />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

              </label>

            </div>

            {/* User Details */}
            <div className="pb-1 text-center sm:text-left">

              <h2 className="text-2xl font-bold text-[#111528]">
                {fullName}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {user?.email || "No email available"}
              </p>

              <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0476b9]">
                  {role}
                </span>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                  Active
                </span>

              </div>

            </div>

          </div>

          {/* Edit Button */}
          <button
            type="button"
            onClick={onEdit}
            className="mx-auto flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0476b9] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#03669f] sm:mx-0"
          >
            <Edit3 size={16} />
            Edit Profile
          </button>

        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;