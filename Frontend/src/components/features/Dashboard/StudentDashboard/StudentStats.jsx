import React from "react";
import { FiCheckCircle, FiShare2, FiFolder, FiVolume2 } from "react-icons/fi";
import { useAttendance } from "../../../../context/AcademicContext";
import { useTasks } from "../../../../context/WorkContext";
import { useTeamProject } from "../../../../context/TeamProjectContext";
import { useAnnouncement } from "../../../../context/AnnouncementContext";
import { useAuth } from "../../../../context/AuthContext";

function StudentStats() {
  const { user } = useAuth();
  const { getStudentAttendance } = useAttendance();
  const { tasks = [] } = useTasks();
  const { projects = [] } = useTeamProject();
  const { announcements = [] } = useAnnouncement();

  const sid = user?._id || user?.id;
  const attendanceHistory = sid ? getStudentAttendance(sid) : [];

  let attendancePct = 95;
  if (attendanceHistory && attendanceHistory.length > 0) {
    const presentCount = attendanceHistory.filter(
      (a) => a.status === "Present" || a.status === "Late"
    ).length;
    attendancePct = Math.round((presentCount / attendanceHistory.length) * 100);
  }

  const tasksCount = tasks.length;
  const projectsCount = projects.length;
  const announcementsCount = announcements.length;

  const stats = [
    {
      value: `${attendancePct}%`,
      label: "ATTENDANCE",
      icon: <FiCheckCircle size={18} className="text-emerald-500" />,
      iconBg: "bg-emerald-50 border-emerald-100",
    },
    {
      value: tasksCount,
      label: "TASKS ASSIGNED",
      icon: <FiShare2 size={18} className="text-purple-500" />,
      iconBg: "bg-purple-50 border-purple-100",
    },
    {
      value: projectsCount,
      label: "PROJECTS",
      icon: <FiFolder size={18} className="text-blue-500" />,
      iconBg: "bg-blue-50 border-blue-100",
    },
    {
      value: announcementsCount,
      label: "ANNOUNCEMENTS",
      icon: <FiVolume2 size={18} className="text-orange-500" />,
      iconBg: "bg-orange-50 border-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-xs"
        >
          <div>
            <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
              {stat.label}
            </span>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{stat.value}</h3>
          </div>
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.iconBg}`}
          >
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}

export default StudentStats;
