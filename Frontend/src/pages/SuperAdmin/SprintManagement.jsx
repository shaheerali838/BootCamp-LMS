import React, { useState } from "react";
import { FiClock, FiPlus, FiTrash2, FiEdit2, FiFilter } from "react-icons/fi";
import { useSprints } from "../../context/SprintContext";
import { useProjects } from "../../context/ProjectContext";

function SprintManagement() {
  const { sprints, addSprint, updateSprint, deleteSprint } = useSprints();
  const { projects } = useProjects();

  const [selectedProjectId, setSelectedProjectId] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingSprint, setEditingSprint] = useState(null);

  const [formData, setFormData] = useState({
    projectId: projects[0]?.id || 1,
    name: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    status: "Active",
  });

  const filtered = sprints.filter((s) => {
    if (selectedProjectId === "All") return true;
    return Number(s.projectId) === Number(selectedProjectId);
  });

  const handleOpenAdd = () => {
    setEditingSprint(null);
    setFormData({
      projectId: projects[0]?.id || 1,
      name: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      status: "Active",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (sprint) => {
    setEditingSprint(sprint);
    setFormData({
      projectId: sprint.projectId,
      name: sprint.name,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      status: sprint.status,
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSprint) {
      updateSprint(editingSprint.id, formData);
    } else {
      addSprint(formData);
    }
    setShowModal(false);
  };

  const getProjectTitle = (pId) => {
    const proj = projects.find((p) => Number(p.id) === Number(pId));
    return proj ? proj.title : `Project #${pId}`;
  };

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
       
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiClock className="text-purple-600" />
              Agile Sprint Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Configure project sprints, timelines, and active iterations
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-xs shadow transition"
          >
            <FiPlus size={16} />
            Create Sprint
          </button>
        </div>
      </div>

      {/* Project Filter */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <FiFilter size={16} className="text-purple-600" />
          <span>Filter by Project:</span>
        </div>
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 px-3 py-2 rounded-lg outline-none cursor-pointer focus:border-purple-500 max-w-xs"
        >
          <option value="All">All Projects ({projects.length})</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* Sprints Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-5 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
          <span className="col-span-2">Sprint Name</span>
          <span>Project</span>
          <span>Timeline & Status</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.map((item) => (
            <div key={item.id} className="grid grid-cols-5 px-5 py-4 items-center hover:bg-gray-50 text-sm">
              <div className="col-span-2 font-bold text-gray-900">{item.name}</div>
              <div>
                <span className="bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full text-xs font-semibold">
                  {getProjectTitle(item.projectId)}
                </span>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-800">
                  {item.startDate} to {item.endDate || "Ongoing"}
                </div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold mt-0.5 ${
                    item.status === "Completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : item.status === "Active"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="flex items-center justify-end gap-3 text-gray-400">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="hover:text-purple-600 transition"
                  title="Edit"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => deleteSprint(item.id)}
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
              No sprints found for selected project.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingSprint ? "Edit Sprint" : "Create Sprint"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Project *
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Sprint Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sprint 1: Auth & Wireframes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Planned">Planned</option>
                </select>
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
                  className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow"
                >
                  Save Sprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SprintManagement;
