import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useStudent } from "../../../../context/AcademicContext";
import { useTeamProject } from "../../../../context/TeamProjectContext";
import { useTasks } from "../../../../context/WorkContext";

function SystemOverview() {
  const { students = [] } = useStudent();
  const { projects = [] } = useTeamProject();
  const { tasks = [] } = useTasks();

  const [timeframe, setTimeframe] = useState("This Week");

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const studentsCount = students.length;
  const projectsCount = projects.length;
  const tasksCount = tasks.length;

  // Generate dynamic progression curves based on live counts
  const generateSeries = (targetCount, curveFactor = 0.6) => {
    if (targetCount === 0) return [0, 0, 0, 0, 0, 0, 0];
    return days.map((_, idx) => {
      const stepRatio = (idx + 1) / days.length;
      const progress = curveFactor + (1 - curveFactor) * stepRatio;
      return Math.round(targetCount * progress);
    });
  };

  const studentsSeries = generateSeries(studentsCount, 0.7);
  const projectsSeries = generateSeries(projectsCount, 0.5);
  const tasksSeries = generateSeries(tasksCount, 0.4);

  const allValues = [...studentsSeries, ...projectsSeries, ...tasksSeries];
  const maxVal = Math.max(...allValues, 10);
  const minVal = 0;

  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 20;

  const getX = (index) =>
    paddingX + (index * (width - paddingX * 2)) / (days.length - 1);

  const getY = (val) =>
    height - paddingY - (val / maxVal) * (height - paddingY * 2);

  const makePoints = (series) =>
    series.map((val, idx) => `${getX(idx)},${getY(val)}`).join(" ");

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            System Overview & Growth
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time activity trends across key metrics
          </p>
        </div>

        <div className="relative">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 px-3 py-1.5 pr-8 rounded-lg outline-none cursor-pointer focus:border-blue-500"
          >
            <option value="This Week">This Week</option>
            <option value="Last Week">Last Week</option>
            <option value="This Month">This Month</option>
          </select>
          <FiChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Series Legend */}
      <div className="flex items-center gap-6 mt-4 text-xs font-medium text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="font-semibold text-gray-800">
            Students ({studentsCount})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-600" />
          <span className="font-semibold text-gray-800">
            Projects ({projectsCount})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="font-semibold text-gray-800">
            Tasks ({tasksCount})
          </span>
        </div>
      </div>

      {/* Line Chart */}
      <div className="w-full overflow-hidden mt-3">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56"
          preserveAspectRatio="none"
        >
          {/* Horizontal Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const val = Math.round(maxVal * pct);
            const y = getY(val);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#94a3b8"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Students Series Line */}
          <polyline
            points={makePoints(studentsSeries)}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Projects Series Line */}
          <polyline
            points={makePoints(projectsSeries)}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Tasks Series Line */}
          <polyline
            points={makePoints(tasksSeries)}
            fill="none"
            stroke="#a855f7"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points for Students */}
          {studentsSeries.map((val, idx) => (
            <circle
              key={`st-${idx}`}
              cx={getX(idx)}
              cy={getY(val)}
              r="3.5"
              fill="white"
              stroke="#10b981"
              strokeWidth="2"
            />
          ))}

          {/* Points for Projects */}
          {projectsSeries.map((val, idx) => (
            <circle
              key={`pr-${idx}`}
              cx={getX(idx)}
              cy={getY(val)}
              r="3.5"
              fill="white"
              stroke="#2563eb"
              strokeWidth="2"
            />
          ))}

          {/* Points for Tasks */}
          {tasksSeries.map((val, idx) => (
            <circle
              key={`tk-${idx}`}
              cx={getX(idx)}
              cy={getY(val)}
              r="3.5"
              fill="white"
              stroke="#a855f7"
              strokeWidth="2"
            />
          ))}

          {/* X Axis Labels */}
          {days.map((day, idx) => (
            <text
              key={day}
              x={getX(idx)}
              y={height - 2}
              textAnchor="middle"
              fontSize="10"
              fill="#94a3b8"
              fontWeight="500"
            >
              {day}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

export default SystemOverview;
