import React, { useMemo, useState } from "react";
import { FiSearch, FiClipboard, FiPlus } from "react-icons/fi";

import TaskCard from "../components/features/Tasks/TaskCard";
import AssignTaskModal from "../components/features/Tasks/AssignTaskModal";
import { useTasks } from "../context/WorkContext";

function Task() {
  const { tasks, fetchTasks, addTask, updateTask } = useTasks();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [taskToAssign, setTaskToAssign] = useState(null);

  React.useEffect(() => {
    if (fetchTasks) fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    const value = search.toLowerCase();

    return tasks.filter((task) => {
      return (
        (task.title || "").toLowerCase().includes(value) ||
        (task.assignedBy || "").toLowerCase().includes(value) ||
        (task.assignedTo || "").toLowerCase().includes(value) ||
        (task.status || "").toLowerCase().includes(value)
      );
    });
  }, [tasks, search]);

  const handleOpenCreateModal = () => {
    setTaskToAssign(null);
    setShowModal(true);
  };

  const handleOpenAssignModalForCard = (task) => {
    setTaskToAssign(task);
    setShowModal(true);
  };

  const handleSaveTask = (taskData) => {
    if (taskToAssign) {
      updateTask(taskData.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>

        {/* Title */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
            <p className="text-sm text-gray-500 mt-1">
              Create and manage tasks assigned to students
            </p>
          </div>

          {/* Create Task Button */}
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition shadow-sm"
          >
            <FiPlus size={18} />
            Create Task
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg outline-none text-sm focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task._id || task.id}
            task={task}
            onAssign={handleOpenAssignModalForCard}
          />
        ))}
      </div>

      {/* No Tasks */}
      {filteredTasks.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl py-12 text-center">
          <FiClipboard size={30} className="mx-auto text-gray-300" />
          <p className="text-sm text-gray-500 mt-3">No tasks found.</p>
        </div>
      )}

      {/* Create / Assign Task Modal */}
      {showModal && (
        <AssignTaskModal
          taskToAssign={taskToAssign}
          onClose={() => setShowModal(false)}
          onAssign={handleSaveTask}
        />
      )}
    </div>
  );
}

export default Task;