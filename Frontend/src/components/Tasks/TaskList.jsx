import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import TaskCard from "./TaskCard";

function TaskList({ tasks }) {
  const [search, setSearch] = useState("");

  const filteredTasks = tasks.filter((task) => {
    const value = search.toLowerCase();

    return (
      task.title.toLowerCase().includes(value) ||
      task.assignedBy.toLowerCase().includes(value) ||
      task.status.toLowerCase().includes(value)
    );
  });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Assigned Tasks
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Tasks assigned by your instructors
          </p>
        </div>

        <div className="relative">

          <FiSearch
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-64 pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm text-gray-700 focus:border-blue-500"
          />

        </div>

      </div>

      {/* Table Header */}
      <div className="grid grid-cols-7 px-5 py-4 bg-gray-50 text-xs font-medium text-gray-500 uppercase">

        <span>Task</span>

        <span>Assigned By</span>

        <span>Assigned Date</span>

        <span>Due Date</span>

        <span>Priority</span>

        <span>Status</span>

        <span>Action</span>

      </div>

      {/* Task Rows */}
      {filteredTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
        />
      ))}

      {/* Empty */}
      {filteredTasks.length === 0 && (
        <div className="px-5 py-10 text-center text-sm text-gray-500">
          No tasks found.
        </div>
      )}

    </div>
  );
}

export default TaskList;