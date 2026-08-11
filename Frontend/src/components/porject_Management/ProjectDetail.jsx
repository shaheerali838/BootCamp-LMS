import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTeamProject } from "../../contextAPI/TeamProjectContext";

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { teams, projects } = useTeamProject();

  const project = projects.find((item) => item.id === Number(id));
  const team = project
    ? teams.find((teamItem) => teamItem.id === Number(project.teamId))
    : null;

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <button
          onClick={() => navigate(-1)}
          className="text-[#0476b9] mb-5"
        >
          ← Back
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Project not found
          </h1>
          <p className="text-gray-500 mt-2">
            The project you are looking for does not exist or was removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button
        onClick={() => navigate(-1)}
        className="text-[#0476b9] mb-5 font-medium"
      >
        ← Back
      </button>

      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-lg shadow-gray-200/40">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.24em] text-[#0476b9] font-semibold">
              Project Detail
            </p>
            <h1 className="mt-3 text-4xl font-bold text-gray-900">
              {project.name}
            </h1>
            <p className="mt-4 text-gray-600 leading-7">
              {project.description}
            </p>
          </div>

          <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm">
            <span className="mr-2 text-xs uppercase tracking-[0.18em] text-gray-500">
              Status
            </span>
            <span className={`rounded-full px-3 py-1 ${
              project.status === "Completed"
                ? "bg-green-100 text-green-700"
                : project.status === "In Progress"
                ? "bg-blue-100 text-blue-700"
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {project.status}
            </span>
          </div>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          <div className="rounded-3xl border border-gray-200 bg-[#f8fafc] p-6">
            <h2 className="text-sm font-semibold text-gray-500 tracking-[0.12em] uppercase">
              Assigned Team
            </h2>
            <p className="mt-4 text-xl font-semibold text-gray-900">
              {team?.name || "Unassigned"}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              {team ? "Team is assigned to this project." : "Create a team and assign it to view members."}
            </p>
            {team?.lead && (
              <p className="mt-4 text-sm text-gray-700">
                <span className="font-semibold">Lead:</span> {team.lead}
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-gray-500 tracking-[0.12em] uppercase">
              Project Info
            </h2>
            <div className="mt-5 space-y-4 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Project name</span>
                <span className="font-medium text-gray-900">{project.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Assigned team</span>
                <span className="font-medium text-gray-900">{team?.name || "None"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Team lead</span>
                <span className="font-medium text-gray-900">{team?.lead || "None"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-500 tracking-[0.12em] uppercase">
                Team Members
              </h2>
              <span className="text-xs text-gray-400">
                {team?.members?.length || 0}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {team?.members?.length > 0 ? (
                team.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="h-10 w-10 shrink-0 rounded-full bg-[#0476b9] text-white grid place-items-center text-sm font-semibold">
                      {member.name ? member.name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
                  No members added to this team yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;
