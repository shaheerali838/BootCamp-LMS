import React, { useMemo, useState } from "react";
import { FiSearch, FiClipboard, FiPlus } from "react-icons/fi";

import TaskCard from "../components/features/Tasks/TaskCard";
import AssignTaskModal from "../components/features/Tasks/AssignTaskModal";
import { useTasks } from "../context/WorkContext";

function Task() {
  const { tasks, fetchTasks, addTask, updateTask, deleteTask } = useTasks();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [taskToAssign, setTaskToAssign] = useState(null);

  React.useEffect(() => {
    if (fetchTasks) fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    const value = search.toLowerCase();

    return tasks.filter((task) => {
      const title = (task.title || "").toLowerCase();
      const desc = (task.description || "").toLowerCase();
      const by = (task.assignedBy || "").toLowerCase();
      const status = (task.status || "").toLowerCase();

      return (
        title.includes(value) ||
        desc.includes(value) ||
        by.includes(value) ||
        status.includes(value)
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

  const handleOpenEditModal = (task) => {
    setTaskToAssign(task);
    setShowModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(taskId);
    }
  };

  const handleSaveTask = async (taskData) => {
    if (taskToAssign) {
      await updateTask(taskData.id || taskData._id, taskData);
    } else {
      await addTask(taskData);
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
              Create, assign, edit, and manage tasks for students and teams
            </p>
          </div>

          {/* Create Task Button */}
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow-sm cursor-pointer"
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
            placeholder="Search tasks by title, description, or status..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task._id || task.id}
            task={task}
            onAssign={handleOpenAssignModalForCard}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteTask}
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

      {/* Create / Edit / Assign Task Modal */}
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