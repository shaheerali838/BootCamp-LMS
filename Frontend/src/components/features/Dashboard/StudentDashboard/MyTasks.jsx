import React from "react";
import { Link } from "react-router-dom";
import { useTasks } from "../../../../context/WorkContext";

function MyTasks() {
  const { tasks } = useTasks();

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

  const displayTasks = tasks.length > 0 ? tasks.slice(0, 3) : [
    { id: 1, title: "Build React Component", dueDate: "2026-08-14", status: "In Progress" },
    { id: 2, title: "API Integration", dueDate: "2026-08-15", status: "In Progress" },
    { id: 3, title: "UI Fixes", dueDate: "2026-08-16", status: "Pending" },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900">My Tasks</h2>
        <Link
          to="/student/tasks"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          View All
        </Link>
      </div>

      {/* List (Tightly content-fitted) */}
      <div className="space-y-3">
        {displayTasks.map((task, idx) => (
          <div key={task.id} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-2 h-2 rounded-full ${getDotColor(idx)} shrink-0`} />
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-gray-900 truncate leading-tight">
                  {task.title}
                </h3>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                  Due: {task.dueDate ? task.dueDate : "Aug 14, 2026"}
                </p>
              </div>
            </div>

            <span
              className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getBadgeStyle(
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
