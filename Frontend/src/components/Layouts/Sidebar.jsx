import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import smitLogo from "../../assets/smitLogo.png";

import {
  FiGrid,
  FiUsers,
  FiCalendar,
  FiBarChart2,
  FiBookOpen,
  FiClipboard,
  FiChevronLeft,
  FiChevronRight,
  FiBell,
  FiUserCheck,
} from "react-icons/fi";

import { useSidebar } from "../../context/SidebarContext";
import { RiTeamFill } from "react-icons/ri";
import { IoFolderOutline } from "react-icons/io5";

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isOpen, setIsOpen } = useSidebar();

  // /students is Admin Student Management
  // /student/* is Student Portal
  const isStudentRoute = pathname.startsWith("/student/");

  const [role, setRole] = useState(isStudentRoute ? "student" : "admin");

  useEffect(() => {
    if (pathname.startsWith("/student/")) {
      setRole("student");
    } else {
      setRole("admin");
    }
  }, [pathname]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleRoleSwitch = () => {
    if (role === "admin") {
      navigate("/student/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setIsOpen]);

  const adminMenuItems = [
    {
      name: "Dashboard",
      icon: <FiGrid size={22} />,
      path: "/dashboard",
    },
    {
      name: "Student Management",
      icon: <FiUsers size={22} />,
      path: "/students",
    },
    {
      name: "Attendance Management",
      icon: <FiCalendar size={22} />,
      path: "/attendance",
    },
    {
      name: "Team Management",
      icon: <RiTeamFill size={22} />,
      path: "/teams",
    },
    {
      name: "Tasks",
      icon: <FiClipboard size={22} />,
      path: "/tasks",
    },
    {
      name: "Reports",
      icon: <FiBarChart2 size={22} />,
      path: "/reports",
    },
    {
      name: "Resources",
      icon: <FiBookOpen size={22} />,
      path: "/resources",
    },
    {
      name: "Project Management",
      icon: <IoFolderOutline size={22} />,
      path: "/projects",
    },
  ];

  const studentMenuItems = [
    {
      name: "Student Dashboard",
      icon: <FiGrid size={22} />,
      path: "/student/dashboard",
    },
    {
      name: "My Attendance",
      icon: <FiCalendar size={22} />,
      path: "/student/attendance",
    },
    {
      name: "My Tasks & Deliverables",
      icon: <FiClipboard size={22} />,
      path: "/student/tasks",
    },
    {
      name: "My Projects",
      icon: <IoFolderOutline size={22} />,
      path: "/student/projects",
    },
    {
      name: "My Team",
      icon: <RiTeamFill size={22} />,
      path: "/student/team",
    },
    {
      name: "Resources",
      icon: <FiBookOpen size={22} />,
      path: "/student/resources",
    },
    {
      name: "Announcements",
      icon: <FiBell size={22} />,
      path: "/student/announcements",
    },
    {
      name: "My Reports",
      icon: <FiBarChart2 size={22} />,
      path: "/student/reports",
    },
  ];

  const currentMenu =
    role === "student" ? studentMenuItems : adminMenuItems;

  return (
    <div
      className={`
        fixed top-0 left-0 h-screen
        bg-white border-r border-gray-200
        z-30 flex flex-col
        transition-all duration-300
        ${isOpen ? "w-70" : "w-22.5"}
      `}
    >
      {/* HEADER */}
      <div className="relative">
        <div className="flex flex-col items-center justify-center px-5 py-5 border-b border-gray-200 gap-2">
          {isOpen ? (
            <>
              <img
                src={smitLogo}
                alt="SMIT Logo"
                className="w-32 h-auto object-contain"
              />

              <button
                onClick={handleRoleSwitch}
                className="mt-1 text-[11px] font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition"
              >
                Switch to{" "}
                {role === "admin" ? "Student Mode" : "Admin Mode"}
              </button>
            </>
          ) : (
            <div
              onClick={handleRoleSwitch}
              title={`Switch Role (Current: ${role})`}
              className="w-11 h-11 rounded-full bg-blue-600 cursor-pointer flex items-center justify-center text-white font-bold text-lg"
            >
              {role === "admin" ? "A" : "S"}
            </div>
          )}
        </div>

        {/* TOGGLE BUTTON */}
        <button
          onClick={handleToggle}
          className="
            absolute -right-3 top-1/2
            -translate-y-1/2
            bg-white text-gray-500
            p-1.5 rounded-md
            shadow border border-gray-200
            flex items-center justify-center
            hover:bg-gray-50
          "
        >
          {isOpen ? (
            <FiChevronLeft size={18} />
          ) : (
            <FiChevronRight size={18} />
          )}
        </button>
      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto py-2">
        {currentMenu.map((item) => {
          const active = pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 mx-2 rounded-xl transition-all ${
                active
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center justify-center flex-shrink-0">
                {item.icon}
              </span>

              {isOpen && (
                <span className="text-[14px] whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* USER */}
      <div className="mt-auto flex items-center gap-3 px-5 py-4 border-t border-gray-200">
        <div
          className={`w-11 h-11 rounded-full ${
            role === "admin" ? "bg-blue-600" : "bg-emerald-600"
          } flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
        >
          {role === "admin" ? "AU" : "AH"}
        </div>

        {isOpen && (
          <div>
            <div className="text-sm font-bold text-gray-900">
              {role === "admin" ? "Admin User" : "Ali Hassan"}
            </div>

            <div className="text-xs text-gray-400">
              {role === "admin"
                ? "admin@smit.edu.pk"
                : "ali.hassan@smit.edu"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;