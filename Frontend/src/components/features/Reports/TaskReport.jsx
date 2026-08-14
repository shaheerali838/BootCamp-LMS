import React from "react";
import {
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiList,
} from "react-icons/fi";

function TaskReport() {
  const tasks = [
    {
      id: 1,
      title: "React Dashboard",
      completed: 42,
      total: 50,
    },
    {
      id: 2,
      title: "API Integration",
      completed: 36,
      total: 50,
    },
    {
      id: 3,
      title: "Tailwind UI",
      completed: 45,
      total: 50,
    },
    {
      id: 4,
      title: "Git Assignment",
      completed: 39,
      total: 50,
    },
  ];

  return (
    <div className="space-y-5">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <FiList className="text-blue-600" size={22} />

          <p className="text-sm text-gray-500 mt-3">
            Total Tasks
          </p>

          <h2 className="text-3xl font-semibold mt-1">
            200
          </h2>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <FiCheckCircle className="text-green-600" size={22} />

          <p className="text-sm text-gray-500 mt-3">
            Completed
          </p>

          <h2 className="text-3xl font-semibold text-green-600 mt-1">
            162
          </h2>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <FiClock className="text-orange-500" size={22} />

          <p className="text-sm text-gray-500 mt-3">
            Pending
          </p>

          <h2 className="text-3xl font-semibold text-orange-500 mt-1">
            28
          </h2>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <FiAlertCircle className="text-red-500" size={22} />

          <p className="text-sm text-gray-500 mt-3">
            Overdue
          </p>

          <h2 className="text-3xl font-semibold text-red-500 mt-1">
            10
          </h2>
        </div>

      </div>

      {/* Task Distribution */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">

        <h2 className="text-lg font-semibold text-gray-800">
          Task Distribution
        </h2>

        <p className="text-sm text-gray-500 mt-1 mb-6">
          Task completion by assignment
        </p>

        <div className="space-y-5">

          {tasks.map((task) => {
            const percentage =
              (task.completed / task.total) * 100;

            return (
              <div key={task.id}>

                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {task.title}
                  </span>

                  <span className="text-sm text-gray-500">
                    {task.completed}/{task.total}
                  </span>
                </div>

                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}

export default TaskReport;