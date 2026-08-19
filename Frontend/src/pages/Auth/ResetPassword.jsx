import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { FiLoader } from "react-icons/fi";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { resetPassword } = useAuth();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
      return;
    }

    if (!newPassword) {
      setError("New password is required");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await resetPassword(token, newPassword);

      setMessage(
        response?.data?.message ||
          "Your password has been reset successfully! You can now log in."
      );
      setIsSuccess(true);
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="bg-[#0476B9] text-white lg:bg-white lg:text-gray-900 p-7 sm:p-8 rounded-2xl border border-white/20 lg:border-gray-200 shadow-xl lg:shadow-sm w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-white lg:text-[#111528]">
          Reset Password
        </h1>

        <p className="text-blue-100 lg:text-gray-500 text-xs sm:text-sm mt-1.5 leading-5">
          Enter your new password below to secure and update your account.
        </p>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-white/95 lg:bg-red-50 border border-red-200 p-3 rounded-lg mt-4 text-xs sm:text-sm font-medium">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="flex items-center gap-2 text-emerald-800 bg-emerald-100 lg:bg-green-50 lg:text-green-700 border border-emerald-200 lg:border-green-200 p-3 rounded-lg mt-4 text-xs sm:text-sm font-medium">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="mt-6 text-center">
            <p className="text-blue-100 lg:text-gray-500 text-xs sm:text-sm mb-4">
              Redirecting to login in 3 seconds...
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full bg-[#0476b9] hover:bg-[#03669f] text-white py-2.5 px-4 rounded-lg font-semibold transition shadow-md lg:shadow-none"
            >
              Proceed to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white lg:text-gray-700">
                New Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter at least 6 characters"
                  disabled={loading}
                  className="bg-white text-gray-900 border border-gray-200 lg:border-gray-300 w-full p-2.5 pr-11 rounded-lg outline-none focus:border-[#92C94E] lg:focus:border-[#0476b9] transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0476b9]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white lg:text-gray-700">
                Confirm New Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  disabled={loading}
                  className="bg-white text-gray-900 border border-gray-200 lg:border-gray-300 w-full p-2.5 pr-11 rounded-lg outline-none focus:border-[#92C94E] lg:focus:border-[#0476b9] transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0476b9]"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white text-[#0476b9] hover:bg-blue-50 font-bold lg:bg-[#0476b9] lg:text-white lg:hover:bg-[#03669f] lg:font-semibold disabled:opacity-60 py-2.5 rounded-lg mt-5 cursor-pointer transition shadow-md lg:shadow-none"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={18} />
                  <span>Resetting Password...</span>
                </>
              ) : (
                "Reset Password"
              )}
            </button>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-xs text-blue-100 hover:text-[#92C94E] lg:text-gray-500 lg:hover:text-[#0476b9] font-medium transition"
              >
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;