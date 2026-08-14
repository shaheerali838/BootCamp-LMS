import React from "react";
import { useReports } from "../../context/ReportContext";

function TaskDistribution() {
  const { taskDistributionData } = useReports();
  const completed =
    taskDistributionData[0]?.value || 0;

  const total = taskDistributionData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const percentage =
    total > 0
      ? Math.round((completed / total) * 100)
      : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 h-full">

      <h2 className="text-sm font-semibold text-gray-700">
        Task Distribution
      </h2>

      <div className="flex flex-col items-center justify-center mt-3">

        {/* Donut */}
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center"
          style={{
            background: `conic-gradient(
              #c7d2fe 0% ${percentage}%,
              #e5e7eb ${percentage}% 100%
            )`,
          }}
        >
          <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center">

            <span className="text-lg font-semibold text-gray-700">
              {percentage}%
            </span>

            <span className="text-xs text-gray-500">
              Completed
            </span>

          </div>
        </div>

        {/* Labels */}
        <div className="grid grid-cols-3 gap-4 w-full mt-5">

          {taskDistributionData.map((item) => (
            <div
              key={item.label}
              className="text-center"
            >
              <p className="text-xs text-gray-500">
                {item.label}
              </p>

              <p className="text-sm font-semibold text-gray-700 mt-1">
                {item.value}%
              </p>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default TaskDistribution;