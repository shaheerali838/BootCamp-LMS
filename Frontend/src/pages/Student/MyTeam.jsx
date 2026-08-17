import React, { useEffect, useState } from "react";
import {
  FiUsers,
  FiUserCheck,
  FiEye,
  FiX,
  FiCalendar,
  FiClock,
  FiFolder,
} from "react-icons/fi";

import { useTeamProject } from "../../context/TeamProjectContext";
import { useStudent } from "../../context/AcademicContext";

function MyTeam() {
  // CHANGED: Get projects from Context API
  const { teams = [], projects = [] } = useTeamProject();
  const { students = [] } = useStudent();

  const getBatchName = (b) => {
    if (!b) return "Batch 11";
    if (typeof b === "object") return b.batchName || b.name || "Batch 11";
    return String(b);
  };

  const studentBatch = getBatchName(students[0]?.batch);

  // ADDED: Store selected team for details modal
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Pagination
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(teams.length / itemsPerPage);

  const validPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const currentTeams = teams.slice(
    (validPage - 1) * itemsPerPage,
    validPage * itemsPerPage
  );

  // ADDED: Find project assigned to a team
  const getTeamProject = (team) => {
    return projects.find(
      (project) =>
        String(project.teamId || (typeof project.batch === "object" ? project.batch?._id : project.batch)) ===
        String(team._id || team.id)
    );
  };

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
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Student Project Teams
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              View-only overview of assigned project teams, leaders, and team members.
            </p>
          </div>

          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-medium">
            Read Only Access
          </span>
        </div>
      </div>

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center text-gray-500 text-sm">
          <FiUsers
            size={36}
            className="mx-auto text-gray-300 mb-3"
          />

          <h3 className="text-base font-bold text-gray-700">
            No Teams Created
          </h3>

          <p className="text-xs text-gray-400 mt-1">
            No teams created by Super Admin or Admin yet.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentTeams.map((team) => {
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

                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <FiUsers size={18} />
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-gray-900">
                          {team.name}
                        </h3>

                        <p className="text-[11px] text-gray-400">
                          Created: {team.createdAt || "Active"}
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

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium flex items-center gap-1.5">
                      <FiUserCheck className="text-blue-600" />
                      Team Lead:
                    </span>

                    <span className="font-bold text-gray-900">
                      {team.lead || "Unassigned"}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span className="font-semibold text-gray-700">
                        Team Members
                      </span>

                      <span>
                        {membersList.length} Assigned
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {membersList.length > 0 ? (
                        membersList.map((member, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-[11px] font-medium"
                          >
                            {typeof member === "object"
                              ? member.name || member.label
                              : member}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">
                          No members assigned
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ADDED: View team details button */}
                  <button
                    type="button"
                    onClick={() => setSelectedTeam(team)}
                    className="w-full bg-[#0476b9] text-white py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#03669f] transition"
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

      {/* ADDED: Team details modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedTeam.name}
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Team Details
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
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">
                  Team Leader
                </p>

                <p className="font-semibold text-gray-800 mt-1">
                  {selectedTeam.lead || "Unassigned"}
                </p>
              </div>

              {/* Team Members */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between mb-2">
                  <p className="text-xs text-gray-500">
                    Team Members
                  </p>

                  <span className="text-xs text-gray-400">
                    {selectedTeam.members?.length || 0} Members
                  </span>
                </div>

                {selectedTeam.members?.length > 0 ? (
                  selectedTeam.members.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm py-1"
                    >
                      <FiUsers className="text-blue-600" />

                      <span>
                        {typeof member === "object"
                          ? member.name || member.label
                          : member}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">
                    No members assigned.
                  </p>
                )}
              </div>

              {/* Project Details */}
              {(() => {
                const project = getTeamProject(selectedTeam);

                if (!project) {
                  return (
                    <div className="bg-gray-50 p-5 rounded-lg text-center">
                      <FiFolder
                        size={28}
                        className="mx-auto text-gray-300"
                      />

                      <p className="text-sm text-gray-500 mt-2">
                        No project assigned to this team.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="bg-blue-50 p-4 rounded-lg">

                    <div className="flex items-center gap-2 mb-3">
                      <FiFolder className="text-blue-600" />

                      <h3 className="font-bold text-gray-900">
                        {project.projectName || project.name}
                      </h3>
                    </div>

                    {project.description && (
                      <p className="text-sm text-gray-600 mb-4">
                        {project.description}
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">

                      <div className="bg-white p-3 rounded-lg">
                        <FiCalendar className="text-blue-600" />

                        <p className="text-[11px] text-gray-400 mt-1">
                          Start Date
                        </p>

                        <p className="text-xs font-semibold">
                          {formatDate(project.startDate)}
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded-lg">
                        <FiCalendar className="text-red-500" />

                        <p className="text-[11px] text-gray-400 mt-1">
                          Deadline
                        </p>

                        <p className="text-xs font-semibold">
                          {formatDate(project.deadline)}
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded-lg">
                        <FiClock className="text-purple-600" />

                        <p className="text-[11px] text-gray-400 mt-1">
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

                    <div className="flex items-center justify-between mt-3 bg-white p-3 rounded-lg">
                      <span className="text-xs text-gray-500">
                        Project Status
                      </span>

                      <span className="text-xs font-semibold bg-gray-100 px-3 py-1 rounded-full">
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
                className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200"
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