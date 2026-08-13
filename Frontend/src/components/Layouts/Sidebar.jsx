import React from "react";
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
  FiShield,
  FiUserCheck,
  FiLayers,
  FiCheckSquare,
  FiClock,
  FiSliders,
  FiChevronDown,
} from "react-icons/fi";

import { useSidebar } from "../../context/SidebarContext";
import { RiTeamFill } from "react-icons/ri";
import { IoFolderOutline } from "react-icons/io5";

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { isOpen, setIsOpen } = useSidebar();

  /*
   * Determine role from URL.
   *
   * /superadmin/...  -> superadmin
   * /student/...     -> student
   * everything else  -> admin
   */
  const role = pathname.startsWith("/superadmin")
    ? "superadmin"
    : pathname.startsWith("/student/") || pathname === "/student"
    ? "student"
    : "admin";

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  /*
   * Switch between roles
   */
  const handleRoleSwitch = () => {
    if (role === "admin") {
      navigate("/student/dashboard");
      return;
    }

    if (role === "student") {
      navigate("/superadmin/dashboard");
      return;
    }

    navigate("/dashboard");
  };

  /*
   * Keep sidebar open on desktop.
   *
   * No scrollbar is added here.
   */
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setIsOpen]);

  /* ================= ADMIN MENU ================= */

  const adminMenuItems = [
    {
      name: "Dashboard",
      icon: <FiGrid size={19} />,
      path: "/dashboard",
    },
    {
      name: "Student Management",
      icon: <FiUsers size={19} />,
      path: "/students",
    },
    {
      name: "Attendance Management",
      icon: <FiCalendar size={19} />,
      path: "/attendance",
    },
    {
      name: "Team Management",
      icon: <RiTeamFill size={19} />,
      path: "/teams",
    },
    {
      name: "Tasks",
      icon: <FiClipboard size={19} />,
      path: "/tasks",
    },
    {
      name: "Reports",
      icon: <FiBarChart2 size={19} />,
      path: "/reports",
    },
    {
      name: "Resources",
      icon: <FiBookOpen size={19} />,
      path: "/resources",
    },
    {
      name: "Project Management",
      icon: <IoFolderOutline size={19} />,
      path: "/projects",
    },
  ];

  /* ================= STUDENT MENU ================= */

  const studentMenuItems = [
    {
      name: "Dashboard",
      icon: <FiGrid size={19} />,
      path: "/student/dashboard",
    },
    {
      name: "My Attendance",
      icon: <FiCalendar size={19} />,
      path: "/student/attendance",
    },
    {
      name: "My Tasks",
      icon: <FiClipboard size={19} />,
      path: "/student/tasks",
    },
    {
      name: "My Projects",
      icon: <IoFolderOutline size={19} />,
      path: "/student/projects",
    },
    {
      name: "My Teams",
      icon: <RiTeamFill size={19} />,
      path: "/student/team",
    },
    {
      name: "Resources",
      icon: <FiBookOpen size={19} />,
      path: "/student/resources",
    },
    {
      name: "Announcements",
      icon: <FiBell size={19} />,
      path: "/student/announcements",
    },
    {
      name: "Reports",
      icon: <FiBarChart2 size={19} />,
      path: "/student/reports",
    },
  ];

  /* ================= SUPER ADMIN MENU ================= */

  const superAdminMenuItems = [
    {
      name: "Dashboard",
      icon: <FiGrid size={19} />,
      path: "/superadmin/dashboard",
    },
    {
      name: "Super Admins",
      icon: <FiShield size={19} />,
      path: "/superadmin/super-admins",
    },
    {
      name: "Admins / Mentors",
      icon: <FiUserCheck size={19} />,
      path: "/superadmin/admins",
    },
    {
      name: "Students",
      icon: <FiUsers size={19} />,
      path: "/superadmin/students",
    },
    {
      name: "Batches",
      icon: <FiLayers size={19} />,
      path: "/superadmin/batches",
    },
    {
      name: "Teams",
      icon: <RiTeamFill size={19} />,
      path: "/superadmin/teams",
    },
    {
      name: "Projects",
      icon: <IoFolderOutline size={19} />,
      path: "/superadmin/projects",
    },
    {
      name: "Milestones",
      icon: <FiCheckSquare size={19} />,
      path: "/superadmin/milestones",
    },
    {
      name: "Sprints",
      icon: <FiClock size={19} />,
      path: "/superadmin/sprints",
    },
    {
      name: "Attendance Overview",
      icon: <FiCalendar size={19} />,
      path: "/superadmin/attendance",
    },
    {
      name: "Reports",
      icon: <FiBarChart2 size={19} />,
      path: "/superadmin/reports",
    },
    {
      name: "Resources",
      icon: <FiBookOpen size={19} />,
      path: "/superadmin/resources",
    },
    {
      name: "System Configuration",
      icon: <FiSliders size={19} />,
      path: "/superadmin/configuration",
    },
  ];

  /* ================= CURRENT MENU ================= */

  const currentMenu =
    role === "superadmin"
      ? superAdminMenuItems
      : role === "student"
      ? studentMenuItems
      : adminMenuItems;

  return (
    <div
      className={`
        fixed
        top-0
        left-0
        h-screen
        bg-white
        border-r
        border-gray-200
        z-30
        flex
        flex-col
        transition-all
        duration-300
        ${isOpen ? "w-70" : "w-22.5"}
      `}
    >
      {/* ================= HEADER ================= */}

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
                className="
                  mt-1
                  text-[11px]
                  font-semibold
                  px-3
                  py-1
                  rounded-full
                  bg-purple-50
                  text-purple-700
                  border
                  border-purple-200
                  hover:bg-purple-100
                  transition
                "
              >
                Switch Role ({role.toUpperCase()})
              </button>
            </>
          ) : (
            <button
              onClick={handleRoleSwitch}
              title={`Switch Role (Current: ${role})`}
              className="
                w-11
                h-11
                rounded-full
                bg-purple-600
                cursor-pointer
                flex
                items-center
                justify-center
                text-white
                font-bold
                text-lg
              "
            >
              {role === "superadmin"
                ? "SA"
                : role === "admin"
                ? "A"
                : "S"}
            </button>
          )}
        </div>

        {/* ================= TOGGLE ================= */}

        <button
          onClick={handleToggle}
          className="
            absolute
            -right-3
            top-1/2
            -translate-y-1/2
            bg-white
            text-gray-500
            p-1.5
            rounded-md
            shadow
            border
            border-gray-200
            flex
            items-center
            justify-center
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

      {/* ================= MENU ================= */}

      {/*
        overflow-y-auto REMOVED

        This removes the sidebar scrollbar.
      */}
      <div className="flex-1 py-2 overflow-hidden">
        {currentMenu.map((item) => {
          const active = pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex
                items-center
                gap-3
                px-4
                py-2.5
                mx-2
                rounded-xl
                transition-all
                ${
                  active
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              <span className="flex items-center justify-center flex-shrink-0">
                {item.icon}
              </span>

              {isOpen && (
                <span className="text-[13px] whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* ================= USER ================= */}

      <div className="mt-auto flex items-center justify-between px-4 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div
            className={`
              w-10
              h-10
              rounded-full
              ${
                role === "superadmin"
                  ? "bg-purple-700"
                  : role === "admin"
                  ? "bg-blue-600"
                  : "bg-emerald-600"
              }
              flex
              items-center
              justify-center
              text-white
              font-bold
              text-xs
              flex-shrink-0
            `}
          >
            {role === "superadmin"
              ? "SA"
              : role === "admin"
              ? "AU"
              : "SB"}
          </div>

          {isOpen && (
            <div>
              <div className="text-sm font-bold text-gray-900">
                {role === "superadmin"
                  ? "Sara Bilal"
                  : role === "admin"
                  ? "Admin User"
                  : "Sara Bilal"}
              </div>

              <div className="text-xs text-gray-400">
                {role === "superadmin"
                  ? "Super Admin"
                  : role === "admin"
                  ? "admin@smit.edu.pk"
                  : "Student"}
              </div>
            </div>
          )}
        </div>

        {isOpen && (
          <FiChevronDown
            size={16}
            className="text-gray-400"
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;