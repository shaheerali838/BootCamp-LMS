import React, { useState, useEffect } from "react";
import { useTeamProject } from "../../../context/TeamProjectContext";
import { useBatches, useStudents } from "../../../context/AcademicContext";
import { useAdmins } from "../../../context/SystemContext";

function CreateTeam({ closeModal, initialData = null, editingTeam = null }) {
  const edit = initialData || editingTeam;
  const { addTeam, updateTeam } = useTeamProject();
  const { batches = [] } = useBatches();
  const { students = [] } = useStudents();
  const { admins = [] } = useAdmins();

  const [formData, setFormData] = useState({
    teamName: "",
    batchId: "",
    mentor: "",
    teamLead: "",
    status: "active",
  });

  // Populate form when editing
  useEffect(() => {
    if (edit) {
      setFormData({
        teamName: edit.teamName || edit.name || "",
        batchId: edit.batchId || (batches[0] ? (batches[0]._id || batches[0].id) : ""),
        mentor: edit.mentor || (admins[0] ? (admins[0]._id || admins[0].id) : ""),
        teamLead: edit.teamLead || (students[0] ? (students[0]._id || students[0].id) : ""),
        status: edit.status || "active",
      });
    } else {
      setFormData({
        teamName: "",
        batchId: batches[0] ? (batches[0]._id || batches[0].id) : "",
        mentor: admins[0] ? (admins[0]._id || admins[0].id) : "",
        teamLead: students[0] ? (students[0]._id || students[0].id) : "",
        status: "active",
      });
    }
  }, [edit, batches, admins, students]);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.teamName.trim()) {
      setError("Team Name is required.");
      return;
    }
    if (!formData.batchId) {
      setError("Please select a Target Batch. If none exist, create a Batch first.");
      return;
    }
    if (!formData.mentor) {
      setError("Please select an Assigned Mentor. If none exist, add one first.");
      return;
    }
    if (!formData.teamLead) {
      setError("Please select a Student Team Lead. If none exist, enroll a Student first.");
      return;
    }

    const payload = {
      ...formData,
      teamName: formData.teamName.trim(),
      batchId: formData.batchId,
      mentor: formData.mentor,
      teamLead: formData.teamLead,
    };

    try {
      if (edit) {
        await updateTeam(edit._id || edit.id, payload);
      } else {
        await addTeam(payload);
      }
      closeModal();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to save team.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
          <h2 className="text-xl font-bold text-gray-800">
            {edit ? "Edit Team" : "Create Team"}
          </h2>

          <button
            type="button"
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Team Name *
            </label>
            <input
              type="text"
              name="teamName"
              value={formData.teamName}
              onChange={handleChange}
              placeholder="e.g. Alpha Squad"
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Target Batch *
            </label>
            <select
              name="batchId"
              value={formData.batchId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-600"
            >
              <option value="">Select Batch</option>
              {batches.map((b) => (
                <option key={b._id || b.id} value={b._id || b.id}>
                  {b.batchName || b.name} ({b.program || "Tech"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Assigned Mentor *
            </label>
            <select
              name="mentor"
              value={formData.mentor}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-600"
            >
              <option value="">Select Mentor</option>
              {admins.map((a) => (
                <option key={a._id || a.id} value={a._id || a.id}>
                  {a.firstName ? `${a.firstName} ${a.lastName || ""}` : a.name} ({a.role || "Mentor"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Team Lead (Student) *
            </label>
            <select
              name="teamLead"
              value={formData.teamLead}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-600"
            >
              <option value="">Select Student Team Lead</option>
              {students.map((s) => (
                <option key={s._id || s.id} value={s._id || s.id}>
                  {s.name || `${s.firstName || ""} ${s.lastName || ""}`.trim()} ({s.rollNumber || s.rollNo || "Student"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-600"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 border border-gray-300 py-2.5 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 cursor-pointer"
            >
              {edit ? "Save Changes" : "Create Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTeam;