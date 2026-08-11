import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../../components/Layouts/DashboardLayout";

import Dashboard from "../../pages/Dashboard";
import StudentManagement from "../../pages/Student_Managment";
import StudentDetails from "../../components/Student_Managment/StudentDetails";
import AttendanceManagement from "../../pages/Attedence_Managment";
import Reports from "../../pages/Reports";
import Resources from "../../pages/Resources";

import TeamManagement from "../../components/teamManagement/TeamManagement";
import TeamDetails from "../../components/teamManagement/TeamDetail";

import LoginPage from "../../pages/LoginPage";
import LoginOutPage from "../../pages/LoginOutPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Protected Dashboard Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Student Management */}
        <Route path="/students" element={<StudentManagement />} />
        <Route path="/students/:id" element={<StudentDetails />} />

        {/* Attendance */}
        <Route path="/attendance" element={<AttendanceManagement />} />

        {/* Team Management */}
        <Route path="/teams" element={<TeamManagement />} />
        <Route path="/teams/:id" element={<TeamDetails />} />

        {/* Reports & Resources */}
        <Route path="/reports" element={<Reports />} />
        <Route path="/resources" element={<Resources />} />
      </Route>

      {/* Authentication */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login-out" element={<LoginOutPage />} />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
