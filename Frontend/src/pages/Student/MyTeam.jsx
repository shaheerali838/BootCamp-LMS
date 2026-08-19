import React, { useEffect, useState } from "react";
import {
  FiUsers,
  FiUserCheck,
  FiEye,
  FiX,
  FiCalendar,
  FiClock,
  FiFolder,
  FiUser,
} from "react-icons/fi";

import { useTeamProject } from "../../context/TeamProjectContext";
import { useStudent } from "../../context/AcademicContext";
import { useAuth } from "../../context/AuthContext";

function MyTeam() {
  const { user } = useAuth();
  const { teams = [], projects = [], fetchTeams, fetchProjects } = useTeamProject();
  const { students = [], fetchStudents } = useStudent();

  // ================= DATA FETCH ON MOUNT =================
  useEffect(() => {
    if (fetchTeams) fetchTeams();
    if (fetchProjects) fetchProjects();
    if (fetchStudents) fetchStudents();
  }, [fetchTeams, fetchProjects, fetchStudents]);
  // =======================================================

  const studentId = String(user?._id || user?.id || "");
  const studentRoll = String(user?.rollNumber || user?.rollNo || "").toLowerCase();
  const studentEmail = String(user?.email || "").toLowerCase();
  const studentName = String(
    user?.firstName ? `${user.firstName} ${user.lastName || ""}` : user?.name || ""
  ).trim().toLowerCase();

  // Helper to resolve student name from populated object, student ID lookup, or raw string
  const resolveStudentName = (raw) => {
    if (!raw) return "Unassigned";
    if (typeof raw === "object" && raw) {
      const fullName = `${raw.firstName || ""} ${raw.lastName || ""}`.trim();
      if (fullName) return fullName;
      if (raw.name) return raw.name;
      if (raw.email) return raw.email;
    }
    const rawId = String(raw?._id || raw?.id || raw || "");
    const found = students.find((s) => String(s._id || s.id) === rawId);
    if (found) {
      const fullName = `${found.firstName || ""} ${found.lastName || ""}`.trim();
      if (fullName) return fullName;
      return found.name || found.email || "Team Lead";
    }
    if (typeof raw === "string" && raw.length > 2 && !raw.match(/^[0-9a-fA-F]{24}$/)) {
      return raw;
    }
    return "Team Lead Assigned";
  };

  // Helper to resolve student member details
  const resolveMemberDetails = (m) => {
    if (!m) return { name: "Team Member", roll: "" };
    if (typeof m === "object" && m) {
      const name =
        `${m.firstName || ""} ${m.lastName || ""}`.trim() ||
        m.name ||
        m.label ||
        m.email ||
        "Team Member";
      const roll = m.rollNumber || m.rollNo || m.email || "";
      return { name, roll };
    }
    const rawId = String(m);
    const found = students.find((s) => String(s._id || s.id) === rawId);
    if (found) {
      const name =
        `${found.firstName || ""} ${found.lastName || ""}`.trim() ||
        found.name ||
        found.email ||
        "Team Member";
      const roll = found.rollNumber || found.rollNo || found.email || "";
      return { name, roll };
    }
    if (typeof m === "string" && !m.match(/^[0-9a-fA-F]{24}$/)) {
      return { name: m, roll: "" };
    }
    return { name: "Team Member", roll: "" };
  };

  // Check if logged-in student is part of the given team (as leader or member)
  const isStudentInTeam = (team) => {
    if (!studentId && !studentRoll && !studentEmail && !studentName) return false;

    // Check if team lead
    const rawLead = team.teamLead || team.lead || team.teamLeadId;
    const leadId = String(rawLead?._id || rawLead?.id || rawLead || "");
    const leadRoll = String(rawLead?.rollNumber || rawLead?.rollNo || "").toLowerCase();
    const leadEmail = String(rawLead?.email || "").toLowerCase();
    const leadName = String(
      rawLead?.firstName
        ? `${rawLead.firstName} ${rawLead.lastName || ""}`
        : rawLead?.name || rawLead || ""
    ).trim().toLowerCase();

    if (studentId && leadId && leadId === studentId) return true;
    if (studentRoll && leadRoll && leadRoll === studentRoll) return true;
    if (studentEmail && leadEmail && leadEmail === studentEmail) return true;
    if (studentName && leadName && (leadName === studentName || leadName.includes(studentName))) return true;

    // Check if member
    if (Array.isArray(team.members)) {
      return team.members.some((m) => {
        const mId = String(m?._id || m?.id || m?.studentId || m || "");
        const mRoll = String(m?.rollNumber || m?.rollNo || "").toLowerCase();
        const mEmail = String(m?.email || "").toLowerCase();
        const mName = String(
          m?.firstName ? `${m.firstName} ${m.lastName || ""}` : m?.name || m || ""
        ).trim().toLowerCase();

        return (
          (studentId && mId && mId === studentId) ||
          (studentRoll && mRoll && mRoll === studentRoll) ||
          (studentEmail && mEmail && mEmail === studentEmail) ||
          (studentName && mName && (mName === studentName || mName.includes(studentName)))
        );
      });
    }
    return false;
  };

  // Filter teams to only those where the current student is lead or member
  const myAssignedTeams = teams.filter(isStudentInTeam);

  // If student is assigned to teams, default to showing them, else show all teams
  const [viewFilter, setViewFilter] = useState("my"); // "my" or "all"
  const studentTeams =
    viewFilter === "my" && myAssignedTeams.length > 0
      ? myAssignedTeams
      : teams;

  const getBatchName = (b) => {
    if (!b) return "Batch";
    if (typeof b === "object") return b.batchName || b.name || "Batch";
    return String(b);
  };

  const studentBatch = getBatchName(students[0]?.batch);

  // Store selected team for details modal
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Pagination
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(studentTeams.length / itemsPerPage);

  const validPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const currentTeams = studentTeams.slice(
    (validPage - 1) * itemsPerPage,
    validPage * itemsPerPage
  );

  // ================= FIND PROJECT ASSIGNED TO A TEAM (FIXED) =================
  const getTeamProject = (team) => {
    const tId = String(team._id || team.id);
    return projects.find((project) => {
      const pTeamId =
        project.teamId?._id ||
        project.teamId?.id ||
        (typeof project.teamId === "string" ? project.teamId : null) ||
        project.team?._id ||
        project.team?.id ||
        (typeof project.team === "string" ? project.team : null) ||
        (typeof project.batch === "object" ? project.batch?._id : project.batch) ||
        project.batchId;
      return String(pTeamId) === tId;
    });
  };
  // ===========================================================================

  // ADDED: Format project dates
  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ADDED: Calculate project duration
  const getDuration = (startDate, deadline) => {
    if (!startDate || !deadline) return "Not available";

    const start = new Date(startDate);
    const end = new Date(deadline);

    const days = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    return days >= 0 ? `${days} days` : "Invalid dates";
  };

  return (
    <div className="p-5 space-y-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
          <span>Student Portal</span>
          <span>›</span>
          <span className="font-semibold text-gray-800">
            Teams
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Student Project Teams
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              View-only overview of assigned project teams, leaders, and team members.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View filter tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setViewFilter("my");
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  viewFilter === "my"
                    ? "bg-white text-[#0476b9] shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                My Teams ({myAssignedTeams.length})
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewFilter("all");
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  viewFilter === "all"
                    ? "bg-white text-[#0476b9] shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All Teams ({teams.length})
              </button>
            </div>

            <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 font-medium shrink-0">
              Read Only
            </span>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      {studentTeams.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center text-gray-500 text-sm">
          <FiUsers
            size={36}
            className="mx-auto text-gray-300 mb-3"
          />

          <h3 className="text-base font-bold text-gray-700">
            {viewFilter === "my" ? "No Teams Assigned To You" : "No Teams Created"}
          </h3>

          <p className="text-xs text-gray-400 mt-1">
            {viewFilter === "my"
              ? "You are not currently assigned as leader or member to any team. Switch to 'All Teams' to view all cohort teams."
              : "No teams created by Super Admin or Admin yet."}
          </p>

          {viewFilter === "my" && teams.length > 0 && (
            <button
              type="button"
              onClick={() => setViewFilter("all")}
              className="mt-4 bg-[#0476b9] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#03669f] transition"
            >
              View All Teams ({teams.length})
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentTeams.map((team) => {
              const rawLead = team.teamLead || team.lead || team.teamLeadId;
              const leadDisplayName = resolveStudentName(rawLead);
              const membersList = Array.isArray(team.members)
                ? team.members
                : typeof team.members === "string"
                ? team.members.split(",").map((m) => m.trim())
                : [];

              return (
                <div
                  key={team.id || team._id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                        <FiUsers size={18} />
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                          {team.teamName || team.name || "Untitled Team"}
                        </h3>

                        <p className="text-[11px] text-gray-400">
                          {isStudentInTeam(team) ? (
                            <span className="text-emerald-600 font-semibold">● Your Team</span>
                          ) : (
                            `Created: ${team.createdAt ? new Date(team.createdAt).toLocaleDateString() : "Active"}`
                          )}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full border border-purple-100 font-semibold">
                      {getBatchName(team.batch || studentBatch)}
                    </span>
                  </div>

                  {team.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {team.description}
                    </p>
                  )}

                  {/* Team Leader Box */}
                  <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium flex items-center gap-1.5">
                      <FiUserCheck className="text-blue-600" size={15} />
                      Team Lead:
                    </span>

                    <span className="font-bold text-[#0476b9]">
                      {leadDisplayName}
                    </span>
                  </div>

                  {/* Team Members List */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span className="font-semibold text-gray-700">
                        Team Members
                      </span>

                      <span>
                        {membersList.length + (rawLead ? 1 : 0)} Total
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {/* Highlighted Lead Pill */}
                      {rawLead && (
                        <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1">
                          <FiUser size={11} />
                          {leadDisplayName} (Lead)
                        </span>
                      )}

                      {/* Member Pills */}
                      {membersList.length > 0 ? (
                        membersList.map((member, idx) => {
                          const { name } = resolveMemberDetails(member);
                          return (
                            <span
                              key={idx}
                              className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-[11px] font-medium"
                            >
                              {name}
                            </span>
                          );
                        })
                      ) : !rawLead ? (
                        <span className="text-xs text-gray-400">
                          No members assigned
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* View Team Details Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedTeam(team)}
                    className="w-full bg-[#0476b9] text-white py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#03669f] transition cursor-pointer"
                  >
                    <FiEye size={15} />
                    View Details
                  </button>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) => Math.max(p - 1, 1))
                }
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold transition ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(p + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Team Details Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedTeam.teamName || selectedTeam.name || "Team Details"}
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Team Overview & Assigned Projects
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTeam(null)}
                className="text-gray-500 hover:text-red-500"
              >
                <FiX size={22} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Team Leader */}
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0476b9] text-white flex items-center justify-center font-bold">
                    {resolveStudentName(selectedTeam.teamLead || selectedTeam.lead)
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 font-medium">Team Leader</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">
                      {resolveStudentName(selectedTeam.teamLead || selectedTeam.lead)}
                    </p>
                  </div>
                </div>

                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  LEAD
                </span>
              </div>

              {/* Team Members */}
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                <div className="flex justify-between mb-3">
                  <p className="text-xs font-bold text-gray-700">
                    Team Members
                  </p>

                  <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded border">
                    {selectedTeam.members?.length || 0} Members
                  </span>
                </div>

                {selectedTeam.members?.length > 0 ? (
                  <div className="space-y-2">
                    {selectedTeam.members.map((member, index) => {
                      const { name, roll } = resolveMemberDetails(member);
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-gray-100 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <FiUsers className="text-blue-600 shrink-0" />
                            <span className="font-semibold text-gray-800">
                              {name}
                            </span>
                          </div>

                          {roll && (
                            <span className="text-gray-400 font-mono">
                              {roll}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-2">
                    No members assigned.
                  </p>
                )}
              </div>

              {/* Project Details */}
              {(() => {
                const project = getTeamProject(selectedTeam);

                if (!project) {
                  return (
                    <div className="bg-gray-50 p-5 rounded-xl text-center border border-dashed border-gray-200">
                      <FiFolder
                        size={28}
                        className="mx-auto text-gray-300"
                      />

                      <p className="text-sm text-gray-500 mt-2">
                        No project assigned to this team yet.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <FiFolder className="text-blue-600" />

                      <h3 className="font-bold text-gray-900">
                        {project.projectName || project.name}
                      </h3>
                    </div>

                    {project.description && (
                      <p className="text-xs text-gray-600 mb-3">
                        {project.description}
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                        <FiCalendar className="text-blue-600" />

                        <p className="text-[10px] text-gray-400 mt-1">
                          Start Date
                        </p>

                        <p className="text-xs font-semibold">
                          {formatDate(project.startDate)}
                        </p>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                        <FiCalendar className="text-red-500" />

                        <p className="text-[10px] text-gray-400 mt-1">
                          Deadline
                        </p>

                        <p className="text-xs font-semibold">
                          {formatDate(project.deadline)}
                        </p>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                        <FiClock className="text-purple-600" />

                        <p className="text-[10px] text-gray-400 mt-1">
                          Duration
                        </p>

                        <p className="text-xs font-semibold">
                          {getDuration(
                            project.startDate,
                            project.deadline
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 bg-white p-2.5 rounded-lg border border-blue-100">
                      <span className="text-xs text-gray-500">
                        Project Status
                      </span>

                      <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-0.5 rounded-full">
                        {project.status || "Pending"}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="p-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setSelectedTeam(null)}
                className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 cursor-pointer transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyTeam;