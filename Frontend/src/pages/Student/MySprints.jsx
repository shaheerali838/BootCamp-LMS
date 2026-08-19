import React, { useState } from "react";
import { FiClock, FiActivity, FiCheckCircle, FiCalendar } from "react-icons/fi";
import { useSprints } from "../../context/WorkContext";
import { useTeamProject } from "../../context/TeamProjectContext";

function MySprints() {
  const { sprints, loading } = useSprints();
  const { projects = [] } = useTeamProject();
  const [filter, setFilter] = useState("All");

  const getProjectName = (projectId) => {
    const project = projects.find((p) => (p._id || p.id) === projectId);
    return project?.projectName || project?.name || "General Project";
  };

  const filteredSprints = sprints.filter((s) => {
    if (filter === "All") return true;
    return s.status === filter;
  });

  const total = sprints.length;
  const active = sprints.filter((s) => s.status === "Active").length;
  const completed = sprints.filter((s) => s.status === "Completed").length;

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sprint Cycles</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor your active and planned development sprints for boot camp projects
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs uppercase font-medium text-gray-500">Total Sprints</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">{total}</h2>
          </div>
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <FiActivity size={22} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs uppercase font-medium text-gray-500">Active Sprints</p>
            <h2 className="text-2xl font-bold text-emerald-600 mt-1">{active}</h2>
          </div>
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
            <FiClock size={22} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs uppercase font-medium text-gray-500">Completed Sprints</p>
            <h2 className="text-2xl font-bold text-gray-700 mt-1">{completed}</h2>
          </div>
          <div className="w-11 h-11 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center">
            <FiCheckCircle size={22} />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-3">
        {["All", "Active", "Completed", "Planning"].map((status) => (
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

      {/* Sprints List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSprints.map((s) => (
          <div
            key={s._id || s.id}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:border-blue-300 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  {getProjectName(s.projectId)}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-2.5">
                  {s.sprintName || s.name || s.title || "Sprint"}
                </h3>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  s.status === "Active"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : s.status === "Completed"
                    ? "bg-gray-100 text-gray-700 border border-gray-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {s.status}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <FiCalendar className="text-gray-400" />
                <span>
                  {s.startDate} {s.endDate ? `to ${s.endDate}` : "(Ongoing)"}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredSprints.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
            <FiActivity size={36} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No sprints found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MySprints;
