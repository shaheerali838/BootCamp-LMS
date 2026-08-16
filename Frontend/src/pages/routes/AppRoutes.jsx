import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// ================= AUTH =================
// Import Authentication pages from relative directory ../Auth
import LoginPages from "../Auth/LoginPages";
import ForgotPassword from "../Auth/ForgetPassword"; // Points to ForgetPassword.jsx
import ResetPassword from "../Auth/ResetPassword";
import ChangePassword from "../Auth/ChangePassword";

// ================= ADMIN =================
import Dashboard from "../../pages/Dashboard";
import StudentManagement from "../../pages/Student_Managment";
import StudentDetails from "../../components/Student_Managment/StudentDetails";
import Task from "../../pages/Task";
import AttendanceManagement from "../../pages/Attedence_Managment";
import Reports from "../../pages/Reports";
import Resources from "../../pages/Resources";

// ================= TEAM =================
import TeamManagement from "../../components/teamManagement/TeamManagement";
import TeamDetails from "../../components/teamManagement/TeamDetail";

// ================= PROJECTS & ANNOUNCEMENTS =================
import ProjectManagement from "../../components/porject_Management/ProjectManagement";
import ProjectDetail from "../../components/porject_Management/ProjectDetail";
import Announcement from "../../components/Anouncement/Announcement";

// ================= STUDENT =================
import StudentDashboard from "../Student/StudentDashboard";
import MyAttendance from "../Student/MyAttendance";
import MyTasks from "../Student/MyTasks";
import MyProjects from "../Student/MyProjects";
import MyTeam from "../Student/MyTeam";
import StudentResources from "../Student/Resources";
import StudentAnnouncements from "../Student/Announcements";
import StudentReports from "../Student/Reports";

// ================= SUPER ADMIN =================
import SuperAdminDashboard from "../SuperAdmin/SuperAdminDashboard";
import SuperAdminManagement from "../SuperAdmin/SuperAdminManagement";
import AdminManagement from "../SuperAdmin/AdminManagement";
import SuperAdminStudentManagement from "../SuperAdmin/StudentManagement";
import BatchManagement from "../SuperAdmin/BatchManagement";
import MilestoneManagement from "../SuperAdmin/MilestoneManagement";
import SprintManagement from "../SuperAdmin/SprintManagement";
import AttendanceOverview from "../SuperAdmin/AttendanceOverview";
import SuperAdminReports from "../SuperAdmin/Reports";
import SuperAdminResources from "../SuperAdmin/Resources";
import SystemConfiguration from "../SuperAdmin/SystemConfiguration";

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