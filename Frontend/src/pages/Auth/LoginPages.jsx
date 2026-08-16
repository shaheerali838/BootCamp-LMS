import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import img from "../../../public/imges/images.jpg";
import { useAuth } from "../../contextAPI/AuthContext";

function LoginPages() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
      newErrors.password =
        "Password must be at least 6 characters long";
    }

    setError(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      const response = await login(
        formData.email,
        formData.password
      );

      console.log("Login response:", response.data);

      const user = response.data.data.user;

      const role = user.role?.toLowerCase();

      if (role === "superadmin") {
        navigate("/superadmin/dashboard");
      } else if (role === "admin") {
        navigate("/dashboard");
      } else if (role === "student") {
        navigate("/student/dashboard");
      } else {
        setError({
          general: "Invalid user role",
        });
      }

      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      console.log("Login error:", error);

      setError({
        general:
          error.response?.data?.message ||
          "Invalid email or password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full">

        <div className="w-full flex items-center justify-center mb-4 lg:hidden">
          <img
            src={img}
            alt="SMIT Logo"
            className="w-40 h-auto object-contain"
          />
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

          <h1 className="font-bold text-3xl text-[#111528]">
            Welcome back
          </h1>

          <p className="text-gray-500 text-sm leading-6 mt-1">
            Kindly provide the Email and password used during SMIT
            registration.
          </p>

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
              placeholder="you@school.edu"
              className={`border w-full p-2.5 rounded-lg mt-1 outline-none transition ${error.email
                ? "border-red-400"
                : "border-gray-300 focus:border-[#0476b9]"
                }`}
            />

            {error.email && (
              <p className="text-red-500 text-xs mt-1">
                {error.email}
              </p>
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
                placeholder="Enter your password"
                className={`border w-full p-2.5 pr-12 rounded-lg mt-1 outline-none transition ${error.password
                  ? "border-red-400"
                  : "border-gray-300 focus:border-[#0476b9]"
                  }`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0476b9]"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            {error.password && (
              <p className="text-red-500 text-xs mt-1">
                {error.password}
              </p>
            )}
          </div>

          <div className="flex p-2 items-center justify-between">

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="accent-[#0476b9]"
              />

              <label
                htmlFor="remember"
                className="text-gray-500 text-sm ml-2"
              >
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
            disabled={loading}
            className="bg-[#0476b9] disabled:opacity-60 cursor-pointer text-white py-2.5 px-4 rounded-lg font-semibold mt-4 w-full hover:bg-[#03669f] transition"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default LoginPages;