import React, { useState } from "react";
import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiLayers,
  FiCheckCircle,
  FiPlus,
  FiLoader,
  FiAlertCircle,
  FiArchive,
} from "react-icons/fi";
import { useBatches, useStudent } from "../../context/AcademicContext";

function BatchManagement() {
  const { batches, loading, error, addBatch, updateBatch, deleteBatch } =
    useBatches();
  const { students = [] } = useStudent();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [formData, setFormData] = useState({
    batchName: "",
    program: "",
    status: "active",
    startDate: "",
    endDate: "",
  });

  const filteredBatches = batches.filter(
    (b) =>
      (b.batchName || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.program || "").toLowerCase().includes(search.toLowerCase()),
  );

  const totalBatches = batches.length;
  const activeBatches = batches.filter((b) => b.status === "active").length;
  const completedBatches = batches.filter(
    (b) => b.status === "completed",
  ).length;

  const [modalError, setModalError] = useState("");

  const handleOpenAdd = () => {
    setEditingBatch(null);
    setModalError("");
    setFormData({
      batchName: "",
      program: "",
      status: "active",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (batch) => {
    setEditingBatch(batch);
    setModalError("");
    setFormData({
      batchName: batch.batchName || "",
      program: batch.program || "",
      status: batch.status || "active",
      startDate: batch.startDate
        ? new Date(batch.startDate).toISOString().split("T")[0]
        : "",
      endDate: batch.endDate
        ? new Date(batch.endDate).toISOString().split("T")[0]
        : "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!formData.batchName.trim()) {
      setModalError("Batch Name is required.");
      return;
    }
    if (!formData.program.trim()) {
      setModalError("Program Code is required.");
      return;
    }
    if (!formData.startDate) {
      setModalError("Start Date is required.");
      return;
    }

    try {
      if (editingBatch) {
        await updateBatch(editingBatch._id, {
          ...formData,
          batchName: formData.batchName.trim(),
          program: formData.program.trim(),
        });
      } else {
        await addBatch({
          ...formData,
          batchName: formData.batchName.trim(),
          program: formData.program.trim(),
        });
      }
      setShowModal(false);
    } catch (err) {
      setModalError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save batch. Please check inputs.",
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Ongoing";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-4 mt-5">
      {error && (
        <div className="mb-5 bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 text-sm">
          <FiAlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {totalBatches}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              Total Batches
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <FiLayers size={23} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {activeBatches}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              Active
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <FiCheckCircle size={23} className="text-green-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {completedBatches}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              Completed
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <FiArchive size={23} className="text-gray-500" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden relative min-h-50">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <FiLoader size={24} className="text-blue-600 animate-spin" />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 border-b border-gray-200">
          <div className="relative w-80">
            <FiSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or program..."
              className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleOpenAdd}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-full text-sm font-medium transition"
          >
            <FiPlus size={17} />
            Add Batch
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-[1.8fr_1fr_1.5fr_1.2fr_1fr_1fr] min-w-215 items-center px-4 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
            <span>Batch Name</span>
            <span>Program Code</span>
            <span>Duration</span>
            <span>Enrolled Students</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-gray-100 min-w-215">
            {filteredBatches.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-[1.8fr_1fr_1.5fr_1.2fr_1fr_1fr] items-center px-4 py-3 hover:bg-gray-50 transition"
              >
                <span className="text-sm font-medium text-gray-900">
                  {item.batchName}
                </span>
                <span className="text-xs text-gray-500">{item.program}</span>
                <span className="text-xs text-gray-500">
                  {formatDate(item.startDate)} - {formatDate(item.endDate)}
                </span>
                <span className="text-xs font-medium text-gray-700">
                  {item.totalStudents ??
                    (item.students?.length !== undefined
                      ? item.students.length
                      : students.filter(
                          (s) =>
                            (s.batchId?._id ||
                              s.batchId ||
                              s.batch?._id ||
                              s.batch) === item._id ||
                            s.batchName === item.batchName,
                        ).length)}{" "}
                  Students
                </span>
                <div>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      item.status === "active"
                        ? "bg-green-100 text-green-600"
                        : item.status === "completed"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="text-gray-400 hover:text-blue-600 transition"
                    title="Edit Batch"
                  >
                    <FiEdit2 size={17} />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this batch?",
                        )
                      ) {
                        deleteBatch(item._id);
                      }
                    }}
                    className="text-gray-400 hover:text-red-600 transition"
                    title="Delete Batch"
                  >
                    <FiTrash2 size={17} />
                  </button>
                </div>
              </div>
            ))}

            {!loading && filteredBatches.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-gray-500 text-sm">No batches found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingBatch ? "Edit Batch" : "Add Student Batch"}
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
                  Batch Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.batchName}
                  onChange={(e) =>
                    setFormData({ ...formData, batchName: e.target.value })
                  }
                  placeholder="e.g. Batch 11 - Web Development"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Program Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.program}
                  onChange={(e) =>
                    setFormData({ ...formData, program: e.target.value })
                  }
                  placeholder="e.g. B11-WEB"
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
                    required
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
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center gap-2 transition"
                >
                  {loading && <FiLoader className="animate-spin" />}
                  {editingBatch ? "Update Batch" : "Add Batch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BatchManagement;
