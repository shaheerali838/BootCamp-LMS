import React, { useState, useEffect } from "react";
import {
  FiFolder,
  FiCheckSquare,
  FiUserCheck,
  FiUsers,
  FiCalendar,
  FiX,
} from "react-icons/fi";
import { useTeamProject } from "../../context/TeamProjectContext";
import { useStudent } from "../../context/AcademicContext";

function MyProjects() {
  const { projects = [], teams = [] } = useTeamProject();
  const { students = [] } = useStudent();

  const studentBatch = students[0]?.batch || "Batch 11";

  // Calculate project progress from status
  const calculateProgress = (status, customProgress) => {
    const s = String(status || "")
      .toLowerCase()
      .trim();

    if (s === "pending") return 0;
    if (s === "completed") return 100;

    if (s === "in progress" || s === "inprogress") {
      return customProgress !== undefined ? Number(customProgress) : 50;
    }

    return customProgress !== undefined ? Number(customProgress) : 50;
  };

  // Prepare project data
  const displayList = projects.map((project) => {
    const team = teams.find(
      (team) =>
        String(team.id || team._id) === String(project.teamId || project.batch),
    );

    const status = project.status || "In Progress";

    return {
      id: project.id || project._id,

      title:
        project.name ||
        project.projectName ||
        project.title ||
        "Untitled Project",

      description: project.description || "",

      batch: project.batch || project.category || team?.batch || studentBatch,

      status,

      progress: calculateProgress(status, project.progress),

      teamName: team?.name || "No Team Assigned",

      // Project dates
      startDate: project.startDate || "",
      deadline: project.deadline || "",

      // Team information
      leader: team?.lead || "Unassigned",
      members: Array.isArray(team?.members)
        ? team.members
        : Array.isArray(project.members)
          ? project.members
          : [],
    };
  });

  // --------------------------------
  // PAGINATION
  // --------------------------------

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(displayList.length / itemsPerPage);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const currentProjects = displayList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --------------------------------
  // PROJECT DETAIL MODAL
  // --------------------------------

  const [selectedProject, setSelectedProject] = useState(null);

  const openDetails = (project) => {
    setSelectedProject(project);
  };

  const closeDetails = () => {
    setSelectedProject(null);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "Not set";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-5 space-y-6">
      {/* -------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------- */}

      <div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Student Portal</span>
          <span>›</span>
          <span className="font-semibold text-gray-800">My Projects</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Projects & Milestones
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              View your assigned projects, team members, deadlines, and project
              progress.
            </p>
          </div>

          <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-200 font-medium">
            View Only Access
          </span>
        </div>
      </div>

      {/* -------------------------------- */}
      {/* NO PROJECTS */}
      {/* -------------------------------- */}

      {displayList.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center text-gray-500 text-sm">
          <FiFolder size={36} className="mx-auto text-gray-300 mb-3" />

          <h3 className="text-base font-bold text-gray-700">
            No Projects Found
          </h3>

          <p className="text-xs text-gray-400 mt-1">
            No projects created by Super Admin or Admin yet.
          </p>
        </div>
      ) : (
        <>
          {/* -------------------------------- */}
          {/* PROJECT CARDS */}
          {/* -------------------------------- */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 hover:shadow-md transition"
              >
                {/* STATUS + BATCH */}

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                    {project.batch}
                  </span>

                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      project.status.toLowerCase() === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : project.status.toLowerCase() === "pending"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                {/* PROJECT NAME */}

                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FiFolder className="text-blue-600 shrink-0" />

                    <span>{project.title}</span>
                  </h3>

                  {project.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    Assigned Team:{" "}
                    <strong className="text-gray-700">
                      {project.teamName}
                    </strong>
                  </p>
                </div>

                {/* TEAM LEADER */}

                <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <FiUserCheck className="text-blue-600" />

                  <div>
                    <p className="text-[11px] text-gray-400">Team Leader</p>

                    <p className="text-xs font-semibold text-gray-800">
                      {project.leader}
                    </p>
                  </div>
                </div>

                {/* PROGRESS */}

                <div>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Progress Completion</span>

                    <span className="font-bold text-gray-800">
                      {project.progress}%
                    </span>
                  </div>

                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        project.progress === 100
                          ? "bg-emerald-500"
                          : project.progress === 0
                            ? "bg-gray-300"
                            : "bg-blue-600"
                      }`}
                      style={{
                        width: `${project.progress}%`,
                      }}
                    />
                  </div>
                </div>

                {/* DATES */}

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="flex items-center gap-1 text-gray-400">
                      <FiCalendar size={13} />

                      <span className="text-[10px]">Start Date</span>
                    </div>

                    <p className="text-xs font-semibold text-gray-700 mt-1">
                      {formatDate(project.startDate)}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="flex items-center gap-1 text-gray-400">
                      <FiCalendar size={13} />

                      <span className="text-[10px]">Deadline</span>
                    </div>

                    <p className="text-xs font-semibold text-gray-700 mt-1">
                      {formatDate(project.deadline)}
                    </p>
                  </div>
                </div>
                {/* VIEW DETAILS BUTTON */}

                <button
                  type="button"
                  onClick={() => openDetails(project)}
                  className="w-full bg-[#0476b9] text-white py-2 rounded-lg text-xs font-semibold hover:bg-[#03669f] transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          {/* -------------------------------- */}
          {/* PAGINATION */}
          {/* -------------------------------- */}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
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
                ),
              )}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
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
      {selectedProject && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedProject.title}
                </h2>

                <p className="text-xs text-gray-500 mt-1">Project Details</p>
              </div>

              <button
                type="button"
                onClick={closeDetails}
                className="text-gray-400 hover:text-red-500"
              >
                <FiX size={22} />
              </button>
            </div>

            {/* MODAL CONTENT */}

            <div className="p-5 space-y-4">
              {/* DESCRIPTION */}

              <div>
                <p className="text-xs font-semibold text-gray-500">
                  Description
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  {selectedProject.description || "No description available."}
                </p>
              </div>

              {/* TEAM */}

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FiUsers className="text-blue-600" />

                  <h3 className="text-sm font-bold text-gray-800">
                    Team Information
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-[11px] text-gray-400">Team</p>

                    <p className="text-sm font-semibold text-gray-800">
                      {selectedProject.teamName}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-gray-400">Team Leader</p>

                    <p className="text-sm font-semibold text-gray-800">
                      {selectedProject.leader}
                    </p>
                  </div>
                </div>
              </div>

              {/* TEAM MEMBERS */}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-gray-800">
                    Team Members
                  </h3>

                  <span className="text-xs text-gray-400">
                    {selectedProject.members.length} Members
                  </span>
                </div>

                {selectedProject.members.length > 0 ? (
                  <div className="space-y-2">
                    {selectedProject.members.map((member, index) => (
                      <div
                        key={member.id || member._id || index}
                        className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg p-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <FiUsers size={15} />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-800">
                            {typeof member === "object"
                              ? member.name || member.label || "Member"
                              : member}
                          </p>

                          <p className="text-[10px] text-gray-400">
                            Team Member
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No members assigned.</p>
                )}
              </div>

              {/* DATES */}

              <div className="grid grid-cols-2 gap-3">
                <div className="border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FiCalendar size={15} />

                    <span className="text-xs">Start Date</span>
                  </div>

                  <p className="text-sm font-semibold text-gray-800 mt-2">
                    {formatDate(selectedProject.startDate)}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FiCalendar size={15} />

                    <span className="text-xs">Deadline</span>
                  </div>

                  <p className="text-sm font-semibold text-gray-800 mt-2">
                    {formatDate(selectedProject.deadline)}
                  </p>
                </div>
              </div>

              {/* STATUS */}

              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <span className="text-xs font-semibold text-gray-600">
                  Project Status
                </span>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    selectedProject.status.toLowerCase() === "completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : selectedProject.status.toLowerCase() === "pending"
                        ? "bg-gray-200 text-gray-600"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {selectedProject.status}
                </span>
              </div>

              {/* PROGRESS */}

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-gray-600">Progress</span>

                  <span className="font-bold text-gray-800">
                    {selectedProject.progress}%
                  </span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${selectedProject.progress}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* CLOSE BUTTON */}

            <div className="p-5 border-t border-gray-100">
              <button
                type="button"
                onClick={closeDetails}
                className="w-full border border-gray-300 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
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

export default MyProjects;
