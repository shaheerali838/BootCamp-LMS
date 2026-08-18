import React, { useState } from "react";
import {
  FiCheckSquare,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiFilter,
  FiCheckCircle,
  FiClock,
  FiTarget,
} from "react-icons/fi";
import { useMilestones } from "../../context/WorkContext";
import { useTeamProject } from "../../context/TeamProjectContext";

function MilestoneManagement() {
  const { milestones, addMilestone, updateMilestone, deleteMilestone } =
    useMilestones();
  // Access dynamic projects from TeamProjectContext
  const { projects = [] } = useTeamProject();

  const [selectedProjectId, setSelectedProjectId] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    projectId: "",
    status: "Pending",
  });

  const getProjectTitle = (projId) => {
    const p = projects.find((item) => (item._id || item.id) === projId);
    return p ? (p.projectName || p.name || p.title) : "General Project";
  };

  const filtered = milestones.filter((m) => {
    const matchProject =
      selectedProjectId === "All" || m.projectId === selectedProjectId;
    const matchSearch =
      (m.milestoneName || m.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.description || "").toLowerCase().includes(search.toLowerCase());
    return matchProject && matchSearch;
  });

  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter(
    (m) => m.status === "Completed",
  ).length;
  const pendingMilestones = milestones.filter(
    (m) => m.status === "Pending" || m.status === "In Progress",
  ).length;

  const [modalError, setModalError] = useState("");

  const handleOpenAdd = () => {
    setEditingMilestone(null);
    setModalError("");
    setFormData({
      title: "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      projectId: projects[0] ? (projects[0]._id || projects[0].id) : "",
      status: "Pending",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (milestone) => {
    setEditingMilestone(milestone);
    setModalError("");
    setFormData({
      title: milestone.milestoneName || milestone.title || "",
      description: milestone.description || "",
      dueDate: milestone.dueDate ? new Date(milestone.dueDate).toISOString().split("T")[0] : "",
      projectId: milestone.projectId || (projects[0] ? (projects[0]._id || projects[0].id) : ""),
      status: milestone.status || "Pending",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!formData.title.trim()) {
      setModalError("Milestone Title is required.");
      return;
    }
    if (!formData.description.trim()) {
      setModalError("Description is required.");
      return;
    }
    if (!formData.projectId) {
      setModalError("Please select a Target Project. If none exist, create a Project first.");
      return;
    }

    const payload = {
      ...formData,
      title: formData.title.trim(),
      milestoneName: formData.title.trim(),
      description: formData.description.trim(),
    };

    try {
      if (editingMilestone) {
        await updateMilestone(editingMilestone._id || editingMilestone.id, payload);
      } else {
        await addMilestone(payload);
      }
      setShowModal(false);
    } catch (err) {
      setModalError(err?.response?.data?.message || err?.message || "Failed to save milestone.");
    }
  };

  return (
    <div className="p-4">
      {/* Page Header placeholder to match Students.jsx */}
      <div className="mb-5"></div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {totalMilestones}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              Total Milestones
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <FiTarget size={23} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {completedMilestones}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              Completed
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <FiCheckCircle size={23} className="text-green-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {pendingMilestones}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              Pending / Active
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <FiClock size={23} className="text-amber-500" />
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Search/Filter Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="relative">
              <FiFilter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-64 pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 cursor-pointer text-gray-700"
              >
                <option value="All">All Projects ({projects.length})</option>
                {projects.map((p) => (
                  <option key={p._id || p.id} value={p._id || p.id}>
                    {p.projectName || p.name || p.title || "Project"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition"
          >
            <FiPlus size={17} />
            Create Milestone
          </button>
        </div>

        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-5 min-w-200 items-center px-4 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
            <span className="col-span-2">Milestone Title</span>
            <span>Project</span>
            <span>Due Date & Status</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-100 min-w-200">
            {filtered.map((item) => (
              <div
                key={item._id || item.id}
                className="grid grid-cols-5 items-center px-4 py-3 border-t border-gray-100 hover:bg-gray-50 transition"
              >
                <div className="col-span-2 text-sm font-medium text-gray-900">
                  {item.title}
                </div>

                <div>
                  <span className="bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded text-xs">
                    {getProjectTitle(item.projectId)}
                  </span>
                </div>

                <div>
                  <div className="text-xs text-gray-800">{item.dueDate}</div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold mt-1 ${
                      item.status === "Completed"
                        ? "bg-green-100 text-green-600"
                        : item.status === "In Progress"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
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
                    onClick={() => {
                      if (window.confirm("Delete this milestone?")) {
                        deleteMilestone(item._id || item.id);
                      }
                    }}
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
                No milestones found.
              </div>
            )}
          </div>
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
              {modalError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{modalError}</span>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Project *
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) =>
                    setFormData({ ...formData, projectId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                >
                  {projects.map((p) => (
                    <option key={p._id || p.id} value={p._id || p.id}>
                      {p.projectName || p.name || p.title || "Project"}
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
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. UI Wireframes Completion"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows="2"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Details and criteria for this milestone..."
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
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
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
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  {editingMilestone ? "Save Changes" : "Create Milestone"}
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
