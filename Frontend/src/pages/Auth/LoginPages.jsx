import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import img from "/imges/images.jpg?url";
import { useAuth } from "../../context/AuthContext";
import { FiLoader } from "react-icons/fi";

function LoginPages() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError({
      ...error,
      [e.target.name]: "",
      general: "",
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setError(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(formData.email, formData.password);

      const userRole = (response.data?.data?.user?.role || response.data?.user?.role || "STUDENT")
        .toUpperCase()
        .replace(/[\s_]+/g, "");

      if (userRole === "SUPERADMIN") {
        navigate("/superadmin/dashboard", { replace: true });
      } else if (userRole === "ADMIN") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/student/dashboard", { replace: true });
      }

      setFormData({
        email: "",
        password: "",
      });
      setError({});
    } catch (err) {
      console.error(err);
      setError({
        general: err.response?.data?.message || "Invalid email or password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-2">
      <div className="w-full max-w-md">
        <div className="w-full flex items-center py-2 justify-center lg:hidden">
          <img src={img} alt="SMIT Logo" className="w-30 h-20 object-contain" />
        </div>

        <form
          onSubmit={submitForm}
          className="bg-white px-7 py-6 border border-gray-200 rounded-2xl shadow-sm w-full"
        >
          {error.general && (
            <p className="text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm mb-4">
              {error.general}
            </p>
          )}

          <h1 className="font-bold text-3xl text-[#111528]">Welcome back</h1>

          <p className="text-gray-500 text-xs sm:text-sm leading-5 sm:leading-6 mt-1">
            Kindly provide the Email and password used during SMIT registration.
          </p>

          {/* Quick Demo Credentials */}
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Quick Fill Credentials:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setFormData({ email: "superadmin@bootcamp.local", password: "SuperAdmin@123" });
                  setError({});
                }}
                className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold rounded-lg transition"
              >
                👑 Super Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ email: "shaheer838838@gmail.com", password: "Admin@123" });
                  setError({});
                }}
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold rounded-lg transition"
              >
                🛡️ Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ email: "student001@example.com", password: "Student@123" });
                  setError({});
                }}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-lg transition"
              >
                🎓 Student
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-semibold mt-4"
            >
              Email
            </label>

            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="you@school.edu"
              className={`border w-full p-2.5 rounded-lg mt-1 outline-none transition ${
                error.email
                  ? "border-red-400"
                  : "border-gray-300 focus:border-[#0476b9]"
              } ${isLoading ? "bg-gray-100" : ""}`}
            />

            {error.email && (
              <p className="text-red-500 text-xs mt-1">{error.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-semibold mt-4"
            >
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Enter your password"
                className={`border w-full p-2.5 pr-12 rounded-lg mt-1 outline-none transition ${
                  error.password
                    ? "border-red-400"
                    : "border-gray-300 focus:border-[#0476b9]"
                } ${isLoading ? "bg-gray-100" : ""}`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0476b9]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error.password && (
              <p className="text-red-500 text-xs mt-1">{error.password}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 p-1 sm:p-2 mt-2 items-start sm:items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="accent-[#0476b9]"
              />

              <label htmlFor="remember" className="text-gray-500 text-sm ml-2">
                Remember me
              </label>
            </div>

            <NavLink
              to="/forgot-password"
              className="text-gray-500 text-sm hover:text-[#0476b9]"
            >
              Forgot Password?
            </NavLink>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-[#0476b9] cursor-pointer text-white py-2.5 px-4 rounded-lg font-semibold mt-3 sm:mt-4 w-full hover:bg-[#03669f] transition disabled:opacity-70"
          >
            {isLoading && <FiLoader className="animate-spin" />}
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPages;
