import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiClock } from "react-icons/fi";
import { useTasks } from "../../../context/WorkContext";

function TodayTaskPreview() {
  const { tasks = [], fetchTasks } = useTasks();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (fetchTasks) fetchTasks();
  }, [fetchTasks]);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(tasks.length / itemsPerPage) || 1;
  const currentPage = Math.min(page, totalPages);

  const displayedTasks = tasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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

  const getStatusStyle = (status) => {
    const s = String(status || "").toLowerCase();
    switch (s) {
      case "completed":
      case "done":
        return "bg-green-100 text-green-700 border border-green-200";

      case "in progress":
      case "inprogress":
        return "bg-blue-100 text-blue-700 border border-blue-200";

      case "in review":
      case "inreview":
        return "bg-purple-100 text-purple-700 border border-purple-200";

      default:
        return "bg-amber-100 text-amber-700 border border-amber-200";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col shadow-xs h-95 overflow-hidden">
      {/* Main Content */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Today's Tasks
            </h2>

            <p className="text-xs text-gray-500 mt-0.5">
              Tasks assigned across active courses ({tasks.length} total)
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
        <div className="space-y-2 mt-2.5 flex-1 min-h-0 overflow-y-auto pr-1">
          {displayedTasks.map((task) => (
            <div
              key={task._id || task.id}
              className="border border-gray-100 rounded-lg p-2.5 hover:bg-gray-50/70 transition bg-white shadow-2xs"
            >
              {/* Title + Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-gray-900 truncate">
                    {task.title}
                  </h3>

                  <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                    Assigned by {task.assignedBy || "Admin"}
                  </p>
                </div>

                <span
                  className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusStyle(
                    task.status,
                  )}`}
                >
                  {task.status || "Pending"}
                </span>
              </div>

              {/* Due Date + Priority */}
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-50 text-[11px]">
                <span className="text-gray-500 font-medium flex items-center gap-1">
                  <FiClock size={12} className="text-blue-500" />
                  Due:{" "}
                  <strong className="text-gray-700">
                    {formatDate(task.dueDate)}
                  </strong>
                </span>

                <span className="font-semibold text-gray-600 uppercase text-[10px] px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100">
                  {task.priority || "Medium"}
                </span>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {displayedTasks.length === 0 && (
            <div className="py-12 text-center text-xs text-gray-500">
              No tasks created yet.
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="shrink-0 mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <button
          disabled={currentPage === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium transition cursor-pointer"
        >
          <FiChevronLeft size={14} />
          Prev
        </button>

        <span className="font-semibold text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage >= totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium transition cursor-pointer"
        >
          Next
          <FiChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default TodayTaskPreview;
