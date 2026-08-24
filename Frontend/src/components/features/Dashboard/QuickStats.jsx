import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTeamProject } from "../../../context/TeamProjectContext";

function QuickStats() {
  const { projects = [], fetchProjects } = useTeamProject();

  useEffect(() => {
    if (fetchProjects) fetchProjects();
  }, [fetchProjects]);

  const getProgress = (project) => {
    if (project.progress !== undefined && project.progress !== null) {
      return project.progress;
    }
    const s = String(project.status || "").toLowerCase();
    if (s === "completed") return 100;
    if (s === "in progress" || s === "inprogress") return 50;
    return 15;
  };

  const getProgressColor = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "completed") return "bg-green-600";
    if (s === "in progress" || s === "inprogress") return "bg-blue-600";
    return "bg-amber-500";
  };

  const displayedProjects = projects.slice(0, 4);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-800">
            Quick Stats
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Project Status & Progress Overview
          </p>
        </div>

        <Link
          to="/projects"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {displayedProjects.map((project) => {
          const progress = getProgress(project);
          const color = getProgressColor(project.status);

          return (
            <div
              key={project._id || project.id}
              className="border border-gray-200 rounded-lg p-3 hover:shadow-2xs transition bg-white"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold text-gray-800 truncate">
                  {project.projectName || project.name || project.title || "Project"}
                </h3>
                <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full shrink-0">
                  {project.status || "In Progress"}
                </span>
              </div>

              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${color} transition-all duration-500`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-2 text-[11px] text-gray-500">
                <span className="truncate">{project.batchName || "Batch Project"}</span>
                <span className="font-semibold text-gray-700">{progress}%</span>
              </div>
            </div>
          );
        })}

        {displayedProjects.length === 0 && (
          <div className="col-span-2 py-8 text-center text-xs text-gray-500">
            No projects created yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default QuickStats;
