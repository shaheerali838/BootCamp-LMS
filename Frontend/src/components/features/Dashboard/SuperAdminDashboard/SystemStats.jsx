import React, { useEffect } from "react";
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
  const { admins = [], fetchAdmins } = useAdmins();
  const { students = [] } = useStudent();
  const { batches = [] } = useBatches();
  const { projects = [], teams = [] } = useTeamProject();

  useEffect(() => {
    if (fetchAdmins) fetchAdmins();
  }, [fetchAdmins]);

  const superAdminsCount = admins.filter((a) => {
    const r = (a.role || "").toUpperCase();
    return r === "SUPER_ADMIN" || r === "SUPERADMIN" || a.role === "Super Admin";
  }).length;

  const adminsMentorsCount = admins.filter((a) => {
    const r = (a.role || "").toUpperCase();
    return r !== "SUPER_ADMIN" && r !== "SUPERADMIN" && a.role !== "Super Admin";
  }).length;

  const studentsCount = students.length;
  const batchesCount = batches.length;
  const projectsCount = projects.length;
  const teamsCount = teams.length;

  const stats = [
    {
      value: superAdminsCount,
      label: "Super Admins",
      icon: <FiShield size={18} />,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      path: "/superadmin/super-admins",
    },
    {
      value: adminsMentorsCount,
      label: "Admins / Mentors",
      icon: <FiUserCheck size={18} />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      path: "/superadmin/admins",
    },
    {
      value: studentsCount,
      label: "Students",
      icon: <FiUsers size={18} />,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      path: "/superadmin/students",
    },
    {
      value: batchesCount,
      label: "Batches",
      icon: <FiLayers size={18} />,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      path: "/superadmin/batches",
    },
    {
      value: teamsCount,
      label: "Teams",
      icon: <FiGrid size={18} />,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      path: "/superadmin/teams",
    },
    {
      value: projectsCount,
      label: "Projects",
      icon: <FiFolder size={18} />,
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
      path: "/superadmin/projects",
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
          path={stat.path}
        />
      ))}
    </div>
  );
}

export default SystemStats;
