import React, { useRef, useState } from "react";
import {
  Camera,
  X,
  Save,
  User,
  LoaderCircle,
} from "lucide-react";

function EditProfile({
  user,
  isStudent,
  onClose,
}) {
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [profileImage, setProfileImage] = useState(
    user?.profileImage || user?.image || ""
  );

  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    dateOfBirth: user?.dateOfBirth
      ? user.dateOfBirth.split("T")[0]
      : "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setImageFile(file);

    const preview = URL.createObjectURL(file);

    setProfileImage(preview);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!formData.lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      /*
       * Frontend only for now.
       * The API can be connected here later.
       */

      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        profileImage: profileImage,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      /*
       * Small delay to show saving state.
       */
      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      setLoading(false);

      onClose();

      /*
       * Reload user information from localStorage.
       */
      window.location.reload();
    } catch (error) {
      console.error(error);

      setError("Unable to update profile.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-7">

          <div>
            <h2 className="text-xl font-bold text-[#111528]">
              Edit Profile
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Update your personal information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          >
            <X size={20} />
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-7"
        >

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Profile Image */}
          <div className="mb-7 flex flex-col items-center">

            <div className="relative">

              <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-gray-100 bg-gray-100 shadow-md">

                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User
                      size={48}
                      className="text-gray-400"
                    />
                  </div>
                )}

              </div>

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#0476b9] text-white shadow-md transition hover:bg-[#03669f]"
              >
                <Camera size={17} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

            </div>

            <p className="mt-3 text-xs text-gray-500">
              JPG, PNG or WEBP. Maximum 5MB.
            </p>

          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* First Name */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="e.g. Farman"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-[#0476b9] focus:ring-2 focus:ring-blue-50"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="e.g. Khan"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-[#0476b9] focus:ring-2 focus:ring-blue-50"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-gray-500 outline-none"
              />

              <p className="mt-1 text-xs text-gray-400">
                Email address cannot be changed.
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="03000000000"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-[#0476b9] focus:ring-2 focus:ring-blue-50"
              />
            </div>

            {/* Student Fields */}
            {isStudent && (
              <>
                {/* Gender */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-[#0476b9] focus:ring-2 focus:ring-blue-50"
                  >
                    <option value="">
                      Select Gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-[#0476b9] focus:ring-2 focus:ring-blue-50"
                  />
                </div>
              </>
            )}

          </div>

          {/* Buttons */}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              <X size={17} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0476b9] px-5 py-2.5 font-semibold text-white transition hover:bg-[#03669f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Changes
                </>
              )}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default EditProfile;