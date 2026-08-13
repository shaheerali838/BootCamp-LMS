import React from "react";
import { FiFolder, FiCheckSquare, FiUserCheck } from "react-icons/fi";
import { useProjects } from "../../context/ProjectContext";

function MyProjects() {
  const { projects } = useProjects();

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Student Portal</span>
          <span>›</span>
          <span className="font-semibold text-gray-800">My Projects</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects & Milestones</h1>
            <p className="text-sm text-gray-500 mt-1">
              View-only project status, milestones, and batch assignments
            </p>
          </div>
          <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-200 font-medium">
            View Only Access
          </span>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                {project.category}
              </span>
              <span className="text-xs font-medium text-gray-500">{project.status}</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiFolder className="text-blue-600" />
                {project.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Assigned Team: <strong className="text-gray-700">Team Alpha</strong>
              </p>
            </div>

            {/* Progress */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Progress Completion</span>
                <span className="font-bold text-gray-800">{project.progress}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${project.color || "bg-blue-600"}`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Milestones Preview */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <span className="text-xs font-semibold text-gray-700 block">Milestones</span>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <FiCheckSquare className="text-emerald-600" />
                <span>Phase 1: Architecture & Figma Setup</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <FiUserCheck className="text-blue-600" />
                <span>Phase 2: Context API Integration</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyProjects;
