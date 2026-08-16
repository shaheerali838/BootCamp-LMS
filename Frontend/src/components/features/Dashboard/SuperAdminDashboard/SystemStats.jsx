import React from "react";
import StatCard from "../../Dashboard/StatCard";
import { useAdmins } from "../../../../context/SystemContext";
import { useStudent, useBatches } from "../../../../context/AcademicContext";
import { useTeamProject } from "../../../../context/TeamProjectContext";

import {
  FiShield,
  FiUserCheck,
  FiUsers,
  FiLayers,
  FiGrid,
  FiFolder,
} from "react-icons/fi";

function SystemStats() {
  const { admins } = useAdmins();
  const { students } = useStudent();
  const { batches } = useBatches();
  // UPDATED: Access projects and teams from TeamProjectContext API
  const { projects = [], teams = [] } = useTeamProject();

  const superAdminsCount = admins.filter(
    (a) => a.role === "Super Admin"
  ).length;

  const adminsMentorsCount = admins.filter(
    (a) => a.role === "Admin" || a.role === "Mentor"
  ).length;

  const studentsCount = students.length;
  const batchesCount = batches.length;
  const projectsCount = projects.length;

  const teamsCount = teams.length || new Set(students.map((s) => s.team)).size || 4;


  const stats = [
    {
      value: superAdminsCount,
      label: "Super Admins",
      icon: <FiShield size={18} />,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      value: adminsMentorsCount,
      label: "Admins / Mentors",
      icon: <FiUserCheck size={18} />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      value: studentsCount,
      label: "Students",
      icon: <FiUsers size={18} />,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      value: batchesCount,
      label: "Batches",
      icon: <FiLayers size={18} />,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      value: teamsCount,
      label: "Teams",
      icon: <FiGrid size={18} />,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      value: projectsCount,
      label: "Projects",
      icon: <FiFolder size={18} />,
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((stat, idx) => (
        <StatCard
          key={idx}
          value={stat.value}
          label={stat.label}
          icon={stat.icon}
          iconBg={stat.iconBg}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
}

export default SystemStats;
