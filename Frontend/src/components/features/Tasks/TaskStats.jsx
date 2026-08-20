import React from "react";
import {
  FiClipboard,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

function TaskStats({ tasks }) {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Total */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-3 min-w-0">

          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-500 break-words">
              Total Tasks
            </p>

            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-2 truncate">
              {totalTasks}
            </h2>
          </div>

          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <FiClipboard size={23} />
          </div>

        </div>
      </div>

      {/* Completed */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-3 min-w-0">

          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-500 break-words">
              Completed
            </p>

            <h2 className="text-2xl sm:text-3xl font-semibold text-green-600 mt-2 truncate">
              {completedTasks}
            </h2>
          </div>

          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
            <FiCheckCircle size={23} />
          </div>

        </div>
      </div>

      {/* In Progress */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-3 min-w-0">

          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-500 break-words">
              In Progress
            </p>

            <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mt-2 truncate">
              {inProgressTasks}
            </h2>
          </div>

          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <FiClock size={23} />
          </div>

        </div>
      </div>

      {/* Pending */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-3 min-w-0">

          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-500 break-words">
              Pending
            </p>

            <h2 className="text-2xl sm:text-3xl font-semibold text-orange-500 mt-2 truncate">
              {pendingTasks}
            </h2>
          </div>

          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center shrink-0">
            <FiAlertCircle size={23} />
          </div>

        </div>
      </div>

    </div>
  );
}

export default TaskStats;