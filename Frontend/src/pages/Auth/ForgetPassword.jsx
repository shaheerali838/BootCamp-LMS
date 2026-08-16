import React, { useState } from "react";
import { useAuth } from "../../contextAPI/AuthContext";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await forgotPassword(email);

      setMessage(
        response.data.message ||
          "Password reset email sent successfully"
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to send reset email"
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
          Forgot Password
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          Enter your email address and we will send you a password
          reset link.
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
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="border border-gray-300 w-full p-2.5 rounded-lg mt-1 outline-none focus:border-[#0476b9]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0476b9] disabled:opacity-60 text-white py-2.5 rounded-lg font-semibold mt-5"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full text-gray-500 mt-3 text-sm"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;