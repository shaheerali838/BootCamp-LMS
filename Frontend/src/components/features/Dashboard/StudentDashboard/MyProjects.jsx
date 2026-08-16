import React from "react";
import { Link } from "react-router-dom";
import { useTeamProject } from "../../../../context/TeamProjectContext";
function MyProjects() {
  const { projects = [] } = useTeamProject();

  const displayProjects = [
    {
      id: 1,
      title: "E-Commerce Website",
      subtitle: "Team Project • In Progress",
      progress: 60,
    },
    {
      id: 2,
      title: "Task Management App",
      subtitle: "Team Project • In Progress",
      progress: 40,
    },
    {
      id: 3,
      title: "Portfolio Website",
      subtitle: "Individual Project • Completed",
      progress: 100,
    },
  ];

  const list = projects.length > 0 ? projects.slice(0, 3).map(p => ({
    id: p.id || p._id,
    title: p.name || p.projectName || p.title || "Untitled Project",
    subtitle: `${p.category || "Team Project"} • ${p.status || "In Progress"}`,
    progress: p.progress !== undefined ? p.progress : 50,
  })) : displayProjects;


  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900">My Projects</h2>
        <Link
          to="/student/projects"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          View All
        </Link>
      </div>

      {/* List */}
      <div className="space-y-3">
        {list.map((item, idx) => {
          const progressVal = item.progress || (idx === 0 ? 60 : idx === 1 ? 40 : 100);
          const isComplete = progressVal === 100;
          const barColor = isComplete ? "bg-emerald-500" : "bg-blue-600";
          const subText = item.subtitle || (isComplete ? "Individual Project • Completed" : "Team Project • In Progress");

          return (
            <div key={item.id || idx} className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-gray-900 truncate leading-tight">
                  {item.title}
                </h3>
                <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">
                  {subText}
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-32 shrink-0">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barColor}`}
                    style={{ width: `${progressVal}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-gray-500 w-7 text-right">
                  {progressVal}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyProjects;
