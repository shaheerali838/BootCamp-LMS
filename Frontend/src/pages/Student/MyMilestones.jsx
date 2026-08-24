import React, { useState, useEffect } from "react";
import { FiCheckSquare, FiClock, FiTarget, FiCheckCircle, FiFolder, FiCalendar } from "react-icons/fi";
import { useMilestones } from "../../context/WorkContext";
import { useTeamProject } from "../../context/TeamProjectContext";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/dateHelper";

function MyMilestones() {
  const { user } = useAuth();
  const { milestones = [], fetchMilestones } = useMilestones();
  const { projects = [], teams = [], fetchProjects, fetchTeams } = useTeamProject();
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (fetchMilestones) fetchMilestones();
    if (fetchProjects) fetchProjects();
    if (fetchTeams) fetchTeams();
  }, [fetchMilestones, fetchProjects, fetchTeams]);

  const studentId = String(user?._id || user?.id || "");
  const studentRoll = String(user?.rollNumber || user?.rollNo || "").toLowerCase();
  const studentName = String(
    user?.firstName ? `${user.firstName} ${user.lastName || ""}` : user?.name || ""
  ).trim().toLowerCase();

  // Find teams student is enrolled in
  const studentTeams = teams.filter((team) => {
    if (!studentId && !studentRoll && !studentName) return false;

    const rawLead = team.teamLead || team.lead || team.teamLeadId;
    const leadId = String(rawLead?._id || rawLead?.id || rawLead || "");
    const leadRoll = String(rawLead?.rollNumber || rawLead?.rollNo || "").toLowerCase();
    const leadName = String(
      rawLead?.firstName ? `${rawLead.firstName} ${rawLead.lastName || ""}` : rawLead?.name || rawLead || ""
    ).trim().toLowerCase();

    if (studentId && leadId && leadId === studentId) return true;
    if (studentRoll && leadRoll && leadRoll === studentRoll) return true;
    if (studentName && leadName && (leadName === studentName || leadName.includes(studentName))) return true;

    if (Array.isArray(team.members)) {
      return team.members.some((m) => {
        const mId = String(m?._id || m?.id || m?.studentId || m || "");
        const mRoll = String(m?.rollNumber || m?.rollNo || "").toLowerCase();
        const mName = String(
          m?.firstName ? `${m.firstName} ${m.lastName || ""}` : m?.name || m || ""
        ).trim().toLowerCase();

        return (
          (studentId && mId && mId === studentId) ||
          (studentRoll && mRoll && mRoll === studentRoll) ||
          (studentName && mName && (mName === studentName || mName.includes(studentName)))
        );
      });
    }
    return false;
  });

  const studentTeamIds = new Set(studentTeams.map((t) => String(t._id || t.id)));

  // Find projects assigned to student teams
  const myAssignedProjects = projects.filter((project) => {
    const projTeamId = String(
      project.teamId?._id ||
      project.teamId?.id ||
      (typeof project.teamId === "string" ? project.teamId : "") ||
      project.team?._id ||
      project.team?.id ||
      (typeof project.team === "string" ? project.team : "") ||
      ""
    );
    return projTeamId && studentTeamIds.has(projTeamId);
  });

  const myProjectIds = new Set(myAssignedProjects.map((p) => String(p._id || p.id)));

  // Filter milestones for student assigned projects
  const myMilestones = milestones.filter((m) => {
    const mProjId = String(m.projectId?._id || m.projectId?.id || (typeof m.projectId === "string" ? m.projectId : "") || "");
    if (myProjectIds.size > 0 && mProjId) {
      return myProjectIds.has(mProjId);
    }
    return false;
  });

  const getProjectName = (projectId) => {
    const rawId = String(projectId?._id || projectId?.id || projectId || "");
    const project = projects.find((p) => String(p._id || p.id) === rawId);
    return project?.projectName || project?.name || "Capstone Project";
  };

  const filteredMilestones = myMilestones.filter((m) => {
    if (filter === "All") return true;
    return String(m.status || "").toLowerCase() === filter.toLowerCase();
  });

  const total = myMilestones.length;
  const completed = myMilestones.filter((m) => String(m.status || "").toLowerCase() === "completed").length;
  const inProgress = myMilestones.filter((m) => String(m.status || "").toLowerCase() !== "completed").length;

  return (
    <div className="p-5 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Student Portal</span>
          <span>›</span>
          <span className="font-semibold text-gray-800">Project Milestones</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Project Milestones</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track goals, progress, and upcoming deadlines for your assigned capstone projects
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs uppercase font-bold text-gray-400">Total Milestones</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">{total}</h2>
          </div>
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
            <FiTarget size={22} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs uppercase font-bold text-gray-400">Completed</p>
            <h2 className="text-2xl font-bold text-emerald-600 mt-1">{completed}</h2>
          </div>
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
            <FiCheckCircle size={22} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs uppercase font-bold text-gray-400">Pending / In Progress</p>
            <h2 className="text-2xl font-bold text-amber-600 mt-1">{inProgress}</h2>
          </div>
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100">
            <FiClock size={22} />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-3">
        {["All", "Pending", "In Progress", "Completed"].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
              filter.toLowerCase() === status.toLowerCase()
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Milestones List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMilestones.map((m) => {
          const mStatus = (m.status || "Pending").trim();
          return (
            <div
              key={m._id || m.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:border-blue-300 transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 inline-flex items-center gap-1">
                      <FiFolder size={11} /> {getProjectName(m.projectId)}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-2.5">
                      {m.title || m.milestoneName || "Milestone Goal"}
                    </h3>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                      mStatus.toLowerCase() === "completed"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : mStatus.toLowerCase() === "in progress"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    ● {mStatus}
                  </span>
                </div>

                {m.description && (
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">{m.description}</p>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <FiCalendar className="text-gray-400" />
                  <span>Target Due Date: <strong className="text-gray-800">{formatDate(m.dueDate)}</strong></span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredMilestones.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
            <FiCheckSquare size={36} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No milestones found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyMilestones;
