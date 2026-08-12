import React, { useState } from "react";
import { useTeamProject } from "../../contextAPI/TeamProjectContext";
import ProjectCard from "./PorjectCard";

function ProjectManagement() {
  const {
    teams,
    projects,
    addProject,
  } = useTeamProject();

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    teamId: "",
    status: "Pending",
  });

  const [error, setError] = useState({});

  const totalProjectMembers = projects.reduce((total, project) => {
    const team = teams.find(
      (team) => Number(team.id) === Number(project.teamId)
    );

    return total + (team?.members?.length || 0);
  }, 0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.name) {
      newErrors.name = "Project name is required";
    }

    if (!formData.description) {
      newErrors.description = "Description is required";
    }

    if (!formData.teamId) {
      newErrors.teamId = "Please select a team";
    }

    setError(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    addProject({
      ...formData,
      teamId: Number(formData.teamId),
    });

    setFormData({
      name: "",
      description: "",
      teamId: "",
      status: "Pending",
    });

    setError({});
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Project Management
          </h1>

          <p className="text-gray-500 mt-1">
            Create, assign and manage your team projects.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="bg-[#0476b9] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#03669f] transition"
        >
          + Add Project
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-9">
        <div className="bg-white border w-40 flex flex-col items-center border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Projects
          </p>

          <h2 className="text-3xl font-bold text-[#0476b9] mt-2">
            {projects.length}
          </h2>
        </div>

        <div className="bg-white border w-40 flex flex-col items-center border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Project Members
          </p>

          <h2 className="text-3xl font-bold text-[#0476b9] mt-2">
            {totalProjectMembers}
          </h2>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Create Project
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Assign this project to an existing team.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError({});
                }}
                className="text-gray-500 hover:text-red-500 text-2xl"
              >
                ×
              </button>
            </div>

            {teams.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg">
                <p className="font-semibold">
                  No teams available
                </p>

                <p className="text-sm mt-1">
                  Please create a team first from Team Management.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Project Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter project name"
                    className={`w-full border rounded-lg p-2.5 mt-1 outline-none focus:border-[#0476b9] ${
                      error.name
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                  />

                  {error.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {error.name}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter project description"
                    rows="4"
                    className={`w-full border rounded-lg p-2.5 mt-1 outline-none focus:border-[#0476b9] ${
                      error.description
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                  />

                  {error.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {error.description}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Assign Team
                  </label>

                  <select
                    name="teamId"
                    value={formData.teamId}
                    onChange={handleChange}
                    className={`w-full border rounded-lg p-2.5 mt-1 outline-none focus:border-[#0476b9] ${
                      error.teamId
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">
                      Select Team
                    </option>

                    {teams.map((team) => (
                      <option
                        key={team.id}
                        value={team.id}
                      >
                        {team.name}
                      </option>
                    ))}
                  </select>

                  {error.teamId && (
                    <p className="text-red-500 text-xs mt-1">
                      {error.teamId}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Project Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 outline-none focus:border-[#0476b9]"
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

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setError({});
                    }}
                    className="flex-1 border border-gray-300 py-2.5 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 bg-[#0476b9] text-white py-2.5 rounded-lg font-semibold hover:bg-[#03669f]"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No Projects Yet
          </h2>

          <p className="text-gray-500 mt-2">
            Create your first project and assign it to a team.
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="mt-5 bg-[#0476b9] text-white px-5 py-2 rounded-lg font-semibold"
          >
            + Add Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => {
            const team = teams.find(
              (team) =>
                Number(team.id) === Number(project.teamId)
            );

            return (
              <ProjectCard
                key={project.id}
                project={project}
                team={team}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProjectManagement;