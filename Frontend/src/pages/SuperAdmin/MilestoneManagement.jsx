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
  FiLoader,
} from "react-icons/fi";
import { useMilestones } from "../../context/WorkContext";
import { useTeamProject } from "../../context/TeamProjectContext";
import { PageSkeleton } from "../../components/common/Skeleton";

function MilestoneManagement() {
  const { milestones, loading, addMilestone, updateMilestone, deleteMilestone } =
    useMilestones();
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
    if (!projId) return "General Project";
    const pId = projId?._id || projId;
    const p = projects.find(
      (item) => String(item._id || item.id) === String(pId),
    );
    return p ? p.projectName || p.name || p.title : "General Project";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "No date set";
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

  const filtered = milestones.filter((m) => {
    const mProjId = m.projectId?._id || m.projectId;
    const matchProject =
      selectedProjectId === "All" ||
      String(mProjId) === String(selectedProjectId);
    const title = (m.milestoneName || m.title || "").toLowerCase();
    const desc = (m.description || "").toLowerCase();
    const matchSearch =
      title.includes(search.toLowerCase()) ||
      desc.includes(search.toLowerCase());
    return matchProject && matchSearch;
  });

  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter(
    (m) => String(m.status).toLowerCase() === "completed",
  ).length;
  const pendingMilestones = milestones.filter(
    (m) =>
      String(m.status).toLowerCase() === "pending" ||
      String(m.status).toLowerCase() === "in progress",
  ).length;

  const [modalError, setModalError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingMilestone(null);
    setModalError("");
    setFormData({
      title: "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      projectId: projects[0] ? projects[0]._id || projects[0].id : "",
      status: "Pending",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (m) => {
    setEditingMilestone(m);
    setModalError("");
    const pId = m.projectId?._id || m.projectId || (projects[0] ? projects[0]._id || projects[0].id : "");
    setFormData({
      title: m.title || m.milestoneName || "",
      description: m.description || "",
      dueDate: m.dueDate ? new Date(m.dueDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      projectId: pId,
      status: m.status || "Pending",
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
    if (!formData.projectId) {
      setModalError("Please select a Project.");
      return;
    }
    if (!formData.dueDate) {
      setModalError("Due Date is required.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      milestoneName: formData.title.trim(),
      projectId: formData.projectId,
      dueDate: formData.dueDate,
      status: formData.status,
      description: formData.description.trim(),
    };

    setSubmitting(true);
    try {
      if (editingMilestone) {
        await updateMilestone(
          editingMilestone._id || editingMilestone.id,
          payload,
        );
      } else {
        await addMilestone(payload);
      }
      setShowModal(false);
    } catch (err) {
      setModalError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save milestone.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && milestones.length === 0) {
    return <PageSkeleton statCount={3} rowCount={6} />;
  }

  return (
    <div className="p-4">
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
              Pending / In Progress
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <FiClock size={23} className="text-amber-600" />
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Search/Filter Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <FiFilter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 cursor-pointer text-gray-700"
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
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition cursor-pointer shrink-0"
          >
            <FiPlus size={17} />
            Create Milestone
          </button>
        </div>

        <div className="overflow-x-auto w-full min-w-0 max-w-full">
          {/* Table Header */}
          <div className="grid grid-cols-5 min-w-150 items-center px-4 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
            <span className="col-span-2">Milestone Title</span>
            <span>Project</span>
            <span>Due Date & Status</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-100 min-w-150">
            {filtered.map((item) => (
              <div
                key={item._id || item.id}
                className="grid grid-cols-5 items-center px-4 py-3 hover:bg-gray-50 transition text-sm"
              >
                <div className="col-span-2">
                  <div className="text-sm font-semibold text-gray-900">
                    {item.milestoneName ||
                      item.title ||
                      item.name ||
                      "Untitled Milestone"}
                  </div>
                  {item.description && (
                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {item.description}
                    </div>
                  )}
                </div>

                <div>
                  <span className="bg-gray-100 text-gray-700 border border-gray-200 px-2 py-0.5 rounded text-xs font-medium">
                    {getProjectTitle(item.projectId)}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-800">
                    {formatDate(item.dueDate)}
                  </div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold mt-1 ${
                      String(item.status).toLowerCase() === "completed"
                        ? "bg-green-100 text-green-700"
                        : String(item.status).toLowerCase() === "in progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.status || "Pending"}
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
                      if (window.confirm("Delete this milestone?")) {
                        deleteMilestone(item._id || item.id);
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
                  Milestone Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Design Wireframes"
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

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="2"
                  placeholder="Optional details about this milestone..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  required
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
                  className="flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <FiLoader size={14} className="animate-spin" />
                      <span>{editingMilestone ? "Updating Milestone..." : "Creating Milestone..."}</span>
                    </>
                  ) : (
                    <span>{editingMilestone ? "Save Changes" : "Create Milestone"}</span>
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

export default MilestoneManagement;
