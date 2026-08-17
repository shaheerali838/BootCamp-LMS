import React from "react";
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

/* ============================================================
   Helper — normalise backend role string to a display key
   Backend returns: "admin", "superadmin", "student" (lowercase)
   LoginPages normalises to uppercase, but user object stores
   whatever the DB has.  We just lowercase and strip spaces/_.
   ============================================================ */
function normaliseRole(rawRole = "") {
  const r = rawRole.toLowerCase().replace(/[\s_]+/g, "");
  if (r === "superadmin") return "superadmin";
  if (r === "student") return "student";
  return "admin"; // default
}

/* ============================================================
   Role colours & labels
   ============================================================ */
const ROLE_META = {
  superadmin: { bg: "bg-purple-700", label: "SA", fullLabel: "Super Admin" },
  admin: { bg: "bg-blue-600", label: "A", fullLabel: "Admin" },
  student: { bg: "bg-emerald-600", label: "S", fullLabel: "Student" },
};

/* ============================================================
   SIDEBAR COMPONENT
   ============================================================ */
const Sidebar = () => {
  const { pathname } = useLocation();
  const { isOpen, setIsOpen } = useSidebar();

  // ✅ Real authenticated user role — source of truth
  const { user } = useAuth();
  const role = normaliseRole(user?.role);

  const meta = ROLE_META[role];

  const navItems =
    role === "superadmin"
      ? SUPERADMIN_NAV
      : role === "student"
        ? STUDENT_NAV
        : ADMIN_NAV;

  // Keep sidebar open on desktop
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  return (
    <div
      className={`
        fixed top-0 left-0 h-screen bg-white border-r border-gray-200
        z-30 flex flex-col transition-all duration-300
        ${isOpen ? "w-70" : "w-22.5"}
      `}
    >
      {/* ========== HEADER ========== */}
      <div className="relative">
        <div className="flex flex-col items-center justify-center px-5 py-5 border-b border-gray-200 gap-2">
          {isOpen ? (
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

        {/* Collapse toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white text-gray-500
            p-1.5 rounded-md shadow border border-gray-200 flex items-center justify-center
            hover:bg-gray-50"
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
              className={`flex items-center gap-3 px-4 py-3.5 mx-2 rounded-xl transition-all ${
                active
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center justify-center shrink-0">
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

      {/* ========== USER FOOTER ========== */}
      <div className="mt-auto flex items-center justify-between px-4 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full ${meta.bg} flex items-center justify-center
              text-white font-bold text-xs shrink-0`}
          >
            {meta.label}
          </div>
          {isOpen && (
            <div>
              <div className="text-sm font-bold text-gray-900">
                {user
                  ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                    user.email
                  : "Guest"}
              </div>
              <div className="text-xs text-gray-400">{user?.email || ""}</div>
            </div>
          )}
        </div>
        {isOpen && <FiChevronDown size={16} className="text-gray-400" />}
      </div>
    </div>
  );
};

export default Sidebar;
