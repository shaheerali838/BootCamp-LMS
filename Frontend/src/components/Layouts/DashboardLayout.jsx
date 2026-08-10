import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout() {
  return (
    <div>
      <Sidebar />

      <main className="ml-70">
        <Navbar />

        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;