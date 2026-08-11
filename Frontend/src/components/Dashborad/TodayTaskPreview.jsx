import React from "react";
import { Link } from "react-router-dom";
import { taskData } from "../common/taskData";

function TodayTaskPreview() {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-600";

      case "On Track":
        return "bg-blue-100 text-blue-600";

      case "In Progress":
        return "bg-orange-100 text-orange-600";

      case "Needs Attention":
        return "bg-red-100 text-red-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Today's Tasks
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Group task status
          </p>
        </div>

        <Link
          to="/projects"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3 mt-5">
        {taskData.map((group) => {
          const progress = Math.round(
            (group.completed / group.total) * 100
          );

          return (
            <div
              key={group.id}
              className="border border-gray-200 rounded-lg p-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">
                    {group.group}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {group.task}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${getStatusStyle(
                    group.status
                  )}`}
                >
                  {group.status}
                </span>
              </div>

              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-gray-500">
                  {group.completed}/{group.total} tasks
                </span>

                <span className="text-[11px] text-gray-500">
                  {progress}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TodayTaskPreview;