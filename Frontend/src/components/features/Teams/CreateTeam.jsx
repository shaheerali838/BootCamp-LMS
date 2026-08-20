import React, { useState, useEffect, useMemo } from "react";
import { useTeamProject } from "../../../context/TeamProjectContext";
import { useBatches, useStudents } from "../../../context/AcademicContext";
import { useAdmins } from "../../../context/SystemContext";
import { FiUsers, FiX, FiCheck, FiLoader } from "react-icons/fi";

function CreateTeam({ closeModal, initialData = null, editingTeam = null }) {
  const edit = initialData || editingTeam;
  const { addTeam, updateTeam } = useTeamProject();
  const { batches = [] } = useBatches();
  const { students = [] } = useStudents();
  const { admins = [], mentors = [], fetchMentors } = useAdmins();

  const availableMentors = useMemo(() => {
    return (mentors.length > 0 ? mentors : admins).filter((m) => {
      const r = (m.role || "").toUpperCase().replace(/[\s_]+/g, "");
      return r !== "SUPERADMIN";
    });
  }, [mentors, admins]);

  const getEditBatchId = () => {
    if (!edit) return batches[0]?._id || batches[0]?.id || "";
    return edit.batchId?._id || (typeof edit.batchId === "string" ? edit.batchId : "") || batches[0]?._id || batches[0]?.id || "";
  };

  const getEditMentorId = () => {
    if (!edit) return availableMentors[0]?._id || availableMentors[0]?.id || "";
    return edit.mentor?._id || (typeof edit.mentor === "string" ? edit.mentor : "") || availableMentors[0]?._id || availableMentors[0]?.id || "";
  };

  const getEditTeamLeadId = () => {
    if (!edit) return students[0]?._id || students[0]?.id || "";
    return edit.teamLead?._id || (typeof edit.teamLead === "string" ? edit.teamLead : "") || students[0]?._id || students[0]?.id || "";
  };

  const getEditMembers = () => {
    if (!edit || !Array.isArray(edit.members)) return [];
    return edit.members.map((m) => m?._id || m?.id || m);
  };

  const [formData, setFormData] = useState({
    teamName: edit ? (edit.teamName || edit.name || "") : "",
    batchId: getEditBatchId(),
    mentor: getEditMentorId(),
    teamLead: getEditTeamLeadId(),
    members: getEditMembers(),
    status: edit ? (edit.status || "active") : "active",
  });

  const [memberSearch, setMemberSearch] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (fetchMentors) fetchMentors();
  }, [fetchMentors]);

  // Populate form when editing
  useEffect(() => {
    if (edit) {
      const membersList = Array.isArray(edit.members)
        ? edit.members.map((m) => m?._id || m?.id || m)
        : [];

      setFormData({
        teamName: edit.teamName || edit.name || "",
        batchId: edit.batchId?._id || (typeof edit.batchId === "string" ? edit.batchId : "") || (batches[0] ? (batches[0]._id || batches[0].id) : ""),
        mentor: edit.mentor?._id || (typeof edit.mentor === "string" ? edit.mentor : "") || (availableMentors[0] ? (availableMentors[0]._id || availableMentors[0].id) : ""),
        teamLead: edit.teamLead?._id || (typeof edit.teamLead === "string" ? edit.teamLead : "") || (students[0] ? (students[0]._id || students[0].id) : ""),
        members: membersList,
        status: edit.status || "active",
      });
    }
  }, [edit]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleToggleMember = (studentId) => {
    setFormData((prev) => {
      const current = prev.members || [];
      const exists = current.includes(studentId);
      return {
        ...prev,
        members: exists
          ? current.filter((id) => id !== studentId)
          : [...current, studentId],
      };
    });
  };

  const filteredStudentsForMembers = useMemo(() => {
    return students.filter((s) => {
      const sId = s._id || s.id;
      // Don't show the selected team lead in member selector since they are already the lead
      if (sId === formData.teamLead) return false;
      const query = memberSearch.toLowerCase();
      const name = (s.firstName ? `${s.firstName} ${s.lastName || ""}` : s.name || "").toLowerCase();
      const roll = (s.rollNumber || s.rollNo || "").toLowerCase();
      const email = (s.email || "").toLowerCase();
      return name.includes(query) || roll.includes(query) || email.includes(query);
    });
  }, [students, formData.teamLead, memberSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.teamName.trim()) {
      setError("Team Name is required.");
      return;
    }
    if (!formData.batchId) {
      setError("Please select a Batch. If no batches exist, create one first.");
      return;
    }
    if (!formData.mentor) {
      setError("Please select an Assigned Mentor.");
      return;
    }
    if (!formData.teamLead) {
      setError("Please select a Student Team Lead.");
      return;
    }

    try {
      setSubmitting(true);
      if (edit) {
        await updateTeam(edit._id || edit.id, formData);
      } else {
        await addTeam(formData);
      }
      closeModal();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to save team.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-xl relative max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {edit ? "Edit Team" : "Create New Team"}
          </h2>
          <button
            type="button"
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto pt-4 space-y-4 text-xs pr-1">
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
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-600 text-xs"
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
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-600 text-xs"
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
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-600 text-xs"
            >
              <option value="">Select Mentor</option>
              {availableMentors.map((a) => (
                <option key={a._id || a.id} value={a._id || a.id}>
                  {a.firstName ? `${a.firstName} ${a.lastName || ""}` : a.name}
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
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-600 text-xs"
            >
              <option value="">Select Student Team Lead</option>
              {students.map((s) => (
                <option key={s._id || s.id} value={s._id || s.id}>
                  {s.firstName ? `${s.firstName} ${s.lastName || ""}` : s.name} ({s.rollNumber || s.rollNo || s.email})
                </option>
              ))}
            </select>
          </div>

          {/* Team Members Multi-Select Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                <FiUsers size={14} className="text-blue-600" />
                <span>Team Members ({(formData.members || []).length} Selected)</span>
              </div>
              <span className="text-[11px] text-gray-500">
                Assign students to this team
              </span>
            </div>

            <input
              type="text"
              placeholder="Search students by name or roll number..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:border-blue-500"
            />

            {/* Selected Members Chips */}
            {(formData.members || []).length > 0 && (
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pt-1">
                {(formData.members || []).map((mId) => {
                  const stud = students.find((s) => (s._id || s.id) === mId);
                  if (!stud) return null;
                  const name = stud.firstName
                    ? `${stud.firstName} ${stud.lastName || ""}`.trim()
                    : stud.name || "Student";
                  return (
                    <span
                      key={mId}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[11px] font-medium"
                    >
                      <span>{name}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleMember(mId)}
                        className="hover:text-red-600 transition cursor-pointer"
                      >
                        <FiX size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Students List with Checkboxes */}
            <div className="max-h-36 overflow-y-auto space-y-1 bg-white border border-gray-200 rounded-lg p-2 divide-y divide-gray-100">
              {filteredStudentsForMembers.map((s) => {
                const sId = s._id || s.id;
                const isSelected = (formData.members || []).includes(sId);
                const sName = s.firstName
                  ? `${s.firstName} ${s.lastName || ""}`.trim()
                  : s.name || "Student";
                const roll = s.rollNumber || s.rollNo || s.email;

                return (
                  <label
                    key={sId}
                    className="flex items-center justify-between p-1.5 hover:bg-blue-50/50 rounded cursor-pointer transition text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleMember(sId)}
                        className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="font-medium text-gray-800">{sName}</span>
                    </div>
                    <span className="text-gray-400 text-[11px]">({roll})</span>
                  </label>
                );
              })}
              {filteredStudentsForMembers.length === 0 && (
                <div className="py-2 text-center text-gray-400 text-[11px]">
                  No matching students found.
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Team Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-600 text-xs"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={closeModal}
              disabled={submitting}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition cursor-pointer text-xs disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <FiLoader size={14} className="animate-spin" />
                  <span>{edit ? "Updating Team..." : "Creating Team..."}</span>
                </>
              ) : (
                <span>{edit ? "Save Changes" : "Create Team"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTeam;
