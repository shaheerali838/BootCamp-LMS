import { NavLink } from "react-router-dom";

function AuthPages() {
  return (
    <div className="flex w-full border-b border-gray-200 mb-7">
      <NavLink
        to="/login"
        className={({ isActive }) =>
          `relative mr-7 pb-3 text-sm font-medium transition ${
            isActive ? "text-[#111528]" : "text-gray-500 hover:text-[#111528]"
          }`
        }
      >
        {({ isActive }) => (
          <>
            Login
            {isActive && (
              <span className="absolute -bottom-px left-0 h-0.5 w-10 bg-amber-400" />
            )}
          </>
        )}
      </NavLink>
      {/* <NavLink
        to="/signup"
        className={({ isActive }) =>
          `relative pb-3 text-sm font-medium transition ${isActive
            ? "text-[#111528]"
            : "text-gray-500 hover:text-[#111528]"
          }`
        }>
        {({ isActive }) => (
          <>
            Create account
            {isActive && (
              <span className="absolute bottom-[-1px] left-0 h-[2px] w-[100px] bg-amber-400" />
            )}
          </>
        )}
      </NavLink> */}
    </div>
  );
}

export default AuthPages;
