import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiUsers,
  FiUser,
  FiCheckCircle,
  FiLayers,
  FiEdit3,
} from "react-icons/fi";
import { useTeamProject } from "../../contextAPI/TeamProjectContext";

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    projects,
    teams,
    updateProjectStatus,
  } = useTeamProject();

  const project = projects.find(
    (project) =>
      String(project.id || project._id) === String(id)
  );

  const formatDate = (date) => {
    if (!date) return "Not set";

    const formattedDate = new Date(date);

    if (isNaN(formattedDate.getTime())) {
      return "Not set";
    }

    return formattedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getShortDate = (date) => {
    if (!date) return "Not set";

    const formattedDate = new Date(date);

    if (isNaN(formattedDate.getTime())) {
      return "Not set";
    }

    return formattedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusLabel = (status) => {
    if (status === "in progress") return "In Progress";
    if (status === "completed") return "Completed";
    return "Pending";
  };

  const getStatusStyle = (status) => {
    if (status === "completed") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (status === "in progress") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  };

  const getStatusDot = (status) => {
    if (status === "completed") {
      return "bg-green-500";
    }

    if (status === "in progress") {
      return "bg-blue-500";
    }

    return "bg-yellow-500";
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">

        <button
          type="button"
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 text-[#0476b9] font-semibold hover:underline mb-6"
        >
          <FiArrowLeft size={18} />
          Back to Projects
        </button>

        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">

          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
            <FiLayers
              size={28}
              className="text-gray-400"
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mt-5">
            Project Not Found
          </h1>

          <p className="text-gray-500 mt-2">
            The project you are looking for does not exist.
          </p>

          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="mt-6 bg-[#0476b9] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#03669f]"
          >
            View Projects
          </button>

        </div>
      </div>
    );
  }

  const team = teams.find(
    (team) =>
      String(team.id || team._id) ===
      String(project.teamId || project.batch)
  );

  const startDate = project.startDate
    ? new Date(project.startDate)
    : null;

  const deadlineDate = project.deadline
    ? new Date(project.deadline)
    : null;

  const today = new Date();

  let daysRemaining = null;

  if (
    deadlineDate &&
    !isNaN(deadlineDate.getTime())
  ) {
    const difference =
      deadlineDate.getTime() - today.getTime();

    daysRemaining = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  }

  const isOverdue =
    daysRemaining !== null &&
    daysRemaining < 0 &&
    project.status !== "completed";

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-5 lg:p-6">

      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="w-fit flex items-center gap-2 text-gray-600 hover:text-[#0476b9] font-medium transition"
          >
            <FiArrowLeft size={18} />
            Back to Projects
          </button>

          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="w-fit flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg font-medium hover:border-[#0476b9] hover:text-[#0476b9] transition"
          >
            <FiEdit3 size={16} />
            Manage Project
          </button>

        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="p-5 sm:p-7 border-b border-gray-100">

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

              <div className="min-w-0">

                <div className="flex items-center gap-2 text-sm text-[#0476b9] font-semibold mb-2">
                  <FiLayers size={16} />
                  Project Details
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 break-words">
                  {project.name || project.projectName}
                </h1>

                <p className="text-gray-500 mt-3 max-w-3xl leading-6">
                  {project.description ||
                    "No project description available."}
                </p>

              </div>

              <div
                className={`flex items-center gap-2 w-fit px-4 py-2 rounded-full border text-sm font-semibold ${getStatusStyle(
                  project.status
                )}`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${getStatusDot(
                    project.status
                  )}`}
                />

                {getStatusLabel(project.status)}
              </div>

            </div>

          </div>

          <div className="p-5 sm:p-7">

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">

                <div className="flex items-center gap-2 text-gray-500">
                  <FiCalendar size={17} />
                  <span className="text-sm font-medium">
                    Start Date
                  </span>
                </div>

                <p className="text-lg font-bold text-gray-800 mt-3">
                  {getShortDate(project.startDate)}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Project started
                </p>

              </div>

              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">

                <div className="flex items-center gap-2 text-gray-500">
                  <FiCalendar size={17} />
                  <span className="text-sm font-medium">
                    Deadline
                  </span>
                </div>

                <p
                  className={`text-lg font-bold mt-3 ${
                    isOverdue
                      ? "text-red-600"
                      : "text-gray-800"
                  }`}
                >
                  {getShortDate(project.deadline)}
                </p>

                <p
                  className={`text-xs mt-1 ${
                    isOverdue
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {isOverdue
                    ? "Deadline has passed"
                    : "Final submission date"}
                </p>

              </div>

              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">

                <div className="flex items-center gap-2 text-gray-500">
                  <FiClock size={17} />
                  <span className="text-sm font-medium">
                    Time Remaining
                  </span>
                </div>

                <p
                  className={`text-lg font-bold mt-3 ${
                    isOverdue
                      ? "text-red-600"
                      : daysRemaining !== null &&
                        daysRemaining <= 7
                      ? "text-orange-600"
                      : "text-gray-800"
                  }`}
                >
                  {project.status === "completed"
                    ? "Completed"
                    : daysRemaining === null
                    ? "Not set"
                    : daysRemaining < 0
                    ? `${Math.abs(
                        daysRemaining
                      )} days overdue`
                    : daysRemaining === 0
                    ? "Due today"
                    : `${daysRemaining} days left`}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Based on project deadline
                </p>

              </div>

              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">

                <div className="flex items-center gap-2 text-gray-500">
                  <FiUsers size={17} />
                  <span className="text-sm font-medium">
                    Team Members
                  </span>
                </div>

                <p className="text-lg font-bold text-gray-800 mt-3">
                  {team?.members?.length || 0}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Assigned members
                </p>

              </div>

            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

              <div className="lg:col-span-2">

                <div className="border border-gray-200 rounded-2xl bg-white">

                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800">
                      Project Timeline
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Project schedule and important dates
                    </p>
                  </div>

                  <div className="p-5">

                    <div className="relative">

                      <div className="absolute left-3 top-4 bottom-4 w-px bg-gray-200" />

                      <div className="relative flex gap-4">

                        <div className="w-6 h-6 rounded-full bg-[#0476b9] border-4 border-blue-50 shrink-0" />

                        <div className="pb-7">

                          <p className="text-sm font-semibold text-[#0476b9]">
                            Project Start
                          </p>

                          <p className="text-lg font-bold text-gray-800 mt-1">
                            {formatDate(
                              project.startDate
                            )}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            Project work officially begins.
                          </p>

                        </div>

                      </div>

                      <div className="relative flex gap-4">

                        <div
                          className={`w-6 h-6 rounded-full border-4 shrink-0 ${
                            isOverdue
                              ? "bg-red-500 border-red-50"
                              : "bg-orange-500 border-orange-50"
                          }`}
                        />

                        <div>

                          <p
                            className={`text-sm font-semibold ${
                              isOverdue
                                ? "text-red-600"
                                : "text-orange-600"
                            }`}
                          >
                            Project Deadline
                          </p>

                          <p className="text-lg font-bold text-gray-800 mt-1">
                            {formatDate(
                              project.deadline
                            )}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            Final date for project completion.
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              <div>

                <div className="border border-gray-200 rounded-2xl bg-white">

                  <div className="px-5 py-4 border-b border-gray-100">

                    <h2 className="font-bold text-gray-800">
                      Project Status
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Update project progress
                    </p>

                  </div>

                  <div className="p-5">

                    <label className="text-sm font-semibold text-gray-700">
                      Current Status
                    </label>

                    <select
                      value={project.status}
                      onChange={(e) =>
                        updateProjectStatus(
                          project.id ||
                            project._id,
                          e.target.value
                        )
                      }
                      className="mt-2 w-full border border-gray-300 rounded-lg p-3 bg-white outline-none focus:border-[#0476b9] focus:ring-1 focus:ring-[#0476b9]"
                    >
                      <option value="pending">
                        Pending
                      </option>

                      <option value="in progress">
                        In Progress
                      </option>

                      <option value="completed">
                        Completed
                      </option>
                    </select>

                    <div
                      className={`mt-4 rounded-xl p-4 border ${getStatusStyle(
                        project.status
                      )}`}
                    >

                      <div className="flex items-center gap-2">

                        <FiCheckCircle size={18} />

                        <span className="font-semibold">
                          {getStatusLabel(
                            project.status
                          )}
                        </span>

                      </div>

                      <p className="text-xs mt-2 opacity-80">
                        Keep the project status updated
                        as work progresses.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            <div className="mt-6 border border-gray-200 rounded-2xl bg-white overflow-hidden">

              <div className="px-5 py-4 border-b border-gray-100">

                <div className="flex items-center gap-2">

                  <FiUsers
                    size={19}
                    className="text-[#0476b9]"
                  />

                  <h2 className="font-bold text-gray-800">
                    Assigned Team
                  </h2>

                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Team members assigned to this project
                </p>

              </div>

              {team ? (

                <div className="p-5">

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-gray-100">

                    <div>

                      <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                        Team
                      </p>

                      <h3 className="text-xl font-bold text-gray-800 mt-1">
                        {team.name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {team.description ||
                          "No team description available."}
                      </p>

                    </div>

                    <div className="flex items-center gap-2 bg-blue-50 text-[#0476b9] px-4 py-2 rounded-lg">

                      <FiUser size={16} />

                      <span className="text-sm font-semibold">
                        {team.lead ||
                          "No team lead"}
                      </span>

                    </div>

                  </div>

                  <div className="pt-5">

                    <div className="flex items-center justify-between mb-3">

                      <p className="text-sm font-semibold text-gray-700">
                        Team Members
                      </p>

                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                        {team.members?.length || 0} Members
                      </span>

                    </div>

                    {team.members?.length > 0 ? (

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                        {team.members.map(
                          (member) => (

                            <div
                              key={
                                member.id ||
                                member._id
                              }
                              className="flex items-center gap-3 border border-gray-200 rounded-xl p-3 hover:border-blue-200 hover:bg-blue-50/30 transition"
                            >

                              <div className="w-10 h-10 rounded-full bg-[#0476b9] text-white flex items-center justify-center font-semibold shrink-0">
                                {member.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "M"}
                              </div>

                              <div className="min-w-0">

                                <p className="font-semibold text-gray-800 truncate">
                                  {member.name}
                                </p>

                                <p className="text-xs text-gray-400">
                                  Team Member
                                </p>

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    ) : (

                      <div className="text-center border border-dashed border-gray-300 rounded-xl p-6">

                        <FiUsers
                          size={28}
                          className="mx-auto text-gray-300"
                        />

                        <p className="text-sm text-gray-500 mt-2">
                          No members assigned to this team.
                        </p>

                      </div>

                    )}

                  </div>

                </div>

              ) : (

                <div className="p-6">

                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl p-4">
                    No team is assigned to this project.
                  </div>

                </div>

              )}

            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-400">

              <p>
                Start:{" "}
                {getShortDate(
                  startDate
                )}
              </p>

              <p>
                Deadline:{" "}
                {getShortDate(
                  deadlineDate
                )}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProjectDetail;