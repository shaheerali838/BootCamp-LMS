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
  const { projects = [], teams = [] } = useTeamProject();
  const { announcements = [] } = useAnnouncement();

  const sid = String(user?._id || user?.id || "");
  const studentRoll = String(user?.rollNumber || user?.rollNo || "").toLowerCase();
  const studentName = String(
    user?.firstName ? `${user.firstName} ${user.lastName || ""}` : user?.name || ""
  ).trim().toLowerCase();

  const attendanceHistory = sid ? getStudentAttendance(sid) : [];

  let attendancePct = 0;
  if (attendanceHistory && attendanceHistory.length > 0) {
    const presentCount = attendanceHistory.filter(
      (a) => a.status === "Present" || a.status === "Late"
    ).length;
    attendancePct = Math.round((presentCount / attendanceHistory.length) * 100);
  }

  // Find student's teams
  const studentTeams = teams.filter((team) => {
    if (!sid && !studentRoll && !studentName) return false;
    const leadId = String(team.teamLead?._id || team.teamLead || team.lead || "");
    const leadName = String(team.teamLead?.name || team.teamLead?.firstName ? `${team.teamLead.firstName} ${team.teamLead.lastName || ""}` : team.lead || "").toLowerCase();
    if (leadId && leadId === sid) return true;
    if (leadName && studentName && leadName.includes(studentName)) return true;

    if (Array.isArray(team.members)) {
      return team.members.some((m) => {
        const mId = String(m._id || m.id || m.studentId || m);
        const mRoll = String(m.rollNumber || m.rollNo || "").toLowerCase();
        const mName = String(m.name || m.firstName ? `${m.firstName} ${m.lastName || ""}` : m).toLowerCase();
        return (
          (sid && mId === sid) ||
          (studentRoll && mRoll === studentRoll) ||
          (studentName && mName && (mName === studentName || mName.includes(studentName)))
        );
      });
    }
    return false;
  });

  const studentTeamIds = new Set(studentTeams.map((t) => String(t._id || t.id)));

  // Filter student projects & tasks
  const studentProjects = projects.filter((p) => {
    const pTeamId = String(p.teamId || (typeof p.batch === "object" ? p.batch?._id : p.batch) || "");
    return pTeamId && studentTeamIds.has(pTeamId);
  });

  const studentTasks = tasks.filter((t) => {
    const assignStudent = String(t.assignedStudentId?._id || t.assignedStudentId || t.assignedStudent || "");
    const assignTeam = String(t.assignedTeamId?._id || t.assignedTeamId || t.assignedTeam || "");
    return (assignStudent && assignStudent === sid) || (assignTeam && studentTeamIds.has(assignTeam));
  });

  const tasksCount = studentTasks.length;
  const projectsCount = studentProjects.length;
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
