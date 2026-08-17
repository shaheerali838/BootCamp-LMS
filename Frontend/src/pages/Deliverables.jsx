import React, { useState } from "react";
import { FiClipboard, FiCheckCircle, FiExternalLink, FiClock, FiCheck, FiX } from "react-icons/fi";
import { useTasks } from "../context/WorkContext";

function Deliverables() {
  const { tasks, updateTaskStatus } = useTasks();
  const [filter, setFilter] = useState("All");

  const deliverableTasks = tasks.filter((t) => t.submission || t.status === "In Review" || t.status === "Completed");

  const filtered = deliverableTasks.filter((t) => {
    if (filter === "All") return true;
    return t.status === filter;
  });

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Review Student Deliverables</h1>
        <p className="text-sm text-gray-500 mt-1">
          Inspect submitted code repositories, review sprint tasks, and mark deliverables as approved
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-3">
        {["All", "In Review", "Completed", "Pending"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              filter === status
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Deliverables List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item._id || item.id}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    item.status === "Completed"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : item.status === "In Review"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-gray-500">{item.description}</p>

              {item.submission && (
                <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                  <a
                    href={item.submission.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                  >
                    <FiExternalLink size={13} /> View Submission URL
                  </a>
                  {item.submission.notes && (
                    <span className="text-gray-500 italic">
                      "{item.submission.notes}"
                    </span>
                  )}
                  <span className="text-gray-400">
                    Submitted on: {item.submission.submittedAt || "Recently"}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => updateTaskStatus(item._id || item.id, "Completed")}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <FiCheck size={14} /> Approve
              </button>
              <button
                onClick={() => updateTaskStatus(item._id || item.id, "In Progress")}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <FiX size={14} /> Request Revision
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
            <FiClipboard size={36} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No deliverables matching this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Deliverables;
