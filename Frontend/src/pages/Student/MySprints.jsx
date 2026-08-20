import React, { useState, useEffect } from "react";
import { FiClock, FiActivity, FiCheckCircle, FiCalendar, FiFolder } from "react-icons/fi";
import { useSprints, useTasks } from "../../context/WorkContext";
import { useTeamProject } from "../../context/TeamProjectContext";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/dateHelper";

function MySprints() {
  const { user } = useAuth();
  const { sprints = [], fetchSprints } = useSprints();
  const { projects = [], teams = [], fetchProjects, fetchTeams } = useTeamProject();
  const { tasks = [], fetchTasks } = useTasks();
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (fetchSprints) fetchSprints();
    if (fetchProjects) fetchProjects();
    if (fetchTeams) fetchTeams();
    if (fetchTasks) fetchTasks();
  }, [fetchSprints, fetchProjects, fetchTeams, fetchTasks]);

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

  // Tasks assigned to student or student teams with sprint references
  const myTaskSprintIds = new Set(
    tasks
      .filter((t) => {
        const assignStudentId = String(t.assignedStudentId?._id || t.assignedStudentId || "");
        const assignTeamId = String(t.assignedTeamId?._id || t.assignedTeamId || "");
        return (studentId && assignStudentId === studentId) || (assignTeamId && studentTeamIds.has(assignTeamId));
      })
      .map((t) => String(t.sprintId?._id || t.sprintId || ""))
      .filter(Boolean)
  );

  // Filter sprints belonging to student projects OR student tasks (or all sprints if open workspace)
  const mySprints = sprints.filter((s) => {
    const sProjId = String(s.projectId?._id || s.projectId?.id || (typeof s.projectId === "string" ? s.projectId : "") || "");
    const sId = String(s._id || s.id || "");
    if (myProjectIds.size > 0 && sProjId) {
      return myProjectIds.has(sProjId) || myTaskSprintIds.has(sId);
    }
    if (myTaskSprintIds.size > 0) {
      return myTaskSprintIds.has(sId);
    }
    return true;
  });

  const getProjectName = (projectId) => {
    const rawId = String(projectId?._id || projectId?.id || projectId || "");
    const project = projects.find((p) => String(p._id || p.id) === rawId);
    return project?.projectName || project?.name || "Capstone Project";
  };

  const filteredSprints = mySprints.filter((s) => {
    if (filter === "All") return true;
    const status = String(s.status || "Active").toLowerCase();
    return status === filter.toLowerCase();
  });

  const total = mySprints.length;
  const active = mySprints.filter((s) => String(s.status || "").toLowerCase() === "active").length;
  const completed = mySprints.filter((s) => String(s.status || "").toLowerCase() === "completed").length;

  return (
    <div className="p-5 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Student Portal</span>
          <span>›</span>
          <span className="font-semibold text-gray-800">Sprint Cycles</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Sprint Cycles & Milestones</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor your active sprint timelines, project milestones, and sprint deliverables
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs uppercase font-bold text-gray-400">Total Sprints</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">{total}</h2>
          </div>
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
            <FiActivity size={22} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs uppercase font-bold text-gray-400">Active Sprints</p>
            <h2 className="text-2xl font-bold text-emerald-600 mt-1">{active}</h2>
          </div>
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
            <FiClock size={22} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs uppercase font-bold text-gray-400">Completed Sprints</p>
            <h2 className="text-2xl font-bold text-gray-700 mt-1">{completed}</h2>
          </div>
          <div className="w-11 h-11 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center border border-gray-200">
            <FiCheckCircle size={22} />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-3">
        {["All", "Active", "Completed", "Planning"].map((status) => (
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

      {/* Sprints List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSprints.map((s) => {
          const sStatus = (s.status || "Active").trim();
          return (
            <div
              key={s._id || s.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:border-blue-300 transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 inline-flex items-center gap-1">
                      <FiFolder size={11} /> {getProjectName(s.projectId)}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-2.5">
                      {s.sprintName || s.name || s.title || "Sprint Cycle"}
                    </h3>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                      sStatus.toLowerCase() === "active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : sStatus.toLowerCase() === "completed"
                        ? "bg-gray-100 text-gray-700 border border-gray-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    ● {sStatus}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <FiCalendar className="text-gray-400" />
                  <span>
                    {formatDate(s.startDate)} {s.endDate ? `to ${formatDate(s.endDate)}` : "(Ongoing)"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredSprints.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
            <FiActivity size={36} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No sprints found matching this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MySprints;
