import React from "react";
import StudentStats from "../../components/features/Dashboard/StudentDashboard/StudentStats";
import MyTasks from "../../components/features/Dashboard/StudentDashboard/MyTasks";
import MyProjects from "../../components/features/Dashboard/StudentDashboard/MyProjects";
import Announcements from "../../components/features/Dashboard/StudentDashboard/Announcements";
import RecentResources from "../../components/features/Dashboard/StudentDashboard/RecentResources";

function StudentDashboard() {
  return (
    <div className="p-3 space-y-3 mt-5   mx-auto min-h-screen">
      {/* Top Header */}
      <div>
       
        <div className="text-[11px] text-gray-400 font-medium mt-0.5">
          Wednesday, August 12, 2026
        </div>

        <h1 className="text-lg font-bold text-gray-900 mt-1 flex items-center gap-2">
          Welcome back, Sara 👋
        </h1>

        <p className="text-xs text-gray-500 font-medium mt-0.5">
          Here's your learning overview today.
        </p>
      </div>

      {/* Top Stats Cards */}
      <StudentStats />

      {/* Row 1: 3 Column Cards (My Tasks | My Projects | Announcements) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <MyTasks />
        <MyProjects />
        <Announcements />
      </div>

      {/* Row 2: Recent Resources Section (Isolated Row) */}
      <div>
        <RecentResources />
      </div>
    </div>
  );
}

export default StudentDashboard;
