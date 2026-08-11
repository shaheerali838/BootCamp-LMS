import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiCalendar,
  FiBarChart2,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useSidebar } from "../../context/SidebarContext";
import { icons } from "lucide-react";
import { RiTeamFill } from "react-icons/ri";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { isOpen, setIsOpen } = useSidebar();

  const handleToggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  const menuItems = [
    { name: "Dashboard", icon: <FiGrid size={22} />, path: "/dashboard" },
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
      // ERROR: malformed object syntax was here (used `icons , <RiTeamFill />` instead of `icon: <RiTeamFill />`)
    },
    { name: "Reports", icon: <FiBarChart2 size={22} />, path: "/reports" },
    { name: "Resources", icon: <FiBookOpen size={22} />, path: "/resources" },
  ];

  return (
    <div
      className={`
        fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-30
        flex flex-col py-6 justify-between transition-all duration-300
        ${isOpen ? "w-70" : "w-22.5"}
      `}
    >
      {/* TOP AREA */}
      <div>
        <div className="flex items-center justify-between px-5 pb-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            {isOpen && (
              <div>
                <div className="font-extrabold text-blue-600 text-2xl leading-tight">
                  SMIT
                </div>
                <div className="text-[11px] text-gray-400 font-semibold tracking-wide">
                  SAYLANI MASS IT TRAINING
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleToggle}
            className="bg-white text-gray-500 p-1.5 rounded-md shadow border border-gray-200 flex items-center justify-center"
          >
            {isOpen ? (
              <FiChevronLeft size={18} />
            ) : (
              <FiChevronRight size={18} />
            )}
          </button>
        </div>

        {/* MENU */}
        <nav className="mt-6 flex flex-col gap-2 px-3">
          {menuItems.map((item) => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all
                  ${
                    active
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                `}
              >
                <span className="flex items-center justify-center">
                  {item.icon}
                </span>
                {isOpen && <span className="text-[17px]">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* USER */}
      <div className="flex items-center gap-3 px-5 pt-4 border-t border-gray-200">
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
