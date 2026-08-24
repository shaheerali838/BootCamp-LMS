import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useSidebar } from "../../context/SidebarContext";
import { ActionLoadingWidget } from "../common/Skeleton";

function DashboardLayout() {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Sidebar />
      <Navbar />
      <main
        className={`pt-16 min-h-screen transition-all duration-300 w-full max-w-full overflow-x-hidden ${
          isOpen ? "md:ml-70 ml-0" : "md:ml-22.5 ml-0"
        }`}
      >
        <div className="w-full max-w-full">
          <Outlet />
        </div>
      </main>
      {/* Global Action Loading Floating Widget */}
      <ActionLoadingWidget />
    </div>
  );
}

export default DashboardLayout;