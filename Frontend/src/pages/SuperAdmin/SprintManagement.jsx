import React, { useState } from "react";
import {
  FiClock,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiFilter,
  FiCheckCircle,
  FiRefreshCw,
  FiActivity,
} from "react-icons/fi";
import { useSprints } from "../../context/WorkContext";
import { useTeamProject } from "../../context/TeamProjectContext";

function SprintManagement() {
  const { sprints, addSprint, updateSprint, deleteSprint } = useSprints();
  // Access dynamic projects from TeamProjectContext
  const { projects = [] } = useTeamProject();

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

  const totalSprints = sprints.length;
  const activeSprints = sprints.filter((s) => s.status === "Active").length;
  const completedSprints = sprints.filter(
    (s) => s.status === "Completed",
  ).length;

  const [modalError, setModalError] = useState("");

  const handleOpenAdd = () => {
    setEditingSprint(null);
    setModalError("");
    setFormData({
      projectId: projects[0] ? (projects[0]._id || projects[0].id) : "",
      name: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      status: "Active",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (sprint) => {
    setEditingSprint(sprint);
    setModalError("");
    setFormData({
      projectId: sprint.projectId || (projects[0] ? (projects[0]._id || projects[0].id) : ""),
      name: sprint.sprintName || sprint.name || "",
      startDate: sprint.startDate ? new Date(sprint.startDate).toISOString().split("T")[0] : "",
      endDate: sprint.endDate ? new Date(sprint.endDate).toISOString().split("T")[0] : "",
      status: sprint.status || "Active",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!formData.name.trim()) {
      setModalError("Sprint Name is required.");
      return;
    }
    if (!formData.projectId) {
      setModalError("Please select a Target Project. If none exist, create a Project first.");
      return;
    }
    if (!formData.startDate) {
      setModalError("Start Date is required.");
      return;
    }

    const payload = {
      ...formData,
      name: formData.name.trim(),
      sprintName: formData.name.trim(),
    };

    try {
      if (editingSprint) {
        await updateSprint(editingSprint._id || editingSprint.id, payload);
      } else {
        await addSprint(payload);
      }
      setShowModal(false);
    } catch (err) {
      setModalError(err?.response?.data?.message || err?.message || "Failed to save sprint.");
    }
  };

  const getProjectTitle = (pId) => {
    const proj = projects.find((p) => Number(p.id) === Number(pId));
    return proj ? proj.title : `Project #${pId}`;
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
              {totalSprints}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              Total Sprints
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <FiActivity size={23} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {activeSprints}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              Active Sprints
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <FiRefreshCw size={23} className="text-green-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {completedSprints}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              Completed
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <FiCheckCircle size={23} className="text-gray-500" />
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
            Create Sprint
          </button>
        </div>

        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-5 min-w-200 items-center px-4 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
            <span className="col-span-2">Sprint Name</span>
            <span>Project</span>
            <span>Timeline & Status</span>
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
                  {item.sprintName || item.name || item.title || "Sprint"}
                </div>

                <div>
                  <span className="bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded text-xs">
                    {getProjectTitle(item.projectId)}
                  </span>
                </div>

                <div>
                  <div className="text-xs text-gray-800">
                    {item.startDate} {item.endDate ? `to ${item.endDate}` : ""}
                  </div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold mt-1 ${
                      item.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : item.status === "Planning"
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
                      if (window.confirm("Delete this sprint?")) {
                        deleteSprint(item._id || item.id);
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
                No sprints found.
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
              {editingSprint ? "Edit Sprint" : "Create Sprint"}
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
                  Sprint Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Sprint 1: Auth & Wireframes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
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
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
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
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  {editingSprint ? "Save Changes" : "Create Sprint"}
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
