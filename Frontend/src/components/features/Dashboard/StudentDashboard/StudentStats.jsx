import React from "react";
import { FiCheckCircle, FiShare2, FiFolder, FiVolume2 } from "react-icons/fi";
import { useAttendance } from "../../../../context/AttendanceContext";
import { useTasks } from "../../../../context/TaskContext";
import { useTeamProject } from "../../../../context/TeamProjectContext";
function StudentStats() {
  const { attendance } = useAttendance();
  const { tasks } = useTasks();
  // UPDATED: Pull projects from TeamProjectContext API
  const { projects = [] } = useTeamProject();
  
  const studentRecord = attendance.find(
    (item) => item.rollNo === "SMIT-1001" || item.id === 1
  );

  let attendancePct = 92;
  if (studentRecord && studentRecord.attendance && studentRecord.attendance.length > 0) {
    const presentCount = studentRecord.attendance.filter(
      (a) => a.status === "Present" || a.status === "Late"
    ).length;
    attendancePct = Math.round((presentCount / studentRecord.attendance.length) * 100);
  }

  const tasksCount = tasks.length || 6;
  const projectsCount = projects.length || 3;
  const announcementsCount = 2;


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
          className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex items-center justify-between"
        >
          <div>
            <div className="text-2xl font-bold text-gray-900 tracking-tight">
              {stat.value}
            </div>
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-1">
              {stat.label}
            </div>
          </div>
          <div
            className={`w-10 h-10 rounded-full border ${stat.iconBg} flex items-center justify-center shrink-0`}
          >
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}

export default StudentStats;
