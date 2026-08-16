
import React from "react";
import { useLocation } from "react-router-dom";

function Breadcrumb() {
  const location = useLocation();

  const pageNames = {
    "/": "Dashboard",
    "/dashboard": "Dashboard",
    "/students": "Student Management",
    "/teams": "Team Management",
    "/tasks":"Task",
    "/attendance": "Attendance Management",
    "/projects": "Project Management",
    "/announcements": "Announcements",
    "/reports": "Reports & Analytics",
    "/resources": "Resource Library",
  };

  const currentPage = pageNames[location.pathname] || "Dashboard";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <div className="text-sm text-gray-500">
        <span>Home</span>
        <span className="mx-1">/</span>
        <span className="text-gray-900 font-medium">{currentPage}</span>
      </div>
      <p className="text-xs text-gray-400 mt-0.5">{today}</p>
    </div>
  );
}

export default Breadcrumb;