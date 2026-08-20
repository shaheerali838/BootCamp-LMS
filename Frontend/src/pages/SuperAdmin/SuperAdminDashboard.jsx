import React from "react";
import SystemStats from "../../components/features/Dashboard/SuperAdminDashboard/SystemStats";
import SystemOverview from "../../components/features/Dashboard/SuperAdminDashboard/SystemOverview";
import QuickActions from "../../components/features/Dashboard/SuperAdminDashboard/QuickActions";
import RecentRegistrations from "../../components/features/Dashboard/SuperAdminDashboard/RecentRegistrations";
import SystemActivity from "../../components/features/Dashboard/SuperAdminDashboard/SystemActivity";

function SuperAdminDashboard() {
  return (
    <div className="p-3 space-y-3">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-[#0476b9] via-[#056fa8] to-[#034d78]  rounded-xl p-4 text-white shadow-sm">
        <div className="max-w-3xl">
          <span className="bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
            SuperAdmin Control Center
          </span>
          <h1 className="text-lg md:text-xl font-bold mt-1">
            Welcome to SMIT System Administration 👑
          </h1>
          <p className="text-purple-100 text-xs mt-0.5">
            Full system authority: Manage admins, mentors, students, batches,
            projects, sprints, system configurations, and audit logs.
          </p>
        </div>
      </div>

      {/* 6 Stat Cards */}
      <SystemStats />

      {/* Quick Action Buttons */}
      <QuickActions />

      {/* Main Charts & Feed Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <SystemOverview />
          <RecentRegistrations />
        </div>

        {/* Right Column (1 col) */}
        <div>
          <SystemActivity />
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
