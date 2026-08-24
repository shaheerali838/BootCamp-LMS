import React, { useEffect } from "react";
import {
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiShare2,
  FiClipboard,
} from "react-icons/fi";
import StatCard from "./StatCard";
import { useStudents, useAttendance } from "../../../context/AcademicContext";
import { useTeamProject } from "../../../context/TeamProjectContext";
import { useTasks } from "../../../context/WorkContext";
import { getTodayLocalDate } from "../../../utils/dateHelper";

function StatsGrid() {
  const { students = [], fetchStudents } = useStudents();
  const { getStudentAttendance } = useAttendance();
  const { teams = [], fetchTeams } = useTeamProject();
  const { tasks = [], fetchTasks } = useTasks();

  useEffect(() => {
    if (fetchStudents) fetchStudents();
    if (fetchTeams) fetchTeams();
    if (fetchTasks) fetchTasks();
  }, [fetchStudents, fetchTeams, fetchTasks]);

  const today = getTodayLocalDate();
  const totalStudentsCount = students.length;

  let presentToday = 0;
  let absentToday = 0;
  let onLeaveToday = 0;

  students.forEach((s) => {
    const sid = s._id || s.id;
    const history = getStudentAttendance(sid) || [];
    const todayRecord = history.find((rec) => rec.date === today);
    if (todayRecord) {
      if (todayRecord.status === "Present" || todayRecord.status === "Late") presentToday++;
      else if (todayRecord.status === "Absent") absentToday++;
      else if (todayRecord.status === "Leave") onLeaveToday++;
    }
  });

  const totalTeamsCount = teams.length;
  const pendingTasksCount = tasks.filter(
    (t) => t.status === "Pending" || t.status === "In Progress"
  ).length;

  const data = [
    {
      id: 1,
      label: "TOTAL STUDENTS",
      value: String(totalStudentsCount),
      icon: <FiUsers size={18} />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      path: "/students",
    },
    {
      id: 2,
      label: "PRESENT TODAY",
      value: totalStudentsCount > 0 ? `${presentToday}/${totalStudentsCount}` : "0",
      icon: <FiCheckCircle size={18} />,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      path: "/attendance",
    },
    {
      id: 3,
      label: "ABSENT TODAY",
      value: totalStudentsCount > 0 ? `${absentToday}/${totalStudentsCount}` : "0",
      icon: <FiXCircle size={18} />,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      path: "/attendance",
    },
    {
      id: 4,
      label: "ON LEAVE",
      value: String(onLeaveToday),
      icon: <FiCalendar size={18} />,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      path: "/attendance",
    },
    {
      id: 5,
      label: "TOTAL TEAMS",
      value: String(totalTeamsCount),
      icon: <FiShare2 size={18} />,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      path: "/teams",
    },
    {
      id: 6,
      label: "PENDING TASKS",
      value: String(pendingTasksCount),
      icon: <FiClipboard size={18} />,
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-600",
      path: "/tasks",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
      {data.map((stat) => (
        <StatCard
          key={stat.id}
          icon={stat.icon}
          iconBg={stat.iconBg}
          iconColor={stat.iconColor}
          value={stat.value}
          label={stat.label}
          path={stat.path}
        />
      ))}
    </div>
  );
}

export default StatsGrid;