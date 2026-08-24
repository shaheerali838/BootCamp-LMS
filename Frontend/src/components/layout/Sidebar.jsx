import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import smitLogo from "../../assets/smitlogo.png";

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
  FiX,
} from "react-icons/fi";

import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../context/AuthContext";
import { GrAnnounce } from "react-icons/gr";
import { RiTeamFill } from "react-icons/ri";
import { IoFolderOutline } from "react-icons/io5";

/* ============================================================
   SIDEBAR NAV CONFIGS — one per role
   Role strings must match exactly what the backend returns.
   The login page normalises to: SUPERADMIN | ADMIN | STUDENT
   ============================================================ */

const ADMIN_NAV = [
  { name: "Dashboard", icon: <FiGrid size={19} />, path: "/dashboard" },
  { name: "Students", icon: <FiUsers size={19} />, path: "/students" },
  { name: "Batches", icon: <FiLayers size={19} />, path: "/batches" },
  { name: "Teams", icon: <RiTeamFill size={19} />, path: "/teams" },
  { name: "Projects", icon: <IoFolderOutline size={19} />, path: "/projects" },
  { name: "Tasks", icon: <FiClipboard size={19} />, path: "/tasks" },
  {
    name: "Milestones",
    icon: <FiCheckSquare size={19} />,
    path: "/milestones",
  },
  { name: "Sprints", icon: <FiClock size={19} />, path: "/sprints" },
  {
    name: "Review Deliverables",
    icon: <FiClipboard size={19} />,
    path: "/deliverables",
  },
  { name: "Attendance", icon: <FiCalendar size={19} />, path: "/attendance" },
  {
    name: "Evaluations",
    icon: <FiCheckSquare size={19} />,
    path: "/evaluations",
  },
  { name: "Reports", icon: <FiBarChart2 size={19} />, path: "/reports" },
  {
    name: "Announcements",
    icon: <GrAnnounce size={22} />,
    path: "/announcements",
  },
  { name: "Resources", icon: <FiBookOpen size={19} />, path: "/resources" },
];

const STUDENT_NAV = [
  { name: "Dashboard", icon: <FiGrid size={19} />, path: "/student/dashboard" },
  { name: "My Teams", icon: <RiTeamFill size={19} />, path: "/student/team" },
  {
    name: "My Projects",
    icon: <IoFolderOutline size={19} />,
    path: "/student/projects",
  },
  { name: "My Tasks", icon: <FiClipboard size={19} />, path: "/student/tasks" },
  {
    name: "Milestones",
    icon: <FiCheckSquare size={19} />,
    path: "/student/milestones",
  },
  { name: "Sprints", icon: <FiClock size={19} />, path: "/student/sprints" },
  {
    name: "My Deliverables",
    icon: <FiClipboard size={19} />,
    path: "/student/deliverables",
  },
  {
    name: "My Attendance",
    icon: <FiCalendar size={19} />,
    path: "/student/attendance",
  },
  {
    name: "My Evaluation",
    icon: <FiCheckSquare size={19} />,
    path: "/student/evaluation",
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
    name: "My Reports",
    icon: <FiBarChart2 size={19} />,
    path: "/student/reports",
  },
];

const SUPERADMIN_NAV = [
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
  { name: "Teams", icon: <RiTeamFill size={19} />, path: "/superadmin/teams" },
  {
    name: "Projects",
    icon: <IoFolderOutline size={19} />,
    path: "/superadmin/projects",
  },
  { name: "Tasks", icon: <FiClipboard size={19} />, path: "/superadmin/tasks" },
  {
    name: "Milestones",
    icon: <FiCheckSquare size={19} />,
    path: "/superadmin/milestones",
  },
  { name: "Sprints", icon: <FiClock size={19} />, path: "/superadmin/sprints" },
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
    name: "Announcements",
    icon: <GrAnnounce size={22} />,
    path: "/superadmin/announcements",
  },
  {
    name: "System Configuration",
    icon: <FiSliders size={19} />,
    path: "/superadmin/configuration",
  },
];

import { getNormalizedRole } from "../../routes/ProtectedRoute";

/* ============================================================
   Role colours & labels
   ============================================================ */
const ROLE_META = {
  SUPERADMIN: { bg: "bg-purple-700", label: "SA", fullLabel: "Super Admin" },
  ADMIN: { bg: "bg-blue-600", label: "A", fullLabel: "Admin" },
  MENTOR: { bg: "bg-blue-600", label: "M", fullLabel: "Mentor" },
  STUDENT: { bg: "bg-emerald-600", label: "S", fullLabel: "Student" },
};

/* ============================================================
   SIDEBAR COMPONENT
   ============================================================ */
const Sidebar = () => {
  const { pathname } = useLocation();
  const { isOpen, setIsOpen } = useSidebar();

  // ✅ Real authenticated user role — strict source of truth
  const { user } = useAuth();
  const role = getNormalizedRole(user) || "ADMIN";

  const meta = ROLE_META[role] || ROLE_META.ADMIN;

  const navItems =
    role === "SUPERADMIN"
      ? SUPERADMIN_NAV
      : role === "STUDENT"
        ? STUDENT_NAV
        : ADMIN_NAV;

  // Handle screen resize — auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* ========== MOBILE BACKDROP OVERLAY ========== */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-30 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-gray-200
          z-40 flex flex-col transition-all duration-300
          ${
            isOpen
              ? "w-70 translate-x-0"
              : "-translate-x-full md:translate-x-0 md:w-22.5"
          }
        `}
      >
        {/* ========== HEADER ========== */}
        <div className="relative">
          <div className="flex flex-col items-center justify-center px-5 py-5 border-b border-gray-200 gap-2">
            {isOpen || window.innerWidth < 768 ? (
              <img
                src={smitLogo}
                alt="SMIT Logo"
                className="w-32 h-auto object-contain"
              />
            ) : (
              <div
                className={`w-11 h-11 rounded-full ${meta.bg} flex items-center justify-center
                  text-white font-bold text-lg`}
              >
                {meta.label}
              </div>
            )}
          </div>

          {/* Mobile Close Button (Mobile only, inside sidebar panel) */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer border border-gray-200 flex items-center justify-center"
            title="Close Navigation Menu"
            aria-label="Close Navigation Menu"
          >
            <FiX size={18} />
          </button>

          {/* Collapse toggle (Desktop only) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 bg-white text-gray-500
              p-1.5 rounded-md shadow border border-gray-200 items-center justify-center
              hover:bg-gray-50 cursor-pointer"
            title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isOpen ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
          </button>
        </div>

        {/* ========== NAV ITEMS ========== */}
        <div className="flex-1 overflow-y-auto py-2 custom-sidebar-scrollbar pr-1">
          {navItems.map((item) => {
            const active =
              pathname === item.path || pathname.startsWith(item.path + "/");
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-4 py-3.5 mx-2 rounded-xl transition-all ${
                  active
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="flex items-center justify-center shrink-0">
                  {item.icon}
                </span>
                <span className="text-[13px] whitespace-nowrap">
                  {item.name}
                </span>
              </Link>
            );
          })}

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
