import React, { useEffect, useState } from "react";
import {
  FiActivity,
  FiClock,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useActivityLog } from "../../../context/ActivityLogContext";

function SystemActivity() {
  const { activities } = useActivityLog();
  const [page, setPage] = useState(1);

  const itemsPerPage = 4;

  const totalPages =
    Math.ceil(activities.length / itemsPerPage) || 1;

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const displayed = activities.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col shadow-sm h-[380px] overflow-hidden">
      {/* Main Content */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <FiActivity
                className="text-purple-600"
                size={18}
              />

              System Activity Feed
            </h2>

            <p className="text-xs text-gray-500 mt-0.5">
              Live audit logs across LMS modules
            </p>
          </div>

          <span className="text-[10px] font-semibold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100">
            Live Stream
          </span>
        </div>

        {/* Activity List */}
        <div className="space-y-2 mt-2 flex-1 min-h-0 overflow-hidden">
          {displayed.map((item) => (
            <div
              key={item.id}
              className="p-2 border border-gray-100 rounded-lg bg-gray-50/40 hover:bg-white transition flex items-start gap-2.5"
            >
              {/* Icon */}
              <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <FiCheckCircle size={13} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-gray-900 leading-snug truncate">
                  {item.action}
                </h3>

                <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                  <span>By {item.actor}</span>

                  <span className="flex items-center gap-1">
                    <FiClock size={10} />
                    {item.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {displayed.length === 0 && (
            <div className="py-6 text-center text-xs text-gray-500">
              No activity logs.
            </div>
          )}
        </div>
      </div>

      {/* Pagination Bar (Always rendered to lock fixed height like Admin dashboard cards) */}
      <div className="shrink-0 mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        {/* Previous */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() =>
            setPage((prev) => Math.max(prev - 1, 1))
          }
          className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium transition"
        >
          <FiChevronLeft size={14} />
          Prev
        </button>

        {/* Page */}
        <span className="font-semibold text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        {/* Next */}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() =>
            setPage((prev) =>
              Math.min(prev + 1, totalPages)
            )
          }
          className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium transition"
        >
          Next
          <FiChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default SystemActivity;