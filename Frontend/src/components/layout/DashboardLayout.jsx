import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useSidebar } from "../../context/SidebarContext";

function DashboardLayout() {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <main
        className={`pt-16 transition-all duration-300 ${
          isOpen ? "md:ml-70 ml-0" : "md:ml-22.5 ml-0"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;