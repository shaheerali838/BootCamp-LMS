import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "react-icons/fi";

import { useSidebar } from "../../context/SidebarContext";
import { RiTeamFill } from "react-icons/ri";
import { IoFolderOutline } from "react-icons/io5";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { isOpen, setIsOpen } = useSidebar();

  const handleToggle = () => {
    setIsOpen(!isOpen);
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

  const menuItems = [
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
        <div className="flex items-center justify-center px-5 py-6 border-b border-gray-200">
          {isOpen ? (
            <img
              src={smitLogo}
              alt="SMIT Logo"
              className="w-36 h-auto object-contain"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              S
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
          {isOpen ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
        </button>
      </div>

      {/* MENU */}
      {menuItems.map((item) => {
        const active = pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
              active
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center justify-center shrink-0">
              {item.icon}
            </span>

            {isOpen && (
              <span className="text-[15px] whitespace-nowrap">{item.name}</span>
            )}
          </Link>
        );
      })}

      {/* USER */}
      <div className="mt-auto flex items-center gap-3 px-5 py-4 border-t border-gray-200">
        <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          AU
        </div>

        {isOpen && (
          <div>
            <div className="text-sm font-bold text-gray-900">Admin User</div>

            <div className="text-xs text-gray-400">admin@smit.edu.pk</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
