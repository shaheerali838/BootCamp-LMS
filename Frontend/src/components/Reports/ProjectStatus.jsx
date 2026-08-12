import React from "react";
import {
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";

function ProjectStatus() {
  const projects = [
    {
      id: 1,
      name: "LMS Dashboard",
      team: "Team Alpha",
      progress: 90,
      status: "Completed",
    },
    {
      id: 2,
      name: "E-Commerce App",
      team: "Team Beta",
      progress: 72,
      status: "In Progress",
    },
    {
      id: 3,
      name: "Attendance System",
      team: "Team Gamma",
      progress: 55,
      status: "In Progress",
    },
    {
      id: 4,
      name: "Portfolio Website",
      team: "Team Delta",
      progress: 35,
      status: "Delayed",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-600";

      case "In Progress":
        return "bg-blue-100 text-blue-600";

      case "Delayed":
        return "bg-red-100 text-red-500";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-5">

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white border border-gray-200 rounded-xl p-5">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <FiCheckCircle size={21} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Completed
              </p>

              <h2 className="text-2xl font-semibold">
                1
              </h2>
            </div>

          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <FiClock size={21} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                In Progress
              </p>

              <h2 className="text-2xl font-semibold">
                2
              </h2>
            </div>

          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-full bg-red-100 text-red-500 flex items-center justify-center">
              <FiAlertCircle size={21} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Delayed
              </p>

              <h2 className="text-2xl font-semibold">
                1
              </h2>
            </div>

          </div>
        </div>

      </div>

      {/* Projects */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

        <div className="px-5 py-5 border-b border-gray-200">

          <h2 className="text-lg font-semibold text-gray-800">
            Project Status
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Current progress of team projects
          </p>

        </div>

        <div className="grid grid-cols-[1.8fr_1.3fr_2fr_1fr] px-5 py-4 bg-gray-50 text-xs font-medium text-gray-500 uppercase">

          <span>Project</span>

          <span>Team</span>

          <span>Progress</span>

          <span>Status</span>

        </div>

        {projects.map((project) => (
          <div
            key={project.id}
            className="grid grid-cols-[1.8fr_1.3fr_2fr_1fr] items-center px-5 py-5 border-t border-gray-100"
          >

            <span className="text-sm font-medium text-gray-800">
              {project.name}
            </span>

            <span className="text-sm text-gray-500">
              {project.team}
            </span>

            <div className="flex items-center gap-3">

              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">

                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${project.progress}%`,
                  }}
                />

              </div>

              <span className="text-sm text-gray-600">
                {project.progress}%
              </span>

            </div>

            <span
              className={`inline-flex w-fit px-3 py-1.5 rounded-full text-xs font-medium ${getStatusStyle(
                project.status
              )}`}
            >
              {project.status}
            </span>

          </div>
        ))}

      </div>
    </div>
  );
}

export default ProjectStatus;