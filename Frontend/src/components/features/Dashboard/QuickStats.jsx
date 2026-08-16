import React from "react";
import { Link } from "react-router-dom";
import { useTeamProject } from "../../../context/TeamProjectContext";
function QuickStats() {
  // UPDATED: Pull projects from TeamProjectContext API
  const { projects = [] } = useTeamProject();

  // const displayProjects = projects.length > 0 ? projects.slice(0, 4) : [
  //   { id: 1, title: "E-Commerce Hackathon Portal", category: "Batch 11", status: "In Progress", progress: 80, color: "bg-blue-600" },
  //   { id: 2, title: "LMS Portal Dashboard", category: "Batch 11", status: "In Progress", progress: 40, color: "bg-indigo-600" },
  // ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Quick Stats
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Project Status Overview
          </p>
        </div>

        <Link
          to="/projects"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800 truncate">
                {project.name || project.title}
              </h3>
              <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">
                {project.status || "In Progress"}
              </span>
            </div>

            <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${project.color || "bg-blue-600"}`}
                style={{ width: `${project.progress || 50}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-2 text-[11px] text-gray-500">
              <span>{project.category || "Batch 11"}</span>
              <span className="font-semibold text-gray-700">{project.progress || 50}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuickStats;

