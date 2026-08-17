import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-70">
        <Navbar />
      </main>
       <Outlet />
    </div>
  );
}

export default DashboardLayout;