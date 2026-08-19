import React, { useState } from "react";
import {
  FiActivity,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiFilter,
  FiCheckCircle,
  FiRefreshCw,
  FiClock,
  FiLoader,
} from "react-icons/fi";
import { useSprints } from "../../context/WorkContext";
import { useTeamProject } from "../../context/TeamProjectContext";

function SprintManagement() {
  const { sprints, addSprint, updateSprint, deleteSprint } = useSprints();
  const { projects = [] } = useTeamProject();

  const [selectedProjectId, setSelectedProjectId] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingSprint, setEditingSprint] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    projectId: "",
    status: "Active",
  });

  const getProjectTitle = (pId) => {
    if (!pId) return "General Project";
    const projId = pId?._id || pId;
    const proj = projects.find((p) => String(p._id || p.id) === String(projId));
    return proj
      ? proj.projectName || proj.name || proj.title
      : "General Project";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const filtered = sprints.filter((s) => {
    const sProjId = s.projectId?._id || s.projectId;
    if (selectedProjectId === "All") return true;
    return String(sProjId) === String(selectedProjectId);
  });

  const totalSprints = sprints.length;
  const activeSprints = sprints.filter(
    (s) => String(s.status).toLowerCase() === "active",
  ).length;
  const completedSprints = sprints.filter(
    (s) => String(s.status).toLowerCase() === "completed",
  ).length;

  const [modalError, setModalError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingSprint(null);
    setModalError("");
    setFormData({
      name: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      projectId: projects[0] ? projects[0]._id || projects[0].id : "",
      status: "Active",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (sprint) => {
    setEditingSprint(sprint);
    setModalError("");
    const sProjId = sprint.projectId?._id || sprint.projectId;
    setFormData({
      name: sprint.sprintName || sprint.name || sprint.title || "",
      startDate: sprint.startDate
        ? new Date(sprint.startDate).toISOString().split("T")[0]
        : "",
      endDate: sprint.endDate
        ? new Date(sprint.endDate).toISOString().split("T")[0]
        : "",
      projectId:
        sProjId || (projects[0] ? projects[0]._id || projects[0].id : ""),
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
      setModalError(
        "Please select a Target Project. If none exist, create a Project first.",
      );
      return;
    }
    if (!formData.startDate) {
      setModalError("Start Date is required.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      sprintName: formData.name.trim(),
      projectId: formData.projectId,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      status: formData.status,
    };

    setSubmitting(true);
    try {
      if (editingSprint) {
        await updateSprint(editingSprint._id || editingSprint.id, payload);
      } else {
        await addSprint(payload);
      }
      setShowModal(false);
    } catch (err) {
      setModalError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save sprint.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
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
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition cursor-pointer"
          >
            <FiPlus size={17} />
            Create Sprint
          </button>
        </div>

        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-5 min-w-150 items-center px-4 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
            <span className="col-span-2">Sprint Name</span>
            <span>Project</span>
            <span>Timeline & Status</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-100 min-w-150">
            {filtered.map((item) => (
              <div
                key={item._id || item.id}
                className="grid grid-cols-5 items-center px-4 py-3 border-t border-gray-100 hover:bg-gray-50 transition"
              >
                <div className="col-span-2 text-sm font-semibold text-gray-900">
                  {item.sprintName || item.name || item.title || "Sprint"}
                </div>

                <div>
                  <span className="bg-gray-100 text-gray-700 border border-gray-200 px-2 py-0.5 rounded text-xs font-medium">
                    {getProjectTitle(item.projectId)}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-800">
                    {formatDate(item.startDate)}
                    {item.endDate ? ` to ${formatDate(item.endDate)}` : ""}
                  </div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold mt-1 ${
                      String(item.status).toLowerCase() === "active"
                        ? "bg-green-100 text-green-700"
                        : String(item.status).toLowerCase() === "completed"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item.status || "Active"}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 text-gray-400">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="hover:text-blue-600 transition cursor-pointer"
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
                    className="hover:text-red-600 transition cursor-pointer"
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
                  Sprint Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Sprint 1 - MVP"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Project *
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) =>
                    setFormData({ ...formData, projectId: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p._id || p.id} value={p._id || p.id}>
                      {p.projectName || p.name || p.title || "Project"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
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
                  <option value="Planning">Planning</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <FiLoader size={14} className="animate-spin" />
                      <span>{editingSprint ? "Updating Sprint..." : "Creating Sprint..."}</span>
                    </>
                  ) : (
                    <span>{editingSprint ? "Save Changes" : "Create Sprint"}</span>
                  )}
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
