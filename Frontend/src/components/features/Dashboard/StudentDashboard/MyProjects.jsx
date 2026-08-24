import React from "react";
import { Link } from "react-router-dom";
import { FiFolder } from "react-icons/fi";
import { useTeamProject } from "../../../../context/TeamProjectContext";
import { useAuth } from "../../../../context/AuthContext";

function MyProjects() {
  const { user } = useAuth();
  const { projects = [], teams = [] } = useTeamProject();

  const sid = String(user?._id || user?.id || "");
  const studentRoll = String(user?.rollNumber || user?.rollNo || "").toLowerCase();
  const studentName = String(
    user?.firstName ? `${user.firstName} ${user.lastName || ""}` : user?.name || ""
  ).trim().toLowerCase();

  // Find student teams
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

  const studentProjects = projects.filter((p) => {
    const pTeamId = String(
      p.teamId?._id ||
      p.teamId?.id ||
      (typeof p.teamId === "string" ? p.teamId : "") ||
      p.team?._id ||
      p.team?.id ||
      (typeof p.team === "string" ? p.team : "") ||
      ""
    );
    return pTeamId && studentTeamIds.has(pTeamId);
  });

  const calculateProgress = (status, progress) => {
    if (progress !== undefined && progress !== null) return Number(progress);
    const s = String(status || "").toLowerCase();
    if (s === "completed") return 100;
    if (s === "pending") return 0;
    return 60;
  };

  const displayList = studentProjects.slice(0, 4).map((p) => {
    const status = p.status || "In Progress";
    const progressVal = calculateProgress(status, p.progress);
    const category = typeof p.batch === "object" ? p.batch?.batchName : (p.category || "Team Project");

    return {
      id: p._id || p.id,
      title: p.name || p.projectName || p.title || "Untitled Project",
      subtitle: `${category} • ${status}`,
      progress: progressVal,
      isComplete: progressVal === 100,
    };
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-gray-900">My Projects</h2>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
              {studentProjects.length}
            </span>
          </div>
          <Link
            to="/student/projects"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            View All
          </Link>
        </div>

        {/* List */}
        {displayList.length > 0 ? (
          <div className="space-y-3">
            {displayList.map((item, idx) => {
              const barColor = item.isComplete ? "bg-emerald-500" : "bg-blue-600";

              return (
                <div key={item.id || idx} className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-gray-900 truncate leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 w-28 shrink-0">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-500 w-7 text-right">
                      {item.progress}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center text-gray-400 space-y-1">
            <FiFolder size={22} className="mx-auto opacity-50 text-gray-300" />
            <p className="text-xs">No active projects</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProjects;
