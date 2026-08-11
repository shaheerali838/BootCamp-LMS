import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../../components/Layouts/DashboardLayout";

import Dashboard from "../../pages/Dashboard";
import StudentManagement from "../../pages/Student_Managment";
import AttendanceManagement from "../../pages/Attedence_Managment";
import Reports from "../../pages/Reports";
import Resources from "../../pages/Resources";
import TeamManagement from "../../components/teamManagement/TeamManagement";
import TeamDetails from "../../components/teamManagement/TeamDetail";

import SignUpPage from "../../pages/SignUpPage";
import LoginPage from "../../pages/LoginPage";
import LoginOutPage from "../../pages/LoginOutPage";
import Forgetpassword from '../Auth/ForgetPassword'

const AppRoutes = () => {
  return (
    <Routes>
      
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<StudentManagement />} />
        <Route path="/attendance" element={<AttendanceManagement />} />
        <Route path="/teams" element={<TeamManagement />} />
        <Route path="/teams/:id" element={<TeamDetails />} /> 
        <Route path="/reports" element={<Reports />} />
        <Route path="/resources" element={<Resources />} />
      </Route>
      {/* <Route path="/sign-up" element={<SignUpPage />} /> */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login-out" element={<LoginOutPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;