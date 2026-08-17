import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { resetPassword } = useAuth();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Invalid or missing reset token");
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

      const response = await resetPassword(
        token,
        newPassword
      );

      setMessage(
        response?.data?.message ||
          "Password reset successfully"
      );

      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-[#111528]">
          Reset Password
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          Enter your new password below.
        </p>

        {error && (
          <p className="text-red-500 bg-red-50 p-2 rounded mt-4 text-sm">
            {error}
          </p>
        )}

        {message && (
          <p className="text-green-600 bg-green-50 p-2 rounded mt-4 text-sm">
            {message}
          </p>
        )}

        <label className="block text-sm font-semibold mt-5">
          New Password
        </label>

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          className="border border-gray-300 w-full p-2.5 rounded-lg mt-1 outline-none focus:border-[#0476b9]"
        />

        <label className="block text-sm font-semibold mt-4">
          Confirm Password
        </label>

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          placeholder="Confirm new password"
          className="border border-gray-300 w-full p-2.5 rounded-lg mt-1 outline-none focus:border-[#0476b9]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0476b9] disabled:opacity-60 text-white py-2.5 rounded-lg font-semibold mt-5 cursor-pointer"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;