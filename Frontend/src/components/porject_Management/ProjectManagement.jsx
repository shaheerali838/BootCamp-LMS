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
    projectName: "",
    description: "",
    startDate: "",
    deadline: "",
    batch: "",
    status: "pending",
  });

  const [error, setError] = useState({});

  const totalProjectMembers = projects.reduce((total, project) => {
    const team = teams.find(
      (team) =>
        String(team.id) === String(project.teamId) ||
        String(team._id) === String(project.teamId)
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

    if (!formData.projectName.trim()) {
      newErrors.projectName = "Project name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required";
    }

    if (
      formData.startDate &&
      formData.deadline &&
      new Date(formData.deadline) < new Date(formData.startDate)
    ) {
      newErrors.deadline = "Deadline must be after start date";
    }

    if (!formData.batch) {
      newErrors.batch = "Please select a batch";
    }

    setError(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    addProject({
      projectName: formData.projectName,
      description: formData.description,
      startDate: formData.startDate,
      deadline: formData.deadline,
      batch: formData.batch,
      status: formData.status,
    });

    setFormData({
      projectName: "",
      description: "",
      startDate: "",
      deadline: "",
      batch: "",
      status: "pending",
    });

    setError({});
    setShowForm(false);
  };

  const closeForm = () => {
    setShowForm(false);
    setError({});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Project Management
          </h1>

          <p className="text-gray-500 mt-1">
            Create and manage your projects.
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

      {/* Statistics */}
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

      {/* Create Project Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Create Project
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Enter project information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="text-gray-500 hover:text-red-500 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Project Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Project Name
                </label>

                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  className={`w-full border rounded-lg p-2.5 mt-1 outline-none focus:border-[#0476b9] ${
                    error.projectName
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                />

                {error.projectName && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.projectName}
                  </p>
                )}
              </div>

              {/* Description */}
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

              {/* Start Date */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-2.5 mt-1 outline-none focus:border-[#0476b9] ${
                    error.startDate
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                />

                {error.startDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.startDate}
                  </p>
                )}
              </div>

              {/* Deadline */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Deadline
                </label>

                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-2.5 mt-1 outline-none focus:border-[#0476b9] ${
                    error.deadline
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                />

                {error.deadline && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.deadline}
                  </p>
                )}
              </div>

              {/* Batch */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Batch
                </label>

                <select
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-2.5 mt-1 outline-none focus:border-[#0476b9] ${
                    error.batch
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">
                    Select Batch
                  </option>

                  {teams.map((team) => (
                    <option
                      key={team._id || team.id}
                      value={team._id || team.id}
                    >
                      {team.name}
                    </option>
                  ))}
                </select>

                {error.batch && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.batch}
                  </p>
                )}
              </div>

              {/* Status */}
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
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">

                <button
                  type="button"
                  onClick={closeForm}
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
          </div>
        </div>
      )}

      {/* Projects */}
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
                String(team.id) === String(project.teamId) ||
                String(team._id) === String(project.batch)
            );

            return (
              <ProjectCard
                key={project._id || project.id}
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
