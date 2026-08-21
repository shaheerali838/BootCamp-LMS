import React, { useState } from "react";
import { FiFolder, FiPlus, FiTrash2, FiEdit2, FiSearch } from "react-icons/fi";
import { useTeamProject } from "../../context/TeamProjectContext";
import { useBatches } from "../../context/AcademicContext";
import { PageSkeleton } from "../../components/common/Skeleton";

function ProjectManagement() {
  const { projects = [], projectsLoading, addProject, updateProject, deleteProject } = useTeamProject();
  const { batches = [] } = useBatches();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    batch: "",
    startDate: new Date().toISOString().split("T")[0],
    deadline: "",
    status: "in progress",
  });

  const getProjectTitle = (p) => p.projectName || p.name || p.title || "Untitled Project";
  const getProjectBatch = (p) => {
    if (typeof p.batch === "object" && p.batch?.batchName) return p.batch.batchName;
    const found = batches.find((b) => (b._id || b.id) === p.batch || (b._id || b.id) === p.batchId);
    return found ? found.batchName : p.category || "General";
  };

  const filtered = projects.filter((p) => {
    const title = getProjectTitle(p).toLowerCase();
    const batchName = getProjectBatch(p).toLowerCase();
    const status = (p.status || "").toLowerCase();
    const q = search.toLowerCase();
    return title.includes(q) || batchName.includes(q) || status.includes(q);
  });

  const [modalError, setModalError] = useState("");

  const handleOpenAdd = () => {
    setEditingProject(null);
    setModalError("");
    setFormData({
      projectName: "",
      description: "",
      batch: batches[0] ? (batches[0]._id || batches[0].id) : "",
      startDate: new Date().toISOString().split("T")[0],
      deadline: "",
      status: "in progress",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setModalError("");
    setFormData({
      projectName: getProjectTitle(project),
      description: project.description || "",
      batch: typeof project.batch === "object" ? (project.batch?._id || "") : (project.batch || project.batchId || (batches[0] ? (batches[0]._id || batches[0].id) : "")),
      startDate: project.startDate ? new Date(project.startDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      deadline: project.deadline ? new Date(project.deadline).toISOString().split("T")[0] : "",
      status: project.status || "in progress",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!formData.projectName.trim()) {
      setModalError("Project Name is required.");
      return;
    }
    if (!formData.description.trim()) {
      setModalError("Description is required.");
      return;
    }
    if (!formData.batch) {
      setModalError("Please select a Target Batch. If none exist, create a Batch first.");
      return;
    }
    if (!formData.startDate) {
      setModalError("Start Date is required.");
      return;
    }
    if (!formData.deadline) {
      setModalError("Deadline is required.");
      return;
    }

    const payload = {
      ...formData,
      projectName: formData.projectName.trim(),
      name: formData.projectName.trim(),
      description: formData.description.trim(),
      batchId: formData.batch,
    };

    try {
      if (editingProject) {
        await updateProject(editingProject._id || editingProject.id, payload);
      } else {
        await addProject(payload);
      }
      setShowModal(false);
    } catch (err) {
      setModalError(err?.response?.data?.message || err?.message || "Failed to save project.");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(id);
    }
  };

  if (projectsLoading && projects.length === 0) {
    return <PageSkeleton hasStats={false} rowCount={6} />;
  }

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiFolder className="text-cyan-600" />
              Project Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Create and manage capstone and module projects across batches
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium text-xs shadow-xs transition cursor-pointer"
          >
            <FiPlus size={16} />
            Create Project
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
        <div className="relative max-w-md">
          <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, batch, or status..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <div className="min-w-[620px]">
            <div className="grid grid-cols-5 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
              <span className="col-span-2">Project Name & Description</span>
              <span>Target Batch</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>
            <div className="divide-y divide-gray-100">
              {filtered.map((item) => {
                const title = getProjectTitle(item);
                const batchName = getProjectBatch(item);

                return (
                  <div key={item._id || item.id} className="grid grid-cols-5 px-5 py-4 items-center hover:bg-gray-50 text-sm">
                    <div className="col-span-2">
                      <div className="font-bold text-gray-900">{title}</div>
                      <div className="text-xs text-gray-400 truncate max-w-sm">{item.description || "No description provided"}</div>
                    </div>
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {batchName}
                      </span>
                    </div>
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-100 capitalize">
                        {item.status || "in progress"}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-3 text-gray-400">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="hover:text-cyan-600 transition cursor-pointer"
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id || item.id)}
                        className="hover:text-red-600 transition cursor-pointer"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="py-12 text-center text-sm text-gray-400">
                  No projects found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingProject ? "Edit Project" : "Create Project"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {modalError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{modalError}</span>
                </div>
              )}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="e.g. AI-Powered Healthcare Portal"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive overview of project goals..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Target Batch *
                </label>
                <select
                  required
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-cyan-500"
                >
                  <option value="">Select Batch</option>
                  {batches.map((b) => (
                    <option key={b._id || b.id} value={b._id || b.id}>
                      {b.batchName || b.name} ({b.program || "Tech"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Deadline *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-cyan-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Save Project
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
