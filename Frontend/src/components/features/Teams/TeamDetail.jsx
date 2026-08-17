import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUsers,
  FiUser,
  FiLayers,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFolder,
} from "react-icons/fi";
import { useTeamProject } from "../../../context/TeamProjectContext";

function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { teams, getTeamProjects } = useTeamProject();

  const team = teams.find(
    (team) =>
      String(team.id || team._id) === String(id)
  );

  if (!team) {
    return (
      <div className="bg-gray-50 p-4 sm:p-6">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#0476b9] font-semibold hover:underline mb-6"
        >
          <FiArrowLeft size={18} />
          Back
        </button>

        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">

          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
            <FiUsers
              size={28}
              className="text-gray-400"
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mt-5">
            Team Not Found
          </h1>

          <p className="text-gray-500 mt-2">
            The team you are looking for does not exist.
          </p>

          <button
            type="button"
            onClick={() => navigate("/teams")}
            className="mt-6 bg-[#0476b9] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#03669f]"
          >
            View Teams
          </button>

        </div>
      </div>
    );
  }

  const teamId = team.id || team._id;

  const projects = getTeamProjects(teamId) || [];

  const completedProjects = projects.filter(
    (project) =>
      project.status === "completed" ||
      project.status === "Completed"
  ).length;

  const progressProjects = projects.filter(
    (project) =>
      project.status === "in progress" ||
      project.status === "In Progress"
  ).length;

  const pendingProjects = projects.filter(
    (project) =>
      project.status === "pending" ||
      project.status === "Pending"
  ).length;

  const formatDate = (date) => {
    if (!date) return "Not set";

    const formattedDate = new Date(date);

    if (isNaN(formattedDate.getTime())) {
      return "Not set";
    }

    return formattedDate.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  const getStatusStyle = (status) => {
    if (
      status === "completed" ||
      status === "Completed"
    ) {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (
      status === "in progress" ||
      status === "In Progress"
    ) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  };

  const getStatusLabel = (status) => {
    if (
      status === "in progress" ||
      status === "In Progress"
    ) {
      return "In Progress";
    }

    if (
      status === "completed" ||
      status === "Completed"
    ) {
      return "Completed";
    }

    return "Pending";
  };

  return (
    <div className=" bg-gray-50 p-3 sm:py-8 ">

      <div className="">

        <div className="mb-5">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#0476b9] font-medium transition"
          >
            <FiArrowLeft size={18} />
            Back to Teams
          </button>

        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="p-5 sm:p-7 border-b border-gray-100">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div className="flex items-center gap-4">

                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-50 text-[#0476b9] flex items-center justify-center shrink-0">
                  <FiUsers
                    size={32}
                  />
                </div>

                <div className="min-w-0">

                  <p className="text-sm text-[#0476b9] font-semibold">
                    Team Details
                  </p>

                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                    {team.name}
                  </h1>

                  <p className="text-gray-500 text-sm mt-1">
                    {team.members?.length || 0} team members
                    {" "}•{" "}
                    {projects.length} projects
                  </p>

                </div>

              </div>

              {team.lead && (
                <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 w-fit">

                  <div className="w-10 h-10 rounded-full bg-[#0476b9] text-white flex items-center justify-center font-bold">
                    {team.lead
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>

                    <p className="text-xs text-gray-500">
                      Team Lead
                    </p>

                    <p className="font-semibold text-gray-800">
                      {team.lead}
                    </p>

                  </div>

                </div>
              )}

            </div>

            <div className="mt-5 bg-gray-50 border border-gray-200 rounded-xl p-4">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Team Description
              </p>

              <p className="text-gray-600 text-sm leading-6 mt-2">
                {team.description ||
                  "No team description available."}
              </p>

            </div>

          </div>

          <div className="p-5 sm:p-7">

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">

                <div className="flex items-center gap-2 text-[#0476b9]">
                  <FiUsers size={17} />

                  <span className="text-sm font-medium">
                    Members
                  </span>
                </div>

                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {team.members?.length || 0}
                </p>

              </div>

              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">

                <div className="flex items-center gap-2 text-purple-600">
                  <FiFolder size={17} />

                  <span className="text-sm font-medium">
                    Projects
                  </span>
                </div>

                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {projects.length}
                </p>

              </div>

              <div className="bg-green-50 border border-green-100 rounded-xl p-4">

                <div className="flex items-center gap-2 text-green-600">
                  <FiCheckCircle size={17} />

                  <span className="text-sm font-medium">
                    Completed
                  </span>
                </div>

                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {completedProjects}
                </p>

              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">

                <div className="flex items-center gap-2 text-yellow-600">
                  <FiClock size={17} />

                  <span className="text-sm font-medium">
                    Pending
                  </span>
                </div>

                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {pendingProjects}
                </p>

              </div>

            </div>

            <div className="mt-8">

              <div className="flex items-center justify-between mb-4">

                <div>

                  <h2 className="text-xl font-bold text-gray-800">
                    Team Members
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Members currently assigned to this team
                  </p>

                </div>

                <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full">
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
                        className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition"
                      >

                        <div className="w-11 h-11 rounded-full bg-[#0476b9] text-white flex items-center justify-center font-bold shrink-0">
                          {member.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "M"}
                        </div>

                        <div className="min-w-0">

                          <p className="font-semibold text-gray-800 truncate">
                            {member.name}
                          </p>

                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                            <FiUser size={12} />
                            Team Member
                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center">

                  <FiUsers
                    size={30}
                    className="mx-auto text-gray-300"
                  />

                  <p className="text-gray-500 text-sm mt-2">
                    No members assigned to this team.
                  </p>

                </div>

              )}

            </div>

            <div className="mt-8">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">

                <div>

                  <h2 className="text-xl font-bold text-gray-800">
                    Assigned Projects
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Projects currently assigned to {team.name}
                  </p>

                </div>

                <div className="flex items-center gap-2 text-sm">

                  <span className="text-green-600 font-semibold">
                    {completedProjects} Completed
                  </span>

                  <span className="text-blue-600 font-semibold">
                    {progressProjects} In Progress
                  </span>

                </div>

              </div>

              {projects.length === 0 ? (

                <div className="border border-dashed border-gray-300 rounded-xl p-10 text-center">

                  <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                    <FiLayers
                      size={25}
                      className="text-gray-400"
                    />
                  </div>

                  <h3 className="font-semibold text-gray-700 mt-4">
                    No Projects Assigned
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    This team does not have any projects yet.
                  </p>

                </div>

              ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

                  {projects.map(
                    (project) => (

                      <div
                        key={
                          project.id ||
                          project._id
                        }
                        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
                      >

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0">

                            <h3 className="font-bold text-gray-800 truncate">
                              {project.name ||
                                project.projectName}
                            </h3>

                            <p className="text-xs text-gray-400 mt-1">
                              Project
                            </p>

                          </div>

                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${getStatusStyle(
                              project.status
                            )}`}
                          >
                            {getStatusLabel(
                              project.status
                            )}
                          </span>

                        </div>

                        <p className="text-sm text-gray-500 mt-4 line-clamp-3">
                          {project.description ||
                            "No project description available."}
                        </p>

                        <div className="grid grid-cols-2 gap-2 mt-4">

                          <div className="bg-gray-50 rounded-lg p-3">

                            <div className="flex items-center gap-1 text-gray-400">
                              <FiCalendar size={13} />

                              <span className="text-xs">
                                Start
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-gray-700 mt-1">
                              {formatDate(
                                project.startDate
                              )}
                            </p>

                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">

                            <div className="flex items-center gap-1 text-gray-400">
                              <FiCalendar size={13} />

                              <span className="text-xs">
                                Deadline
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-gray-700 mt-1">
                              {formatDate(
                                project.deadline
                              )}
                            </p>

                          </div>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/projects/${
                                project.id ||
                                project._id
                              }`
                            )
                          }
                          className="w-full mt-4 border border-[#0476b9] text-[#0476b9] py-2 rounded-lg text-sm font-semibold hover:bg-[#0476b9] hover:text-white transition"
                        >
                          View Project
                        </button>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default TeamDetail;