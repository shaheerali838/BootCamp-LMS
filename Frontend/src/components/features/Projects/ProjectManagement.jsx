import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiFolder,
  FiUsers,
  FiLayers,
} from "react-icons/fi";
import { useTeamProject } from "../../../context/TeamProjectContext";
import ProjectCard from "./PorjectCard";

function ProjectManagement() {
  const {
    teams,
    projects,
    addProject,
  } = useTeamProject();

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  // PAGINATION
  const projectsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    startDate: "",
    deadline: "",
    batch: "",
    status: "pending",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.projectName ||
      !formData.description ||
      !formData.startDate ||
      !formData.deadline ||
      !formData.batch
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (
      new Date(formData.deadline) <
      new Date(formData.startDate)
    ) {
      alert("Deadline must be after start date");
      return;
    }

    addProject({
      projectName: formData.projectName,
      name: formData.projectName,
      description: formData.description,
      startDate: formData.startDate,
      deadline: formData.deadline,
      batch: formData.batch,
      teamId: formData.batch,
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

    setShowForm(false);
    setCurrentPage(1);
  };

  const filteredProjects = projects.filter((project) =>
    (project.name || project.projectName || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // PAGINATION
  const totalPages = Math.ceil(
    filteredProjects.length / projectsPerPage
  );

  const startIndex = (currentPage - 1) * projectsPerPage;

  const currentProjects = filteredProjects.slice(
    startIndex,
    startIndex + projectsPerPage
  );
  // PAGINATION
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);
  // PAGINATION
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const totalMembers = teams.reduce(
    (total, team) =>
      total + (team.members?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Project Management
            </h1>

            <p className="text-gray-500 mt-1">
              Create, manage and track your projects.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 bg-[#0476b9] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#03669f]"
          >
            <FiPlus size={18} />
            Add Project
          </button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

          <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4">

            <div className="w-11 h-11 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <FiFolder size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Projects
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {projects.length}
              </p>
            </div>

          </div>

          <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4">

            <div className="w-11 h-11 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
              <FiLayers size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Teams
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {teams.length}
              </p>
            </div>

          </div>

          <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4">

            <div className="w-11 h-11 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <FiUsers size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Members
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {totalMembers}
              </p>
            </div>

          </div>

        </div>

        <div className="relative mt-5">

          <FiSearch
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-[#0476b9]"
          />

        </div>

      </div>

      {filteredProjects.length === 0 ? (

        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center mt-6">

          <FiFolder
            size={40}
            className="mx-auto text-gray-300"
          />

          <h2 className="text-xl font-semibold text-gray-700 mt-3">
            {search ? "No Projects Found" : "No Projects Yet"}
          </h2>

          <p className="text-gray-500 mt-2">
            {search
              ? "Try another search."
              : "Create your first project."}
          </p>

        </div>

      ) : (

        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-2">

            {currentProjects.map((project) => {

              const team = teams.find(
                (team) =>
                  String(team._id || team.id) ===
                  String(project.teamId || project.batch)
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

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 mb-6">

              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-semibold border transition ${currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
              >
                Previous
              </button>

              {/* PAGINATION */}
              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  className={`w-10 h-10 rounded-lg font-semibold transition ${currentPage === page
                      ? "bg-[#0476b9] text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold border transition ${currentPage === totalPages
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

      {showForm && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between mb-5">

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Create Project
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Create a new project.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-red-500 text-2xl"
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <label className="block text-sm font-semibold text-gray-700">
                Project Name
              </label>

              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="Enter project name"
                className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 outline-none focus:border-[#0476b9]"
              />

              <label className="block text-sm font-semibold text-gray-700 mt-4">
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

              <label className="block text-sm font-semibold text-gray-700 mt-4">
                Start Date
              </label>

              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 outline-none focus:border-[#0476b9]"
              />

              <label className="block text-sm font-semibold text-gray-700 mt-4">
                Deadline
              </label>

              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 outline-none focus:border-[#0476b9]"
              />

              <label className="block text-sm font-semibold text-gray-700 mt-4">
                Batch
              </label>

              <select
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 outline-none focus:border-[#0476b9]"
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

              <label className="block text-sm font-semibold text-gray-700 mt-4">
                Status
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

              <div className="flex gap-3 mt-6">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
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

    </div>
  );
}

export default ProjectManagement;