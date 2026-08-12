import React from "react";
import { Link } from "react-router-dom";
import { useProjects } from "../../../context/ProjectContext";

function MyProjects() {
  const { projects } = useProjects();

  const displayProjects = [
    {
      id: 1,
      title: "E-Commerce Website",
      subtitle: "Team Project • In Progress",
      progress: 60,
      color: "bg-blue-600",
    },
    {
      id: 2,
      title: "Task Management App",
      subtitle: "Team Project • In Progress",
      progress: 40,
      color: "bg-blue-600",
    },
    {
      id: 3,
      title: "Portfolio Website",
      subtitle: "Individual Project • Completed",
      progress: 100,
      color: "bg-emerald-500",
    },
  ];

  const list = projects.length > 0 ? projects.slice(0, 3) : displayProjects;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-900">My Projects</h2>
        <Link
          to="/student/projects"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          View All
        </Link>
      </div>

      {/* List */}
      <div className="space-y-5">
        {list.map((item, idx) => {
          const progressVal = item.progress || (idx === 0 ? 60 : idx === 1 ? 40 : 100);
          const isComplete = progressVal === 100;
          const barColor = isComplete ? "bg-emerald-500" : "bg-blue-600";
          const subText = item.subtitle || (isComplete ? "Individual Project • Completed" : "Team Project • In Progress");

          return (
            <div key={item.id || idx} className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight">
                  {item.title}
                </h3>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                  {subText}
                </p>
              </div>

              <div className="flex items-center gap-3 w-40 shrink-0">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barColor}`}
                    style={{ width: `${progressVal}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-500 w-8 text-right">
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
