import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import img from "/imges/images.jpg?url";
import { useAuth } from "../../context/AuthContext";
import { FiLoader } from "react-icons/fi";
import { getRoleDashboard } from "../../routes/ProtectedRoute";

function LoginPages() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load remembered credentials on mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const isRemembered = localStorage.getItem("rememberMe") === "true";
    if (savedEmail && isRemembered) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

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

    const trimmedIdentifier = (formData.email || "").trim();
    const trimmedPassword = (formData.password || "").trim();

    let newErrors = {};

    if (!trimmedIdentifier) {
      newErrors.email = "Email or Roll Number is required";
    }

    if (!trimmedPassword) {
      newErrors.password = "Password is required";
    } else if (trimmedPassword.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setError(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(trimmedIdentifier, trimmedPassword);

      // Handle Remember Me persistence
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", trimmedIdentifier);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberMe");
      }

      const loggedUser =
        response.data?.data?.user ||
        response.data?.user ||
        response.user ||
        {};

      navigate(getRoleDashboard(loggedUser), { replace: true });

      if (!rememberMe) {
        setFormData({
          email: "",
          password: "",
        });
      } else {
        setFormData((prev) => ({ ...prev, password: "" }));
      }
      setError({});
    } catch (err) {
      console.error(err);
      setError({
        general: err.response?.data?.message || "Invalid email/roll number or password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="w-full flex items-center pb-2 justify-center lg:hidden">
          <img
            src={img}
            alt="SMIT Logo"
            className="w-38 h-22 sm:w-52 sm:h-30 object-contain"
          />
        </div>

        <form
          onSubmit={submitForm}
          className="bg-[#0476B9] text-white lg:bg-white lg:text-gray-900 px-6 py-4 sm:px-7 sm:py-5 border border-white/20 lg:border-gray-200 rounded-2xl shadow-xl lg:shadow-sm w-full"
        >
          {error.general && (
            <p className="text-red-600 bg-white/95 border border-red-200 lg:bg-red-50 lg:border-red-200 rounded-lg px-3 py-1.5 text-xs sm:text-sm mb-3 font-medium">
              {error.general}
            </p>
          )}

          <h1 className="font-bold text-2xl sm:text-3xl text-white lg:text-[#111528]">
            Welcome back
          </h1>

          <p className="text-blue-100 lg:text-gray-500 text-xs sm:text-sm leading-4 sm:leading-5 mt-1">
            Kindly provide the Email or Roll Number and password used during
            registration.
          </p>

          <div>
            <label
              htmlFor="email"
              className="block text-white lg:text-gray-700 text-xs sm:text-sm font-semibold mt-3 sm:mt-4"
            >
              Email or Roll Number
            </label>

            <input
              type="text"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="name@example.com or SMIT-1001"
              className={`bg-white text-gray-900 border w-full p-2 sm:p-2.5 rounded-lg mt-1 outline-none text-xs sm:text-sm transition ${
                error.email
                  ? "border-red-400"
                  : "border-gray-200 lg:border-gray-300 focus:border-[#92C94E] lg:focus:border-[#0476b9]"
              } ${isLoading ? "bg-gray-100" : ""}`}
            />

            {error.email && (
              <p className="text-amber-300 lg:text-red-500 text-xs mt-0.5 font-medium">
                {error.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-white lg:text-gray-700 text-xs sm:text-sm font-semibold mt-2.5 sm:mt-3"
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
                className={`bg-white text-gray-900 border w-full p-2 sm:p-2.5 pr-11 rounded-lg mt-1 outline-none text-xs sm:text-sm transition ${
                  error.password
                    ? "border-red-400"
                    : "border-gray-200 lg:border-gray-300 focus:border-[#92C94E] lg:focus:border-[#0476b9]"
                } ${isLoading ? "bg-gray-100" : ""}`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0476b9]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error.password && (
              <p className="text-amber-300 lg:text-red-500 text-xs mt-0.5 font-medium">
                {error.password}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-1 sm:gap-0 p-0.5 sm:p-1 mt-1.5 items-start sm:items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[#92C94E] lg:accent-[#0476b9] cursor-pointer"
              />

              <label
                htmlFor="remember"
                className="text-blue-100 lg:text-gray-500 text-xs sm:text-sm ml-2 cursor-pointer select-none"
              >
                Remember me
              </label>
            </div>

            <NavLink
              to="/forgot-password"
              className="text-blue-100 lg:text-gray-500 text-xs sm:text-sm hover:text-[#92C94E] lg:hover:text-[#0476b9] transition"
            >
              Forgot Password?
            </NavLink>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-white text-[#0476b9] hover:bg-blue-50 font-bold lg:bg-[#0476b9] lg:text-white lg:hover:bg-[#03669f] lg:font-semibold cursor-pointer py-2 sm:py-2.5 px-4 rounded-lg mt-2.5 sm:mt-3.5 w-full text-xs sm:text-sm transition disabled:opacity-70 shadow-md lg:shadow-none"
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
