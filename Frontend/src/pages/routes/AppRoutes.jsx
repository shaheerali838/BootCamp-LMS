import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../../components/Layouts/DashboardLayout";

import Dashboard from "../../pages/Dashboard";
import StudentManagement from "../../pages/Student_Managment";
import StudentDetails from "../../components/Student_Managment/StudentDetails";
import AttendanceManagement from "../../pages/Attedence_Managment";
import Reports from "../../pages/Reports";
import Resources from "../../pages/Resources";

import SignUpPage from "../../pages/SignUpPage";
import LoginPage from "../../pages/LoginPage";
import LoginOutPage from "../../pages/LoginOutPage";

const AppRoutes = () => {
  return (
    <Routes>
     
      <Route element={<DashboardLayout />}>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/students"
          element={<StudentManagement />}
        />

      
        <Route
          path="/students/:id"
          element={<StudentDetails />}
        />

        <Route
          path="/attendance"
          element={<AttendanceManagement />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/resources"
          element={<Resources />}
        />
      </Route>

    
      <Route
        path="/sign-up"
        element={<SignUpPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/login-out"
        element={<LoginOutPage />}
      />

    
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;