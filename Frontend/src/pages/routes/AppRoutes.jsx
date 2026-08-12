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

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/students" element={<StudentManagement />} />
        <Route path="/students/:id" element={<StudentDetails />} />

        <Route path="/attendance" element={<AttendanceManagement />} />
          <Route path="/tasks" element={<Task />} />

        <Route path="/teams" element={<TeamManagement />} />
        <Route path="/teams/:id" element={<TeamDetails />} />

        <Route path="/reports" element={<Reports />} />
        <Route path="/resources" element={<Resources />} />
      </Route>

      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;