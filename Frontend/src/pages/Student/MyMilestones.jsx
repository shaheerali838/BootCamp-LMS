import React, { useState } from "react";
import { FiCheckSquare, FiClock, FiTarget, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useMilestones } from "../../context/WorkContext";
import { useTeamProject } from "../../context/TeamProjectContext";

function MyMilestones() {
  const { milestones, loading } = useMilestones();
  const { projects = [] } = useTeamProject();
  const [filter, setFilter] = useState("All");

  const getProjectName = (projectId) => {
    const project = projects.find((p) => (p._id || p.id) === projectId);
    return project?.projectName || project?.name || "General Project";
  };

  const filteredMilestones = milestones.filter((m) => {
    if (filter === "All") return true;
    return m.status === filter;
  });

  const total = milestones.length;
  const completed = milestones.filter((m) => m.status === "Completed").length;
  const inProgress = milestones.filter((m) => m.status === "In Progress" || m.status === "Pending").length;

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Project Milestones</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track goals, progress, and upcoming deadlines for your team projects
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs uppercase font-medium text-gray-500">Total Milestones</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">{total}</h2>
          </div>
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <FiTarget size={22} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs uppercase font-medium text-gray-500">Completed</p>
            <h2 className="text-2xl font-bold text-emerald-600 mt-1">{completed}</h2>
          </div>
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
            <FiCheckCircle size={22} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs uppercase font-medium text-gray-500">Pending / In Progress</p>
            <h2 className="text-2xl font-bold text-amber-600 mt-1">{inProgress}</h2>
          </div>
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
            <FiClock size={22} />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-3">
        {["All", "Pending", "In Progress", "Completed"].map((status) => (
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

      {/* Milestones List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMilestones.map((m) => (
          <div
            key={m._id || m.id}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:border-blue-300 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  {getProjectName(m.projectId)}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-2.5">{m.title}</h3>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  m.status === "Completed"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : m.status === "In Progress"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {m.status}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <FiClock className="text-gray-400" />
                <span>Due Date: {m.dueDate || "N/A"}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredMilestones.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
            <FiCheckSquare size={36} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No milestones found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyMilestones;
