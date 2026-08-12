import React from "react";
import { Link } from "react-router-dom";
import { useProjects } from "../../context/ProjectContext";

function QuickStats() {
  const { projects } = useProjects();
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Quick Stats
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Project Status Overview
          </p>
        </div>

        <Link
          to="/projects"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-gray-200 rounded-lg p-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-800">
                {project.title}
              </h3>

              <button className="text-gray-400 hover:text-gray-600">
                •••
              </button>
            </div>

            <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${project.color}`}
                style={{ width: `${project.progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-gray-500">
                {project.category}
              </span>

              <span className="text-[11px] text-gray-500">
                {project.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuickStats;