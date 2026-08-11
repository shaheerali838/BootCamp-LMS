import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeamProject } from "../../contextAPI/TeamProjectContext";

function ProjectManagement() {
  const navigate = useNavigate();
  const {
    teams,
    projects,
    addProject,
    updateProjectStatus,
  } = useTeamProject();

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    teamId: "",
    status: "Pending",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.teamId) {
      return;
    }

    addProject(formData);

    setFormData({
      name: "",
      description: "",
      teamId: "",
      status: "Pending",
    });

    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Project Management
          </h1>

          <p className="text-gray-500 mt-1">
            Create, assign and manage team projects.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-[#0476b9] text-white px-5 py-2.5 rounded-lg hover:bg-[#03669f]"
        >
          + Add Project
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-2xl font-bold text-gray-800">
                Create Project
              </h2>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-red-500 text-2xl"
              >
                ×
              </button>

            </div>

            {teams.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg">
                Please create a team first from Team Management.
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
                    className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 outline-none focus:border-[#0476b9]"
                  />
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
                    className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 outline-none focus:border-[#0476b9]"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Assign Team
                  </label>

                  <select
                    name="teamId"
                    value={formData.teamId}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 outline-none focus:border-[#0476b9]"
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
                    onClick={() => setShowForm(false)}
                    className="flex-1 border border-gray-300 py-2.5 rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 bg-[#0476b9] text-white py-2.5 rounded-lg hover:bg-[#03669f]"
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
            Create your first project.
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="mt-5 bg-[#0476b9] text-white px-5 py-2 rounded-lg"
          >
            Add Project
          </button>

        </div>
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {projects.map((project) => {

            const team = teams.find(
              (team) => team.id === Number(project.teamId)
            );

            return (
              <div
                key={project.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition"
                onClick={() => navigate(`/projects/${project.id}`)}
              >

                <div className="flex items-start justify-between">

                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {project.name}
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                      {project.description}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${project.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : project.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {project.status}
                  </span>

                </div>

                <div className="mt-5 border-t pt-4">

                  <p className="text-xs text-gray-500">
                    Assigned Team
                  </p>

                  <p className="font-semibold text-[#0476b9] mt-1">
                    {team?.name || "Unknown Team"}
                  </p>

                </div>

                <div className="mt-4">

                  <label className="text-xs text-gray-500">
                    Update Status
                  </label>

                  

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default ProjectManagement;