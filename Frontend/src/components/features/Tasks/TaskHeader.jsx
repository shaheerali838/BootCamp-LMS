import React from "react";

function TaskHeader() {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">
          Home
        </span>

        <span className="text-gray-300">
          ›
        </span>

        <span className="font-semibold text-gray-800">
          Tasks
        </span>
      </div>

      <div className="mt-3">
        <h1 className="text-2xl font-semibold text-gray-900">
          Tasks
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          View tasks assigned by your instructors
        </p>
      </div>
    </div>
  );
}

export default TaskHeader;