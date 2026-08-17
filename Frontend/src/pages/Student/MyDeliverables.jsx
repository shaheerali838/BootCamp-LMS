import React, { useState } from "react";
import { FiUpload, FiLink, FiCheckCircle, FiClock, FiFileText, FiExternalLink } from "react-icons/fi";
import { useTasks } from "../../context/WorkContext";

function MyDeliverables() {
  const { tasks, submitDeliverable } = useTasks();
  const [selectedTask, setSelectedTask] = useState(null);
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");

  const submittedTasks = tasks.filter((t) => t.submission || t.status === "In Review" || t.status === "Completed");
  const pendingTasks = tasks.filter((t) => !t.submission && t.status !== "Completed");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTask || !url) return;

    submitDeliverable(selectedTask._id || selectedTask.id, {
      url,
      notes,
    });

    setSelectedTask(null);
    setUrl("");
    setNotes("");
  };

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Deliverables</h1>
        <p className="text-sm text-gray-500 mt-1">
          Submit project source repositories, live demo URLs, and view evaluation feedback
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Submissions */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FiClock className="text-amber-500" /> Pending Deliverables
          </h2>

          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div
                key={task._id || task.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{task.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>Due: {task.dueDate || "N/A"}</span>
                    <span>•</span>
                    <span className="text-blue-600 font-medium">{task.assignedBy || "Instructor"}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTask(task)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shrink-0 transition flex items-center justify-center gap-1.5"
                >
                  <FiUpload size={14} /> Submit Work
                </button>
              </div>
            ))}

            {pendingTasks.length === 0 && (
              <div className="py-8 text-center text-gray-400 bg-white rounded-xl border border-gray-200 text-sm">
                <FiCheckCircle size={32} className="mx-auto mb-2 text-emerald-500" />
                All pending deliverables are submitted!
              </div>
            )}
          </div>

          {/* Past Submissions */}
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 pt-4">
            <FiCheckCircle className="text-emerald-500" /> Submitted Deliverables
          </h2>

          <div className="space-y-3">
            {submittedTasks.map((task) => (
              <div
                key={task._id || task.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{task.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      task.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                {task.submission && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <FiLink className="text-blue-500 shrink-0" />
                      <a
                        href={task.submission.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        {task.submission.url}
                      </a>
                    </div>
                    <span className="text-gray-400 shrink-0">
                      {task.submission.submittedAt || "Submitted"}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {submittedTasks.length === 0 && (
              <div className="py-8 text-center text-gray-400 bg-white rounded-xl border border-gray-200 text-sm">
                No deliverables submitted yet.
              </div>
            )}
          </div>
        </div>

        {/* Submission Form Modal / Sidebar Pane */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs h-fit sticky top-6">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-3">
            <FiUpload className="text-blue-600" />
            {selectedTask ? "Submit Assignment" : "Submission Panel"}
          </h2>

          {selectedTask ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-900">
                <p className="font-semibold">{selectedTask.title}</p>
                <p className="text-blue-700 mt-0.5">{selectedTask.description}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Repository / Live URL *
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Notes / Comments
                </label>
                <textarea
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any context or implementation details..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
                >
                  Submit Deliverable
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 text-gray-400 text-xs">
              <FiFileText size={32} className="mx-auto mb-2 opacity-50" />
              Select a pending deliverable from the list to submit your link.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyDeliverables;
