import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../../pages/Dashboard";
import StudentManagement from "../../pages/Student_Managment";
import AttendanceManagement from "../../pages/Attedence_Managment";
import Reports from "../../pages/Reports";
import Resources from "../../pages/Resources";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/students" element={<StudentManagement />} />
      <Route path="/attendance" element={<AttendanceManagement />} />
      <Route path="/Reports" element={<Reports/>}/>
      <Route path="/Resources" element={<Resources/>}/>
    </Routes>
  );
};

export default AppRoutes;