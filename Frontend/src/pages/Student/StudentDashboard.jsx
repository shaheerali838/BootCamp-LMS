import React from "react";
import StudentStats from "../../components/features/Dashboard/StudentDashboard/StudentStats";
import MyTasks from "../../components/features/Dashboard/StudentDashboard/MyTasks";
import MyProjects from "../../components/features/Dashboard/StudentDashboard/MyProjects";
import Announcements from "../../components/features/Dashboard/StudentDashboard/Announcements";
import RecentResources from "../../components/features/Dashboard/StudentDashboard/RecentResources";
import { useAuth } from "../../context/AuthContext";

function StudentDashboard() {
  const { user } = useAuth();
  const studentName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.name ||
      "Student"
    : "Student";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const avatar =
    user?.profilePicture || user?.profileImage || user?.image || "";

  return (
    <div className="p-3 space-y-4 mt-2 mx-auto min-h-screen max-w-full overflow-x-hidden">
      {/* Top Header */}
      <div className="flex items-center gap-3.5 bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs min-w-0">
        <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold text-lg overflow-hidden shrink-0 shadow-sm border border-emerald-100">
          {avatar ? (
            <img
              src={avatar}
              alt={studentName}
              className="w-full h-full object-cover"
            />
          ) : (
            studentName.charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">
            {today}
          </div>

          <h1 className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5 flex items-center gap-2 flex-wrap break-words">
            Welcome back, {studentName} 👋
          </h1>

          <p className="text-xs text-gray-500 font-medium mt-0.5 break-words">
            Here's your live training overview and today's schedule.
          </p>
        </div>
      </div>

      {/* Top Stats Cards */}
      <StudentStats />

      {/* Row 1: 3 Column Cards (My Tasks | My Projects | Announcements) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <MyTasks />
        <MyProjects />
        <Announcements />
      </div>

      {/* Row 2: Recent Resources Section */}
      <div>
        <RecentResources />
      </div>
    </div>
  );
}

export default StudentDashboard;
