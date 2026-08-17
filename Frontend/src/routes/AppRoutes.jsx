import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// ================= AUTH =================
// Resolved merge conflict: Auth pages imported from relative path ../pages/Auth
import LoginPages from "../pages/Auth/LoginPages";
import ForgotPassword from "../pages/Auth/ForgetPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import ChangePassword from "../pages/Auth/ChangePassword";

// ================= ADMIN =================
// Resolved merge conflict: Corrected page and component import paths
import Dashboard from "../pages/Dashboard";
import StudentManagement from "../pages/Students";
import StudentDetails from "../components/features/Students/StudentDetails";
import Task from "../pages/Task";
import AttendanceManagement from "../pages/Attendance";
import Reports from "../pages/Reports";
import Resources from "../pages/Resources";

// ================= TEAM =================
import TeamManagement from "../components/features/Teams/TeamManagement";
import TeamDetails from "../components/features/Teams/TeamDetail";

// ================= PROJECTS & ANNOUNCEMENTS =================
import ProjectManagement from "../components/features/Projects/ProjectManagement";
import ProjectDetail from "../components/features/Projects/ProjectDetail";
import Announcement from "../components/features/Announcements/Announcement";

// ================= STUDENT =================
import StudentDashboard from "../pages/Student/StudentDashboard";
import MyAttendance from "../pages/Student/MyAttendance";
import MyTasks from "../pages/Student/MyTasks";
import MyProjects from "../pages/Student/MyProjects";
import MyTeam from "../pages/Student/MyTeam";
import StudentResources from "../pages/Student/Resources";
import StudentAnnouncements from "../pages/Student/Announcements";
import StudentReports from "../pages/Student/Reports";

// ================= SUPER ADMIN =================
import SuperAdminDashboard from "../pages/SuperAdmin/SuperAdminDashboard";
import SuperAdminManagement from "../pages/SuperAdmin/SuperAdminManagement";
import AdminManagement from "../pages/SuperAdmin/AdminManagement";
import SuperAdminStudentManagement from "../pages/SuperAdmin/StudentManagement";
import BatchManagement from "../pages/SuperAdmin/BatchManagement";
import MilestoneManagement from "../pages/SuperAdmin/MilestoneManagement";
import SprintManagement from "../pages/SuperAdmin/SprintManagement";
import AttendanceOverview from "../pages/SuperAdmin/AttendanceOverview";
import SuperAdminReports from "../pages/SuperAdmin/Reports";
import SuperAdminResources from "../pages/SuperAdmin/Resources";
import SystemConfiguration from "../pages/SuperAdmin/SystemConfiguration";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= AUTH ROUTES ================= */}

      <Route path="/login" element={<LoginPages />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
        path="/change-password"
        element={<ChangePassword />}
      />

      {/* ================= ADMIN ROUTES ================= */}

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/students" element={<StudentManagement />} />

      <Route
        path="/students/:id"
        element={<StudentDetails />}
      />

      <Route
        path="/attendance"
        element={<AttendanceManagement />}
      />

      <Route path="/tasks" element={<Task />} />

      <Route path="/teams" element={<TeamManagement />} />

      <Route
        path="/teams/:id"
        element={<TeamDetails />}
      />

      <Route
        path="/announcements"
        element={<Announcement />}
      />

      <Route
        path="/projects"
        element={<ProjectManagement />}
      />

      <Route
        path="/projects/:id"
        element={<ProjectDetail />}
      />

      <Route
        path="/project"
        element={<Navigate to="/projects" replace />}
      />

      <Route path="/reports" element={<Reports />} />

      <Route path="/resources" element={<Resources />} />

      {/* Old Student Management URL */}
      <Route
        path="/dashboard/Student_Managemnt"
        element={<Navigate to="/students" replace />}
      />

      {/* ================= STUDENT ROUTES ================= */}

      <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />

      <Route
        path="/student/dashboard"
        element={<StudentDashboard />}
      />

      <Route
        path="/student/attendance"
        element={<MyAttendance />}
      />

      <Route
        path="/student/tasks"
        element={<MyTasks />}
      />

      <Route
        path="/student/projects"
        element={<MyProjects />}
      />

      <Route
        path="/student/team"
        element={<MyTeam />}
      />

      <Route
        path="/student/resources"
        element={<StudentResources />}
      />

      <Route
        path="/student/announcements"
        element={<StudentAnnouncements />}
      />

      <Route
        path="/student/reports"
        element={<StudentReports />}
      />

      {/* ================= SUPER ADMIN ROUTES ================= */}

      <Route path="/superadmin" element={<Navigate to="/superadmin/dashboard" replace />} />

      <Route
        path="/superadmin/dashboard"
        element={<SuperAdminDashboard />}
      />

      <Route
        path="/superadmin/super-admins"
        element={<SuperAdminManagement />}
      />

      <Route
        path="/superadmin/admins"
        element={<AdminManagement />}
      />

      <Route
        path="/superadmin/students"
        element={<SuperAdminStudentManagement />}
      />

      <Route
        path="/superadmin/batches"
        element={<BatchManagement />}
      />

      {/* Teams */}
      <Route
        path="/superadmin/teams"
        element={<TeamManagement />}
      />

      <Route
        path="/superadmin/teams/:id"
        element={<TeamDetails />}
      />

      {/* Projects */}
      <Route
        path="/superadmin/projects"
        element={<ProjectManagement />}
      />

      <Route
        path="/superadmin/projects/:id"
        element={<ProjectDetail />}
      />

      {/* Announcements */}
      <Route
        path="/superadmin/announcements"
        element={<Announcement />}
      />

      {/* Milestones */}
      <Route
        path="/superadmin/milestones"
        element={<MilestoneManagement />}
      />

      {/* Sprints */}
      <Route
        path="/superadmin/sprints"
        element={<SprintManagement />}
      />

      {/* Attendance */}
      <Route
        path="/superadmin/attendance"
        element={<AttendanceOverview />}
      />

      {/* Reports */}
      <Route
        path="/superadmin/reports"
        element={<SuperAdminReports />}
      />

      {/* Resources */}
      <Route
        path="/superadmin/resources"
        element={<SuperAdminResources />}
      />

      {/* System Configuration */}
      <Route
        path="/superadmin/configuration"
        element={<SystemConfiguration />}
      />

      {/* ================= DEFAULT ================= */}

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;