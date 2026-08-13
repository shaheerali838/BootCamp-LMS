import React from "react";
import StudentStats from "../../components/Dashboard/StudentDashboard/StudentStats";
import MySchedule from "../../components/Dashboard/StudentDashboard/MySchedule";
import MyTasks from "../../components/Dashboard/StudentDashboard/MyTasks";
import MyProjects from "../../components/Dashboard/StudentDashboard/MyProjects";
import Announcements from "../../components/Dashboard/StudentDashboard/Announcements";
import RecentResources from "../../components/Dashboard/StudentDashboard/RecentResources";

function StudentDashboard() {
  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
          <span>Home</span>
          <span>/</span>
          <span className="font-bold text-gray-700">Dashboard</span>
        </div>

        <div className="text-xs text-gray-400 font-medium mt-1">
          Wednesday, August 12, 2026
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mt-3 flex items-center gap-2">
          Welcome back, Sara 👋
        </h1>

        <p className="text-xs text-gray-500 font-medium mt-0.5">
          Here's your learning overview today.
        </p>
      </div>

      {/* Top Stats Cards */}
      <StudentStats />

      {/* 2x2 Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MySchedule />
        <MyTasks />
        <MyProjects />
        <Announcements />
      </div>

      {/* Bottom Recent Resources Section */}
      <RecentResources />
    </div>
  );
}

export default StudentDashboard;
