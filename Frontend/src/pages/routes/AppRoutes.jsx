import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../../components/Layouts/DashboardLayout";

import Dashboard from "../../pages/Dashboard";
import StudentManagement from "../../pages/Student_Managment";
import StudentDetails from "../../components/Student_Managment/StudentDetails";
import Task from "../../pages/Task";
import AttendanceManagement from "../../pages/Attedence_Managment";
import Reports from "../../pages/Reports";
import Resources from "../../pages/Resources";

import TeamManagement from "../../components/teamManagement/TeamManagement";
import TeamDetails from "../../components/teamManagement/TeamDetail";

// import LoginOutPage from "../../pages/LoginOutPage";
import ProjectManagement from "../../components/porject_Management/ProjectManagement";
import ProjectDetail from "../../components/porject_Management/ProjectDetail";
import Announcement from "../../components/Anouncement/Announcement";

// Student Layer Pages
import StudentDashboard from "../Student/StudentDashboard";
import MyAttendance from "../Student/MyAttendance";
import MyTasks from "../Student/MyTasks";
import MyProjects from "../Student/MyProjects";
import MyTeam from "../Student/MyTeam";
import StudentResources from "../Student/Resources";
import StudentAnnouncements from "../Student/Announcements";
import StudentReports from "../Student/Reports";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        {/* Admin Routes */}
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/students" element={<StudentManagement />} />
        <Route path="/students/:id" element={<StudentDetails />} />

        <Route path="/attendance" element={<AttendanceManagement />} />

        <Route path="/tasks" element={<Task />} />

        <Route path="/teams" element={<TeamManagement />} />
        <Route path="/teams/:id" element={<TeamDetails />} />
        <Route path="/announcements" element={<Announcement/>}/>
        <Route path="/projects" element={<ProjectManagement />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />

        <Route
          path="/project"
          element={<Navigate to="/projects" replace />}
        />

        {/* Admin Reports & Resources */}
        <Route path="/reports" element={<Reports />} />
        <Route path="/resources" element={<Resources />} />

        {/* Student Routes */}
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
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;