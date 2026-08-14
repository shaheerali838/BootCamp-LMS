import React from "react";
import SystemStats from "../../components/features/Dashboard/SuperAdminDashboard/SystemStats";
import SystemOverview from "../../components/features/Dashboard/SuperAdminDashboard/SystemOverview";
import QuickActions from "../../components/features/Dashboard/SuperAdminDashboard/QuickActions";
import RecentRegistrations from "../../components/features/Dashboard/SuperAdminDashboard/RecentRegistrations";
import SystemActivity from "../../components/features/Dashboard/SuperAdminDashboard/SystemActivity";

function SuperAdminDashboard() {
  return (
    <div className="p-5 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 rounded-2xl p-6 text-white shadow-sm">
        <div className="max-w-3xl">
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            SuperAdmin Control Center
          </span>
          <h1 className="text-2xl md:text-3xl font-bold mt-2">
            Welcome to SMIT System Administration 👑
          </h1>
          <p className="text-purple-100 text-sm mt-1">
            Full system authority: Manage admins, mentors, students, batches, projects, sprints, system configurations, and audit logs.
          </p>
        </div>
      </div>

      {/* 6 Stat Cards */}
      <SystemStats />

      {/* Quick Action Buttons */}
      <QuickActions />

      {/* Main Charts & Feed Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
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
