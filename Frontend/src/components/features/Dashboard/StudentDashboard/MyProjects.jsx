import React from "react";
import { Link } from "react-router-dom";
import { FiFolder } from "react-icons/fi";
import { useTeamProject } from "../../../../context/TeamProjectContext";

function MyProjects() {
  const { projects = [] } = useTeamProject();

  const calculateProgress = (status, progress) => {
    if (progress !== undefined && progress !== null) return Number(progress);
    const s = String(status || "").toLowerCase();
    if (s === "completed") return 100;
    if (s === "pending") return 0;
    return 60;
  };

  const displayList = projects.slice(0, 4).map((p) => {
    const status = p.status || "In Progress";
    const progressVal = calculateProgress(status, p.progress);
    const category = typeof p.batch === "object" ? p.batch?.batchName : (p.category || "Team Project");

    return {
      id: p._id || p.id,
      title: p.name || p.projectName || p.title || "Untitled Project",
      subtitle: `${category} • ${status}`,
      progress: progressVal,
      isComplete: progressVal === 100,
    };
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-gray-900">My Projects</h2>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
              {projects.length}
            </span>
          </div>
          <Link
            to="/student/projects"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            View All
          </Link>
        </div>

        {/* List */}
        {displayList.length > 0 ? (
          <div className="space-y-3">
            {displayList.map((item, idx) => {
              const barColor = item.isComplete ? "bg-emerald-500" : "bg-blue-600";

              return (
                <div key={item.id || idx} className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-gray-900 truncate leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 w-28 shrink-0">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-500 w-7 text-right">
                      {item.progress}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center text-gray-400 space-y-1">
            <FiFolder size={22} className="mx-auto opacity-50 text-gray-300" />
            <p className="text-xs">No active projects</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProjects;
