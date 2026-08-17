import React from "react";
import { Link } from "react-router-dom";
import { FiClipboard, FiCheckCircle } from "react-icons/fi";
import { useTasks } from "../../../../context/WorkContext";

function MyTasks() {
  const { tasks = [] } = useTasks();

  const getDotColor = (index) => {
    const colors = ["bg-purple-500", "bg-blue-500", "bg-amber-500", "bg-emerald-500"];
    return colors[index % colors.length];
  };

  const getBadgeStyle = (status) => {
    if (status === "Completed") {
      return "bg-emerald-50 text-emerald-600 border border-emerald-100";
    }
    if (status === "In Progress" || status === "In Review") {
      return "bg-orange-50 text-orange-600 border border-orange-100";
    }
    return "bg-gray-100 text-gray-600 border border-gray-200";
  };

  const displayTasks = tasks.slice(0, 4);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-gray-900">My Tasks</h2>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
              {tasks.length}
            </span>
          </div>
          <Link
            to="/student/tasks"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            View All
          </Link>
        </div>

        {/* List */}
        {displayTasks.length > 0 ? (
          <div className="space-y-3">
            {displayTasks.map((task, idx) => (
              <div key={task._id || task.id || idx} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-2 h-2 rounded-full ${getDotColor(idx)} shrink-0`} />
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-gray-900 truncate leading-tight">
                      {task.title || "Untitled Task"}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                      Due: {task.dueDate || "Ongoing sprint"}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getBadgeStyle(
                    task.status || "Pending"
                  )}`}
                >
                  {task.status || "Pending"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-gray-400 space-y-1">
            <FiClipboard size={22} className="mx-auto opacity-50 text-gray-300" />
            <p className="text-xs">No tasks currently assigned</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTasks;
