import React from "react";
import { Link } from "react-router-dom";
import { useTasks } from "../../../context/TaskContext";

function TodayTaskPreview() {
  const { tasks } = useTasks();

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-600";

      case "On Track":
        return "bg-blue-100 text-blue-600";

      case "In Progress":
        return "bg-orange-100 text-orange-600";

      case "Needs Attention":
        return "bg-red-100 text-red-600";

      case "Pending":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Today's Tasks
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Tasks assigned by instructors
          </p>
        </div>

        <Link
          to="/tasks"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All
        </Link>
      </div>

      {/* Tasks */}
      <div className="space-y-3 mt-5">
        {tasks.slice(0, 4).map((task) => (
          <div
            key={task.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            {/* Task Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  {task.title}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Assigned by {task.assignedBy}
                </p>
              </div>

              <span
                className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium ${getStatusStyle(
                  task.status
                )}`}
              >
                {task.status}
              </span>
            </div>

            {/* Task Details */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-gray-500">
                Due: {task.dueDate}
              </span>

              <span className="text-xs font-medium text-gray-600">
                {task.priority}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* No Tasks */}
      {tasks.length === 0 && (
        <div className="py-10 text-center">
          <p className="text-sm text-gray-500">
            No tasks available.
          </p>
        </div>
      )}
    </div>
  );
}

export default TodayTaskPreview;