import React, { useState } from "react";
import { FiFolder, FiPlus, FiTrash2, FiEdit2, FiSearch } from "react-icons/fi";
import { useProjects } from "../../context/ProjectContext";

function ProjectManagement() {
  const { projects, addProject, updateProject, setProjects } = useProjects();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Batch 11",
    progress: 50,
    status: "In Progress",
  });

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      category: "Batch 11",
      progress: 0,
      status: "In Progress",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      category: project.category,
      progress: project.progress,
      status: project.status,
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProject) {
      updateProject(editingProject.id, {
        ...formData,
        progress: Number(formData.progress),
      });
    } else {
      addProject({
        ...formData,
        progress: Number(formData.progress),
        color: "bg-blue-600",
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        
        <div className="flex items-center justify-between mt-2">
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
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium text-xs shadow transition"
          >
            <FiPlus size={16} />
            Create Project
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="relative max-w-md">
          <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title or batch..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-5 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
          <span className="col-span-2">Project Title</span>
          <span>Batch / Category</span>
          <span>Completion Progress</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.map((item) => (
            <div key={item.id} className="grid grid-cols-5 px-5 py-4 items-center hover:bg-gray-50 text-sm">
              <div className="col-span-2">
                <div className="font-bold text-gray-900">{item.title}</div>
                <div className="text-xs text-gray-400">{item.status}</div>
              </div>
              <div>
                <span className="bg-cyan-50 text-cyan-700 border border-cyan-200 px-3 py-1 rounded-full text-xs font-semibold">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color || "bg-cyan-600"}`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-700">{item.progress}%</span>
              </div>
              <div className="flex items-center justify-end gap-3 text-gray-400">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="hover:text-cyan-600 transition"
                  title="Edit"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="hover:text-red-600 transition"
                  title="Delete"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-500">
              No projects found.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingProject ? "Edit Project" : "Create Project"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Hackathon Portal"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Batch / Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Batch 11"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Progress Percentage ({formData.progress}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow"
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
