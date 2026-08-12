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
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500">
              Total Tasks
            </p>

            <h2 className="text-3xl font-semibold text-gray-900 mt-2">
              {totalTasks}
            </h2>
          </div>

          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <FiClipboard size={23} />
          </div>

        </div>
      </div>

      {/* Completed */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500">
              Completed
            </p>

            <h2 className="text-3xl font-semibold text-green-600 mt-2">
              {completedTasks}
            </h2>
          </div>

          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <FiCheckCircle size={23} />
          </div>

        </div>
      </div>

      {/* In Progress */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500">
              In Progress
            </p>

            <h2 className="text-3xl font-semibold text-blue-600 mt-2">
              {inProgressTasks}
            </h2>
          </div>

          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <FiClock size={23} />
          </div>

        </div>
      </div>

      {/* Pending */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500">
              Pending
            </p>

            <h2 className="text-3xl font-semibold text-orange-500 mt-2">
              {pendingTasks}
            </h2>
          </div>

          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
            <FiAlertCircle size={23} />
          </div>

        </div>
      </div>

    </div>
  );
}

export default TaskStats;