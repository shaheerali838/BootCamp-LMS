import React from "react";
import {
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiFolder,
} from "react-icons/fi";
import { useTeamProject } from "../../../context/TeamProjectContext";

function ProjectStatus() {
  const { projects = [], teams = [] } = useTeamProject();

  const totalProjects = projects.length;
  const completedProjects = projects.filter(
    (p) => (p.status || "").toLowerCase() === "completed"
  ).length;
  const inProgressProjects = projects.filter(
    (p) => (p.status || "").toLowerCase() === "in progress" || (p.status || "").toLowerCase() === "pending"
  ).length;

  const getStatusStyle = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "completed") return "bg-emerald-100 text-emerald-700";
    if (s === "in progress") return "bg-blue-100 text-blue-700";
    if (s === "delayed" || s === "overdue") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-5 p-5">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              Total Projects
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">
              {totalProjects}
            </h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <FiFolder size={18} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              Completed
            </p>
            <h2 className="text-2xl font-bold text-emerald-600 mt-1">
              {completedProjects}
            </h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FiCheckCircle size={18} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              In Progress / Active
            </p>
            <h2 className="text-2xl font-bold text-blue-600 mt-1">
              {inProgressProjects}
            </h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <FiClock size={18} />
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
        <h2 className="text-base font-bold text-gray-800 mb-1">
          Capstone Project Tracking
        </h2>
        <p className="text-xs text-gray-500 mb-5">
          Milestone and deadline progress across registered project teams
        </p>

        <div className="space-y-4">
          {projects.map((project) => {
            const title = project.projectName || project.name || project.title || "Project";
            const progress = (project.status || "").toLowerCase() === "completed" ? 100 : (project.progress || 60);

            return (
              <div
                key={project._id || project.id}
                className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50/50 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 text-xs">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {title}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {project.description || "Active Capstone Module"}
                    </p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px] self-start sm:self-auto capitalize ${getStatusStyle(project.status)}`}>
                    {project.status || "In Progress"}
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}

          {projects.length === 0 && (
            <div className="py-8 text-center text-xs text-gray-400">
              No projects found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectStatus;