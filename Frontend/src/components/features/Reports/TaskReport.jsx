import React from "react";
import {
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiList,
} from "react-icons/fi";
import { useTasks } from "../../../context/WorkContext";

function TaskReport() {
  const { tasks = [] } = useTasks();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (t) => t.status === "Completed" || t.status === "In Review"
  ).length;
  const pendingTasks = tasks.filter(
    (t) => t.status === "Pending" || t.status === "In Progress"
  ).length;
  const overdueTasks = tasks.filter(
    (t) => t.status !== "Completed" && t.dueDate && new Date(t.dueDate) < new Date()
  ).length;

  return (
    <div className="space-y-5 p-5">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <FiList className="text-blue-600" size={20} />
          <p className="text-xs font-semibold text-gray-500 uppercase mt-3">
            Total Tasks
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            {totalTasks}
          </h2>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <FiCheckCircle className="text-emerald-600" size={20} />
          <p className="text-xs font-semibold text-gray-500 uppercase mt-3">
            Completed
          </p>
          <h2 className="text-2xl font-bold text-emerald-600 mt-1">
            {completedTasks}
          </h2>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <FiClock className="text-orange-500" size={20} />
          <p className="text-xs font-semibold text-gray-500 uppercase mt-3">
            Pending / In Progress
          </p>
          <h2 className="text-2xl font-bold text-orange-500 mt-1">
            {pendingTasks}
          </h2>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <FiAlertCircle className="text-red-500" size={20} />
          <p className="text-xs font-semibold text-gray-500 uppercase mt-3">
            Overdue Deadlines
          </p>
          <h2 className="text-2xl font-bold text-red-500 mt-1">
            {overdueTasks}
          </h2>
        </div>
      </div>

      {/* Task Distribution */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
        <h2 className="text-base font-bold text-gray-800">
          Task Deliverables Breakdown
        </h2>
        <p className="text-xs text-gray-500 mt-0.5 mb-5">
          Live task execution status across sprints
        </p>

        <div className="space-y-4">
          {tasks.slice(0, 6).map((task) => {
            const isCompleted = task.status === "Completed";
            const isPending = task.status === "Pending";
            const progress = isCompleted ? 100 : isPending ? 30 : 65;

            return (
              <div key={task._id || task.id} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <span className="font-semibold text-gray-800 truncate max-w-md">
                    {task.title}
                  </span>
                  <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                    isCompleted
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-blue-50 text-blue-700"
                  }`}>
                    {task.status || "Pending"}
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompleted ? "bg-emerald-500" : "bg-blue-600"
                    }`}
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}

          {tasks.length === 0 && (
            <div className="py-6 text-center text-xs text-gray-400">
              No tasks found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskReport;