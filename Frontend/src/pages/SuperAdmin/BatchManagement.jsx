import React, { useState } from "react";
import { FiLayers, FiPlus, FiTrash2, FiEdit2, FiSearch, FiLoader, FiAlertCircle } from "react-icons/fi";
import { useBatches } from "../../context/BatchContext";

function BatchManagement() {
  const { batches, loading, error, addBatch, updateBatch, deleteBatch } = useBatches();
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

  const filtered = batches.filter(
    (b) =>
      (b.batchName || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.program || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingBatch(null);
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
    setFormData({
      batchName: batch.batchName,
      program: batch.program,
      status: batch.status,
      startDate: batch.startDate ? new Date(batch.startDate).toISOString().split("T")[0] : "",
      endDate: batch.endDate ? new Date(batch.endDate).toISOString().split("T")[0] : "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingBatch) {
      await updateBatch(editingBatch._id, formData);
    } else {
      await addBatch(formData);
    }
    setShowModal(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Ongoing";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiLayers className="text-amber-600" />
              Batch Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Create and configure academic training batches
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg font-medium text-xs shadow transition"
          >
            <FiPlus size={16} />
            Create New Batch
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 text-sm">
          <FiAlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="relative max-w-md">
          <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search batches by name or program..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm relative min-h-[200px]">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <FiLoader size={24} className="text-amber-600 animate-spin" />
          </div>
        )}
        
        <div className="grid grid-cols-6 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
          <span className="col-span-2">Batch Name</span>
          <span>Program Code</span>
          <span>Enrolled Students</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.map((item) => (
            <div key={item._id} className="grid grid-cols-6 px-5 py-4 items-center hover:bg-gray-50 text-sm">
              <div className="col-span-2">
                <div className="font-bold text-gray-900">{item.batchName}</div>
                <div className="text-xs text-gray-400">{formatDate(item.startDate)} - {formatDate(item.endDate)}</div>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block w-max">
                {item.program}
              </span>
              <span className="text-xs text-gray-700 font-medium">0 Students</span>
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    item.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="flex items-center justify-end gap-3 text-gray-400">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="hover:text-amber-600 transition"
                  title="Edit"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => {
                    if(window.confirm("Are you sure you want to delete this batch?")) {
                      deleteBatch(item._id);
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
          {!loading && filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-500">
              No batches found.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingBatch ? "Edit Batch" : "Create New Batch"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Batch Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.batchName}
                  onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
                  placeholder="Batch 11 - Web Development"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-amber-500"
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
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  placeholder="B11-WEB"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-amber-500"
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
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-amber-500"
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
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-amber-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-amber-500"
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
                  className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <FiLoader className="animate-spin" />}
                  Save Batch
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
