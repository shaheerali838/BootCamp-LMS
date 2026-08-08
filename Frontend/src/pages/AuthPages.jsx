import { NavLink } from "react-router-dom";

function AuthPages() {
  return (
    <div className="mb-4 ml-3.5 flex w-full max-w-sm rounded-xl border border-gray-200 bg-gray-100 p-1 shadow-sm">
      <NavLink
        to="/login" 
        className={({ isActive }) =>
          `flex-1 rounded-lg py-2 text-center text-sm font-medium transition ${
            isActive
              ? "bg-white text-black shadow"
              : "bg-transparent text-gray-600"
          }`
        }
      >
        Login
      </NavLink>

      <NavLink
        to="/signup"
        className={({ isActive }) =>
          `flex-1 rounded-lg py-2 text-center text-sm font-medium transition ${
            isActive
              ? "bg-white text-black shadow-sm"
              : "bg-transparent text-gray-600"
          }`
        }
      >
        Sign Up
      </NavLink>
    </div>
  );
}

export default AuthPages;