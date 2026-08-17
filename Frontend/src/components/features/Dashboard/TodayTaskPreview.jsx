import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTasks } from "../../../context/WorkContext";

function TodayTaskPreview() {
  const { tasks } = useTasks();
  const [page, setPage] = useState(1);

  const itemsPerPage = 3;

  const totalPages = Math.ceil(tasks.length / itemsPerPage) || 1;

  const currentPage = Math.min(page, totalPages);

  const displayedTasks = tasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "On Track":
        return "bg-blue-100 text-blue-700";

      case "In Progress":
        return "bg-orange-100 text-orange-700";

      case "Needs Attention":
        return "bg-red-100 text-red-700";

      case "Pending":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col shadow-sm h-[380px] overflow-hidden">
      {/* Main Content */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Today's Tasks
            </h2>

            <p className="text-xs text-gray-500 mt-0.5">
              Tasks assigned across active courses
            </p>
          </div>

          <Link
            to="/tasks"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            View All
          </Link>
        </div>

        {/* Tasks List */}
        <div className="space-y-2 mt-2.5 flex-1 min-h-0 overflow-hidden">
          {displayedTasks.map((task) => (
            <div
              key={task._id || task.id}
              className="border border-gray-100 rounded-lg p-2 hover:bg-gray-50/50 transition"
            >
              {/* Title + Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-gray-900 truncate">
                    {task.title}
                  </h3>

                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Assigned by {task.assignedBy || "Admin"}
                  </p>
                </div>

                <span
                  className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusStyle(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>

              {/* Due Date + Priority */}
              <div className="flex items-center justify-between mt-1.5 text-[11px]">
                <span className="text-gray-400 font-medium">
                  Due: {task.dueDate}
                </span>

                <span className="font-semibold text-gray-600">
                  {task.priority || "Medium"}
                </span>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {displayedTasks.length === 0 && (
            <div className="py-6 text-center text-xs text-gray-500">
              No tasks available.
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="shrink-0 mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        {/* Previous */}
        <button
          disabled={currentPage === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium transition"
        >
          <FiChevronLeft size={14} />
          Prev
        </button>

        {/* Page Number */}
        <span className="font-semibold text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        {/* Next */}
        <button
          disabled={currentPage >= totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium transition"
        >
          Next
          <FiChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default TodayTaskPreview;