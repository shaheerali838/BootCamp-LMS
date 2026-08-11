import React from "react";
import { Link } from "react-router-dom";

function QuickStats({ projects }) {
  const data = projects || [
    {
      id: 1,
      title: "Hackathon Portal",
      category: "Batch 11",
      progress: 75,
      status: "75% Complete",
      color: "bg-blue-600",
    },
    {
      id: 2,
      title: "LMS V2 Upgrade",
      category: "Internal",
      progress: 45,
      status: "In Progress",
      color: "bg-orange-600",
    },
    {
      id: 3,
      title: "Student Management",
      category: "Batch 10",
      progress: 90,
      status: "90% Complete",
      color: "bg-green-600",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
    
      <h2 className="text-lg font-semibold text-gray-800">
        Quick Stats
      </h2>

      <p className="text-sm text-gray-500 mt-4 mb-4">
        Project Status Overview
      </p>

      
      <div className="space-y-3">
        {data.slice(0, 3).map((project) => (
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

     
      <Link
        to="/projects"
        className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700 mt-5"
      >
        View All Projects
      </Link>
    </div>
  );
}

export default QuickStats;