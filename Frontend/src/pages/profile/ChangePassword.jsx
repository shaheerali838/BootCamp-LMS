import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import { FiLoader } from "react-icons/fi";

function ChangePassword() {
  const { changePassword } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await changePassword(
        currentPassword,
        newPassword
      );

      setMessage(
        response?.data?.message ||
          "Password changed successfully! Your account credentials have been updated."
      );
      setIsSuccess(true);

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to change password. Please verify your current password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#0476b9] font-medium transition cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back to Profile
          </button>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="p-6 sm:p-7 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0476b9] flex items-center justify-center font-bold">
                <KeyRound size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Change Password
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Update your login password to keep your account secure.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 p-3.5 rounded-xl mb-5 text-sm">
                <AlertCircle size={17} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 p-3.5 rounded-xl mb-5 text-sm">
                <CheckCircle2 size={17} className="shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {isSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#0476b9] text-xs sm:text-sm font-semibold">
                  <ShieldCheck size={18} />
                  <span>Password updated successfully!</span>
                </div>
                <Link
                  to="/profile"
                  className="bg-[#0476b9] hover:bg-[#03669f] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition"
                >
                  View Profile
                </Link>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Current Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter your current password"
                    disabled={loading}
                    className="border border-gray-300 w-full p-2.5 pr-11 rounded-lg outline-none focus:border-[#0476b9] focus:ring-1 focus:ring-[#0476b9] transition text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0476b9]"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  New Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password (min 6 characters)"
                    disabled={loading}
                    className="border border-gray-300 w-full p-2.5 pr-11 rounded-lg outline-none focus:border-[#0476b9] focus:ring-1 focus:ring-[#0476b9] transition text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0476b9]"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your new password"
                    disabled={loading}
                    className="border border-gray-300 w-full p-2.5 pr-11 rounded-lg outline-none focus:border-[#0476b9] focus:ring-1 focus:ring-[#0476b9] transition text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0476b9]"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#0476b9] disabled:opacity-60 text-white py-2.5 px-4 rounded-lg font-semibold cursor-pointer hover:bg-[#03669f] transition shadow-xs"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" size={18} />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;