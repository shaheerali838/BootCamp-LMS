import React from "react";
import { useReports } from "../../context/ReportContext";

function BatchPerformance() {
  const { batchPerformanceData } = useReports();
  const width = 700;
  const height = 250;

  const paddingX = 40;
  const paddingY = 25;

  const values = batchPerformanceData.map(
    (item) => item.value
  );

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const getX = (index) => {
    if (batchPerformanceData.length === 1) {
      return width / 2;
    }

    return (
      paddingX +
      (index *
        (width - paddingX * 2)) /
        (batchPerformanceData.length - 1)
    );
  };

  const getY = (value) => {
    if (maxValue === minValue) {
      return height / 2;
    }

    return (
      height -
      paddingY -
      ((value - minValue) /
        (maxValue - minValue)) *
        (height - paddingY * 2)
    );
  };

  const points = batchPerformanceData
    .map(
      (item, index) =>
        `${getX(index)},${getY(item.value)}`
    )
    .join(" ");

  const areaPoints = `
    ${paddingX},${height - paddingY}
    ${points}
    ${width - paddingX},${height - paddingY}
  `;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">

        <h2 className="text-sm font-semibold text-gray-700">
          Batch Performance Trends
        </h2>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <button className="hover:text-gray-900">
            1M
          </button>

          <button className="hover:text-gray-900">
            3M
          </button>

          <button className="hover:text-gray-900">
            1Y
          </button>
        </div>

      </div>

      {/* Chart */}
      <div className="w-full overflow-hidden px-3 pt-3">

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-64"
          preserveAspectRatio="none"
        >

          {/* Horizontal Grid Lines */}
          {[0, 1, 2, 3, 4].map((line) => {
            const y =
              paddingY +
              (line *
                (height - paddingY * 2)) /
                4;

            return (
              <line
                key={line}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
            );
          })}

          {/* Area */}
          <polygon
            points={areaPoints}
            fill="#dbeafe"
            opacity="0.7"
          />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {batchPerformanceData.map(
            (item, index) => (
              <circle
                key={item.month}
                cx={getX(index)}
                cy={getY(item.value)}
                r="4"
                fill="white"
                stroke="#60a5fa"
                strokeWidth="2"
              />
            )
          )}

          {/* X Axis Labels */}
          {batchPerformanceData.map(
            (item, index) => (
              <text
                key={item.month}
                x={getX(index)}
                y={height - 5}
                textAnchor="middle"
                fontSize="11"
                fill="#9ca3af"
              >
                {item.month}
              </text>
            )
          )}

        </svg>

      </div>

      <div className="px-4 pb-3 text-right">
        <span className="text-xs text-gray-400">
          Last updated: Today
        </span>
      </div>

    </div>
  );
}

export default BatchPerformance;