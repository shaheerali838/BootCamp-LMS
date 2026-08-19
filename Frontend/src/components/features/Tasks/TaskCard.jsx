import React from "react";
import {
  FiUser,
  FiCalendar,
  FiClock,
  FiUserCheck,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

function TaskCard({ task, onAssign, onEdit, onDelete }) {
  const getStatusStyle = (status) => {
    const s = String(status || "").toLowerCase();
    switch (s) {
      case "completed":
      case "done":
        return "bg-green-100 text-green-700 border-green-200";

      case "in progress":
      case "inprogress":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "in review":
      case "inreview":
        return "bg-purple-100 text-purple-700 border-purple-200";

      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Not set";
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

  // Determine who the task is assigned to
  const getAssigneeLabel = () => {
    if (task.assignedStudentId) {
      if (typeof task.assignedStudentId === "object") {
        return (
          task.assignedStudentId.firstName
            ? `${task.assignedStudentId.firstName} ${task.assignedStudentId.lastName || ""}`.trim()
            : task.assignedStudentId.name || "Assigned Student"
        );
      }
      return "Assigned Student";
    }
    if (task.assignedTeamId) {
      if (typeof task.assignedTeamId === "object") {
        return task.assignedTeamId.teamName || task.assignedTeamId.name || "Assigned Team";
      }
      return "Assigned Team";
    }
    return task.assignedTo || "Unassigned";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {task.title || "Untitled Task"}
          </h2>

          {task.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(
              task.status
            )}`}
          >
            {task.status || "Pending"}
          </span>

          {/* Combined Edit / Assign Button */}
          {(onEdit || onAssign) && (
            <button
              onClick={() => (onEdit ? onEdit(task) : onAssign(task))}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition cursor-pointer"
              title="Edit Task and Assignments"
            >
              <FiEdit2 size={13} />
              <span>Edit / Assign</span>
            </button>
          )}

          {/* Delete Button */}
          {onDelete && (
            <button
              onClick={() => onDelete(task._id || task.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Delete Task"
            >
              <FiTrash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Task Information */}
      <div className="flex flex-wrap items-center gap-5 mt-4 pt-4 border-t border-gray-100">
        {/* Assigned By */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FiUser size={15} className="text-blue-500" />
          <span>
            By:{" "}
            <strong className="text-gray-800">
              {task.assignedBy || "Admin"}
            </strong>
          </span>
        </div>

        {/* Assigned To (Student/Team) */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FiUserCheck size={15} className="text-emerald-500" />
          <span>
            Assigned to:{" "}
            <strong className="text-gray-800">
              {getAssigneeLabel()}
            </strong>
          </span>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FiClock size={15} className="text-purple-500" />
          <span>
            Due:{" "}
            <strong className="text-gray-800">
              {formatDate(task.dueDate)}
            </strong>
          </span>
        </div>

        {/* Priority */}
        {task.priority && (
          <div className="ml-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-700">
              {task.priority} Priority
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskCard;