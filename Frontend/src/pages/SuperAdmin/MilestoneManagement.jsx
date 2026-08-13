import React, { useState } from "react";
import { FiCheckSquare, FiPlus, FiTrash2, FiEdit2, FiFilter } from "react-icons/fi";
import { useMilestones } from "../../context/MilestoneContext";
import { useProjects } from "../../context/ProjectContext";

function MilestoneManagement() {
  const { milestones, addMilestone, updateMilestone, deleteMilestone } = useMilestones();
  const { projects } = useProjects();

  const [selectedProjectId, setSelectedProjectId] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);

  const [formData, setFormData] = useState({
    projectId: projects[0]?.id || 1,
    title: "",
    dueDate: new Date().toISOString().split("T")[0],
    status: "Pending",
  });

  const filtered = milestones.filter((m) => {
    if (selectedProjectId === "All") return true;
    return Number(m.projectId) === Number(selectedProjectId);
  });

  const handleOpenAdd = () => {
    setEditingMilestone(null);
    setFormData({
      projectId: projects[0]?.id || 1,
      title: "",
      dueDate: new Date().toISOString().split("T")[0],
      status: "Pending",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (milestone) => {
    setEditingMilestone(milestone);
    setFormData({
      projectId: milestone.projectId,
      title: milestone.title,
      dueDate: milestone.dueDate,
      status: milestone.status,
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingMilestone) {
      updateMilestone(editingMilestone.id, formData);
    } else {
      addMilestone(formData);
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
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>SuperAdmin</span>
          <span>›</span>
          <span className="font-semibold text-gray-800">Milestone Management</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiCheckSquare className="text-blue-600" />
              Project Milestones
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track and assign key deliverables per project
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-xs shadow transition"
          >
            <FiPlus size={16} />
            Create Milestone
          </button>
        </div>
      </div>

      {/* Project Filter */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <FiFilter size={16} className="text-blue-600" />
          <span>Filter by Project:</span>
        </div>
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 px-3 py-2 rounded-lg outline-none cursor-pointer focus:border-blue-500 max-w-xs"
        >
          <option value="All">All Projects ({projects.length})</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* Milestones Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-5 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
          <span className="col-span-2">Milestone Title</span>
          <span>Project</span>
          <span>Due Date & Status</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.map((item) => (
            <div key={item.id} className="grid grid-cols-5 px-5 py-4 items-center hover:bg-gray-50 text-sm">
              <div className="col-span-2 font-bold text-gray-900">{item.title}</div>
              <div>
                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
                  {getProjectTitle(item.projectId)}
                </span>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-800">{item.dueDate}</div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold mt-0.5 ${
                    item.status === "Completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : item.status === "In Progress"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="flex items-center justify-end gap-3 text-gray-400">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="hover:text-blue-600 transition"
                  title="Edit"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => deleteMilestone(item.id)}
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
              No milestones found for selected project.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingMilestone ? "Edit Milestone" : "Create Milestone"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Project *
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
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
                  Milestone Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. UI Wireframes Completion"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
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
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MilestoneManagement;
