import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute, { getRoleDashboard, getNormalizedRole } from "./ProtectedRoute";

// ================= ADMIN PAGES =================
import Dashboard from "../pages/Dashboard";
import StudentManagement from "../pages/Students";
import StudentDetails from "../components/features/Students/StudentDetails";
import Task from "../pages/Task";
import AttendanceManagement from "../pages/Attendance";
import Reports from "../pages/Reports";
import Resources from "../pages/Resources";
import Deliverables from "../pages/Deliverables";
import Evaluations from "../pages/Evaluations";

// ================= TEAM =================
import TeamManagement from "../components/features/Teams/TeamManagement";
import TeamDetails from "../components/features/Teams/TeamDetail";

// ================= PROJECTS & ANNOUNCEMENTS =================
import ProjectManagement from "../components/features/Projects/ProjectManagement";
import ProjectDetail from "../components/features/Projects/ProjectDetail";
import Announcement from "../components/features/Announcements/Announcement";

// ================= STUDENT PAGES =================
import StudentDashboard from "../pages/Student/StudentDashboard";
import MyAttendance from "../pages/Student/MyAttendance";
import MyTasks from "../pages/Student/MyTasks";
import MyProjects from "../pages/Student/MyProjects";
import MyTeam from "../pages/Student/MyTeam";
import StudentResources from "../pages/Student/Resources";
import StudentAnnouncements from "../pages/Student/Announcements";
import StudentReports from "../pages/Student/Reports";
import MyMilestones from "../pages/Student/MyMilestones";
import MySprints from "../pages/Student/MySprints";
import MyDeliverables from "../pages/Student/MyDeliverables";
import MyEvaluation from "../pages/Student/MyEvaluation";

// ================= SUPER ADMIN PAGES =================
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

// ================= SHARED PROFILE PAGES =================
import Profile from "../pages/profile/Profile";
import ChangePassword from "../pages/profile/ChangePassword";

import { useAuth } from "../context/AuthContext";

function RoleDashboardRouter() {
  const { user } = useAuth();
  const role = getNormalizedRole(user);

  if (role === "STUDENT") {
    return <Navigate to="/student/dashboard" replace />;
  }
  if (role === "SUPERADMIN") {
    return <Navigate to="/superadmin/dashboard" replace />;
  }
  return <Dashboard />;
}

function RootRouter() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={getRoleDashboard(user)} replace />;
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= SHARED PROTECTED ROUTES (ANY AUTHENTICATED USER) ================= */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />
      <Route path="/student/profile" element={<Navigate to="/profile" replace />} />
      <Route path="/superadmin/profile" element={<Navigate to="/profile" replace />} />
      <Route path="/student/change-password" element={<Navigate to="/change-password" replace />} />
      <Route path="/superadmin/change-password" element={<Navigate to="/change-password" replace />} />

      {/* ================= ADMIN & MENTOR ROUTES ================= */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MENTOR"]}>
            <RoleDashboardRouter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MENTOR"]}>
            <StudentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/students/:id"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MENTOR"]}>
            <StudentDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/batches"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MENTOR"]}>
            <BatchManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MENTOR"]}>
            <AttendanceManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MENTOR"]}>
            <Task />
          </ProtectedRoute>
        }
      />
      <Route
        path="/milestones"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MENTOR"]}>
            <MilestoneManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sprints"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MENTOR"]}>
            <SprintManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/deliverables"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MENTOR"]}>
            <Deliverables />
          </ProtectedRoute>
        }
      />
      <Route
        path="/evaluations"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MENTOR"]}>
            <Evaluations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teams"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MENTOR"]}>
            <TeamManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teams/:id"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MENTOR"]}>
            <TeamDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/announcements"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MENTOR"]}>
            <Announcement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MENTOR"]}>
            <ProjectManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MENTOR"]}>
            <ProjectDetail />
          </ProtectedRoute>
        }
      />
      <Route path="/project" element={<Navigate to="/projects" replace />} />
      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MENTOR"]}>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MENTOR"]}>
            <Resources />
          </ProtectedRoute>
        }
      />
      <Route path="/dashboard/Student_Managemnt" element={<Navigate to="/students" replace />} />

      {/* ================= STUDENT ROUTES ================= */}
      <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/team"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <MyTeam />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/projects"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <MyProjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/tasks"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <MyTasks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/milestones"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <MyMilestones />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/sprints"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <MySprints />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/deliverables"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <MyDeliverables />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attendance"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <MyAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/evaluation"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <MyEvaluation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/resources"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentResources />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/announcements"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentAnnouncements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/reports"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentReports />
          </ProtectedRoute>
        }
      />

      {/* ================= SUPER ADMIN ROUTES ================= */}
      <Route path="/superadmin" element={<Navigate to="/superadmin/dashboard" replace />} />
      <Route
        path="/superadmin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/super-admins"
        element={
          <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
            <SuperAdminManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/admins"
        element={
          <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
            <AdminManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/students"
        element={
          <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
            <SuperAdminStudentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/batches"
        element={
          <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
            <BatchManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/teams"
        element={
          <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
            <TeamManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/teams/:id"
        element={
          <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
            <TeamDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/projects"
        element={
          <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
            <ProjectManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/projects/:id"
        element={
          <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
            <ProjectDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/tasks"
        element={
          <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
            <Task />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/milestones"
        element={
          <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
            <MilestoneManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/sprints"
        element={
          <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
            <SprintManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/attendance"
        element={
          <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
            <AttendanceOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/reports"
        element={
          <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
            <SuperAdminReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/resources"
        element={
          <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
            <SuperAdminResources />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/announcements"
        element={
          <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
            <Announcement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/configuration"
        element={
          <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
            <SystemConfiguration />
          </ProtectedRoute>
        }
      />

      {/* ================= DEFAULT & 404 CATCH-ALL ================= */}
      <Route path="/" element={<RootRouter />} />
      <Route path="*" element={<RootRouter />} />
    </Routes>
  );
};

export default AppRoutes;