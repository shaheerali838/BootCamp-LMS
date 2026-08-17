import React, { useState } from "react";
import { FiClipboard, FiUpload, FiCheckCircle, FiClock, FiLink } from "react-icons/fi";
import { useTasks } from "../../context/WorkContext";

function MyTasks() {
  const { tasks, submitDeliverable } = useTasks();
  const [filter, setFilter] = useState("All");
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    return task.status === filter;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTask || !submissionUrl) return;

    submitDeliverable(selectedTask.id, {
      url: submissionUrl,
      notes: submissionNotes,
    });

    setSelectedTask(null);
    setSubmissionUrl("");
    setSubmissionNotes("");
  };

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assigned Tasks & Deliverables</h1>
            <p className="text-sm text-gray-500 mt-1">
              Review instructor assignments and submit your project links
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-3">
        {["All", "Pending", "In Progress", "In Review", "Completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task, idx) => (
          <div
            key={task._id || task.id || idx}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-blue-600">Assigned by {task.assignedBy}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-0.5">{task.title}</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  task.status === "Completed"
                    ? "bg-emerald-100 text-emerald-700"
                    : task.status === "In Review"
                    ? "bg-purple-100 text-purple-700"
                    : task.status === "In Progress"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {task.status}
              </span>
            </div>

            <p className="text-sm text-gray-600">{task.description}</p>

            <div className="flex flex-wrap items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>Assigned: {task.assignedDate}</span>
                <span>Due: <strong className="text-gray-800">{task.dueDate}</strong></span>
              </div>

              {task.submission ? (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-medium">
                  <FiCheckCircle size={14} />
                  <span>Submitted: </span>
                  <a
                    href={task.submission.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-emerald-900"
                  >
                    View Deliverable
                  </a>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedTask(task)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-xs transition"
                >
                  <FiUpload size={14} />
                  Submit Deliverable
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500 text-sm">
            <FiClipboard size={32} className="mx-auto text-gray-300 mb-2" />
            No tasks found in status "{filter}".
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Submit Deliverable
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              For: <span className="font-semibold text-gray-800">{selectedTask.title}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Repository or Deployment Link *
                </label>
                <div className="relative">
                  <FiLink size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    required
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Submission Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Describe your implementation details..."
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow"
                >
                  Confirm Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyTasks;
