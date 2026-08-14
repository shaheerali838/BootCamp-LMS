import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTeamProject } from "../../../context/TeamProjectContext";

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    projects,
    teams,
    updateProjectStatus,
  } = useTeamProject();

  const project = projects.find(
    (project) => Number(project.id) === Number(id)
  );

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">

        <button
          onClick={() => navigate("/projects")}
          className="text-[#0476b9] font-semibold mb-5 hover:underline"
        >
          ← Back to Projects
        </button>

        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

          <h1 className="text-2xl font-bold text-gray-800">
            Project Not Found
          </h1>

          <p className="text-gray-500 mt-2">
            The project you are looking for does not exist.
          </p>

        </div>

      </div>
    );
  }

  const team = teams.find(
    (team) => Number(team.id) === Number(project.teamId)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <button
        onClick={() => navigate("/projects")}
        className="text-[#0476b9] font-semibold mb-5 hover:underline"
      >
        ← Back to Projects
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

          <div>

            <p className="text-sm text-gray-500">
              Project Details
            </p>

            <h1 className="text-3xl font-bold text-gray-800 mt-1">
              {project.name}
            </h1>

            <p className="text-gray-500 mt-2 max-w-2xl">
              {project.description || "No description available"}
            </p>

          </div>

          <span
            className={`w-fit px-4 py-2 rounded-full text-sm font-semibold ${project.status === "Completed"
              ? "bg-green-100 text-green-700"
              : project.status === "In Progress"
                ? "bg-blue-100 text-blue-700"
                : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {project.status}
          </span>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">

            <p className="text-sm text-gray-500">
              Project Name
            </p>

            <p className="font-semibold text-gray-800 mt-1">
              {project.name}
            </p>

          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">

            <p className="text-sm text-gray-500">
              Assigned Team
            </p>

            <p className="font-semibold text-[#0476b9] mt-1">
              {team?.name || "Unknown Team"}
            </p>

          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">

            <p className="text-sm text-gray-500">
              Team Members
            </p>

            <p className="font-semibold text-gray-800 mt-1">
              {team?.members?.length || 0} Members
            </p>

          </div>

        </div>

        <div className="mt-8">

          <h2 className="text-xl font-bold text-gray-800">
            Project Status
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Update the current status of this project.
          </p>

          <select
            value={project.status}
            onChange={(e) =>
              updateProjectStatus(
                project.id,
                e.target.value
              )
            }
            className="mt-4 w-full md:w-72 border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#0476b9]"
          >

            <option value="Pending">
              Pending
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>

          </select>

        </div>

        <div className="mt-8">

          <h2 className="text-xl font-bold text-gray-800">
            Assigned Team
          </h2>

          {team ? (

            <div className="mt-4 border border-gray-200 rounded-xl p-5">

              <h3 className="text-lg font-bold text-gray-800">
                {team.name}
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                {team.description || "No team description available"}
              </p>

              <div className="mt-5">
                <div className="flex flex-wrap gap-2 items-center">
                  <label htmlFor=""className="text-sm font-semibold text-gray-600 mb-3">Lead Name</label>
                  <p className="bg-blue-50 text-[#0476b9] px-3 py-2 rounded-lg text-sm font-medium">{team.lead}</p>
                </div>

                <p className="text-sm font-semibold text-gray-600 mb-3">
                  Team Members
                </p>

                <div className="flex flex-wrap gap-2">

                  {team.members?.map((member) => (

                    <div
                      key={member.id}
                      className="bg-blue-50 text-[#0476b9] px-3 py-2 rounded-lg text-sm font-medium"
                    >
                      {member.name}
                    </div>

                  ))}

                </div>

              </div>

            </div>

          ) : (

            <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl p-4">
              No team assigned to this project.
            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default ProjectDetail;