import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTeamProject } from "../../contextAPI/TeamProjectContext";

function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { teams, getTeamProjects } = useTeamProject();

  const team = teams.find(
    (team) => team.id === Number(id)
  );

  if (!team) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          Team not found
        </h1>
      </div>
    );
  }

  const projects = getTeamProjects(team.id);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="text-[#0476b9] mb-5"
      >
        ← Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {team.name}
        </h1>

        {team.lead && (
          <p className="text-sm text-[#0476b9] font-semibold mt-2">
            Team Lead: {team.lead}
          </p>
        )}

        <p className="text-gray-500 mt-2">
          {team.description}
        </p>

        <div className="mt-6">
          <h2 className="text-xl font-bold">
            Team Members
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            {team.members.map((member) => (
              <div
                key={member.id}
                className="bg-gray-50 rounded-lg p-3"
              >
                {member.name}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold">
            Assigned Projects
          </h2>

          {projects.length === 0 ? (
            <p className="text-gray-500 mt-3">
              No projects assigned yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border rounded-xl p-4"
                >
                  <h3 className="font-bold">
                    {project.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {project.description}
                  </p>

                  <span className="inline-block mt-3 text-sm font-semibold">
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamDetail;