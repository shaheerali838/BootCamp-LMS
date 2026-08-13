import React from "react";
import {
  FiUser,
  FiCalendar,
  FiClock,
  FiUserCheck,
} from "react-icons/fi";

function TaskCard({ task, onAssign }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-600";

      case "In Progress":
        return "bg-blue-100 text-blue-600";

      case "Pending":
        return "bg-orange-100 text-orange-600";

      case "In Review":
        return "bg-purple-100 text-purple-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {task.title}
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            {task.description}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusStyle(
              task.status
            )}`}
          >
            {task.status}
          </span>

          {/* Assign Task Button for this specific card */}
          {onAssign && (
            <button
              onClick={() => onAssign(task)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition"
            >
              <FiUserCheck size={14} />
              Assign Task
            </button>
          )}
        </div>
      </div>

      {/* Task Information */}
      <div className="flex flex-wrap items-center gap-5 mt-5 pt-4 border-t border-gray-100">
        {/* Assigned By */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiUser size={17} className="text-blue-500" />

          <span>
            Assigned by{" "}
            <span className="font-medium text-gray-800">
              {task.assignedBy || "Admin User"}
            </span>
          </span>
        </div>

        {/* Assigned To (Student/Team) */}
        {task.assignedTo && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiUserCheck size={17} className="text-emerald-500" />
            <span>
              Assigned to:{" "}
              <span className="font-medium text-gray-800">
                {task.assignedTo}
              </span>
            </span>
          </div>
        )}

        {/* Assigned Date */}
        {task.assignedDate && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiCalendar size={17} className="text-blue-500" />

            <span>
              Assigned:{" "}
              <span className="font-medium text-gray-800">
                {task.assignedDate}
              </span>
            </span>
          </div>
        )}

        {/* Due Date */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiClock size={17} className="text-blue-500" />

          <span>
            Due:{" "}
            <span className="font-medium text-gray-800">
              {task.dueDate}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;