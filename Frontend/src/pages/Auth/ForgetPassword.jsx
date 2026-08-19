import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
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
        response?.data?.message || "Password reset email sent successfully",
      );
    } catch (error) {
      setError(error.response?.data?.message || "Unable to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#0476B9] text-white lg:bg-white lg:text-gray-900 p-7 rounded-2xl border border-white/20 lg:border-gray-200 shadow-xl lg:shadow-sm w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-white lg:text-[#111528]">
          Forgot Password
        </h1>

        <p className="text-blue-100 lg:text-gray-500 text-sm mt-2">
          Enter your email address and we will send you a password reset link.
        </p>

        {error && (
          <p className="text-red-600 bg-white/95 lg:bg-red-50 lg:border lg:border-red-200 p-2 rounded mt-4 text-sm font-medium">
            {error}
          </p>
        )}

        {message && (
          <p className="text-emerald-800 bg-emerald-100 lg:bg-green-50 lg:text-green-600 lg:border lg:border-green-200 p-2 rounded mt-4 text-sm font-medium">
            {message}
          </p>
        )}

        <label className="block text-sm font-semibold mt-5 text-white lg:text-gray-700">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="bg-white text-gray-900 border border-gray-200 lg:border-gray-300 w-full p-2.5 rounded-lg mt-1 outline-none focus:border-[#92C94E] lg:focus:border-[#0476b9]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-[#0476b9] hover:bg-blue-50 font-bold lg:bg-[#0476b9] lg:text-white lg:hover:bg-[#03669f] lg:font-semibold disabled:opacity-60 py-2.5 rounded-lg mt-5 cursor-pointer transition shadow-md lg:shadow-none"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full text-blue-100 hover:text-[#92C94E] lg:text-gray-500 lg:hover:text-[#0476b9] mt-3 text-sm cursor-pointer transition"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
