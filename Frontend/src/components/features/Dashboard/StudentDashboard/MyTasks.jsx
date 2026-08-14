import React from "react";
import { Link } from "react-router-dom";
import { useTasks } from "../../../../context/TaskContext";

function MyTasks() {
  const { tasks } = useTasks();

  // Color mapping for dot
  const getDotColor = (index) => {
    const colors = ["bg-purple-500", "bg-purple-500", "bg-blue-500", "bg-gray-400"];
    return colors[index % colors.length];
  };

  const getBadgeStyle = (status) => {
    if (status === "Completed") {
      return "bg-emerald-50 text-emerald-600 border border-emerald-100";
    }
    if (status === "In Progress" || status === "In Review") {
      return "bg-orange-50 text-orange-600 border border-orange-100";
    }
    return "bg-gray-100 text-gray-500 border border-gray-200";
  };

  const displayTasks = tasks.length > 0 ? tasks.slice(0, 4) : [
    { id: 1, title: "Build React Component", dueDate: "2026-08-14", status: "In Progress" },
    { id: 2, title: "API Integration", dueDate: "2026-08-15", status: "In Progress" },
    { id: 3, title: "UI Fixes", dueDate: "2026-08-16", status: "Pending" },
    { id: 4, title: "Testing & Debugging", dueDate: "2026-08-17", status: "Pending" },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-900">My Tasks</h2>
        <Link
          to="/student/tasks"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          View All
        </Link>
      </div>

      {/* List */}
      <div className="space-y-4">
        {displayTasks.map((task, idx) => (
          <div key={task.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${getDotColor(idx)} shrink-0`} />
              <div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight">
                  {task.title}
                </h3>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                  Due: {task.dueDate ? task.dueDate : "Aug 14, 2026"}
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide ${getBadgeStyle(
                task.status
              )}`}
            >
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyTasks;
