import React, { useMemo, useState } from "react";

import {
  FiSearch,
  FiClipboard,
  FiPlus,
} from "react-icons/fi";

import TaskCard from "../components/Tasks/TaskCard";
import AssignTaskModal from "../components/Tasks/AssignTaskModal";

import { taskData } from "../components/common/taskData";

function Task() {
  const [tasks, setTasks] = useState(taskData);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const filteredTasks = useMemo(() => {
    const value = search.toLowerCase();

    return tasks.filter((task) => {
      return (
        (task.title || "")
          .toLowerCase()
          .includes(value) ||
        (task.assignedBy || "")
          .toLowerCase()
          .includes(value) ||
        (task.assignedTo || "")
          .toLowerCase()
          .includes(value) ||
        (task.status || "")
          .toLowerCase()
          .includes(value)
      );
    });
  }, [tasks, search]);

  const handleAssignTask = (newTask) => {
    setTasks((previous) => [
      newTask,
      ...previous,
    ]);
  };

  return (
    <div className="p-5 space-y-6">

      {/* Header */}
      <div>
        {/* Breadcrumb */}
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

        {/* Title */}
        <div className="flex items-center justify-between mt-3">

          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Tasks
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              View and manage tasks assigned to students
            </p>
          </div>

          {/* Assign Task Button */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            <FiPlus size={18} />

            Assign Task
          </button>

        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">

        <div className="relative max-w-md">

          <FiSearch
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg outline-none text-sm focus:border-blue-500"
          />

        </div>

      </div>

      {/* Tasks */}
      <div className="space-y-4">

        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
          />
        ))}

      </div>

      {/* No Tasks */}
      {filteredTasks.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl py-12 text-center">

          <FiClipboard
            size={30}
            className="mx-auto text-gray-300"
          />

          <p className="text-sm text-gray-500 mt-3">
            No tasks found.
          </p>

        </div>
      )}

      {/* Assign Task Modal */}
      {showModal && (
        <AssignTaskModal
          onClose={() => setShowModal(false)}
          onAssign={handleAssignTask}
        />
      )}

    </div>
  );
}

export default Task;