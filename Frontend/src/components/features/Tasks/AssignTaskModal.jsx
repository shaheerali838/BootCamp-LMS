import React, { useState, useEffect } from "react";
import { FiX, FiClipboard } from "react-icons/fi";
import { useStudents } from "../../../context/AcademicContext";
import { useTeamProject } from "../../../context/TeamProjectContext";
import { useSprints } from "../../../context/WorkContext";

function AssignTaskModal({ onClose, onAssign, taskToAssign = null }) {
  const { students = [] } = useStudents();
  const { teams = [] } = useTeamProject();
  const { sprints = [] } = useSprints();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sprintId: "",
    assignedType: "team", // "team" or "student"
    assignedId: "",
    dueDate: new Date().toISOString().split("T")[0],
    priority: "Medium",
    status: "Pending",
  });

  useEffect(() => {
    if (taskToAssign) {
      setFormData({
        title: taskToAssign.title || "",
        description: taskToAssign.description || "",
        sprintId: taskToAssign.sprintId || (sprints[0]?._id || sprints[0]?.id || ""),
        assignedType: taskToAssign.assignedStudentId ? "student" : "team",
        assignedId: taskToAssign.assignedStudentId || taskToAssign.assignedTeamId || (teams[0]?._id || teams[0]?.id || ""),
        dueDate: taskToAssign.dueDate ? new Date(taskToAssign.dueDate).toISOString().split("T")[0] : "",
        priority: taskToAssign.priority || "Medium",
        status: taskToAssign.status || "Pending",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        sprintId: sprints[0]?._id || sprints[0]?.id || "",
        assignedType: "team",
        assignedId: teams[0]?._id || teams[0]?.id || "",
        dueDate: new Date().toISOString().split("T")[0],
        priority: "Medium",
        status: "Pending",
      });
    }
  }, [taskToAssign, teams, students, sprints]);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Task Title is required.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Task Description is required.");
      return;
    }
    if (!formData.dueDate) {
      setError("Due Date is required.");
      return;
    }

    const assignedTeamId = formData.assignedType === "team" ? formData.assignedId : (teams[0]?._id || teams[0]?.id);
    const assignedStudentId = formData.assignedType === "student" ? formData.assignedId : (students[0]?._id || students[0]?.id);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      sprintId: formData.sprintId || (sprints[0]?._id || sprints[0]?.id || undefined),
      assignedTeamId,
      assignedStudentId,
      dueDate: formData.dueDate,
      priority: formData.priority,
      status: formData.status,
      assignedDate: new Date().toISOString().split("T")[0],
      assignedBy: "Admin",
    };

    try {
      if (taskToAssign) {
        onAssign({
          id: taskToAssign._id || taskToAssign.id,
          ...taskToAssign,
          ...payload,
        });
      } else {
        onAssign(payload);
      }
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to assign task.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <FiClipboard size={18} />
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900">
                {taskToAssign
                  ? `Assign Task: ${taskToAssign.title}`
                  : "Create New Task"}
              </h2>

              <p className="text-xs text-gray-500">
                Define task deliverables, priority, and assignees
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition cursor-pointer text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          {/* Task Title */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Implement User Authentication Flow"
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Provide clear technical objectives and acceptance criteria..."
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target Sprint */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Target Sprint
              </label>
              <select
                name="sprintId"
                value={formData.sprintId}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
              >
                <option value="">Select Sprint (Optional)</option>
                {sprints.map((s) => (
                  <option key={s._id || s.id} value={s._id || s.id}>
                    {s.sprintName || s.name || "Sprint"}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignment Type */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Assign Target *
              </label>
              <div className="flex gap-2 mb-1">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, assignedType: "team", assignedId: teams[0]?._id || teams[0]?.id || "" })}
                  className={`flex-1 py-1 rounded border text-xs font-semibold ${
                    formData.assignedType === "team" ? "bg-blue-600 text-white border-blue-600" : "bg-gray-50 text-gray-600"
                  }`}
                >
                  Team
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, assignedType: "student", assignedId: students[0]?._id || students[0]?.id || "" })}
                  className={`flex-1 py-1 rounded border text-xs font-semibold ${
                    formData.assignedType === "student" ? "bg-blue-600 text-white border-blue-600" : "bg-gray-50 text-gray-600"
                  }`}
                >
                  Individual Student
                </button>
              </div>

              {formData.assignedType === "team" ? (
                <select
                  name="assignedId"
                  value={formData.assignedId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
                >
                  {teams.map((t) => (
                    <option key={t._id || t.id} value={t._id || t.id}>
                      {t.teamName || t.name}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  name="assignedId"
                  value={formData.assignedId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
                >
                  {students.map((s) => (
                    <option key={s._id || s.id} value={s._id || s.id}>
                      {s.name || `${s.firstName || ""} ${s.lastName || ""}`.trim()} ({s.rollNumber || s.rollNo || "Student"})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold cursor-pointer"
            >
              {taskToAssign ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssignTaskModal;