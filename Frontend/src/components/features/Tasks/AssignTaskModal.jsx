import React, { useState } from "react";
import { FiX, FiClipboard } from "react-icons/fi";

function AssignTaskModal({ onClose, onAssign, taskToAssign = null }) {
  const [formData, setFormData] = useState({
    title: taskToAssign ? taskToAssign.title : "",
    description: taskToAssign ? taskToAssign.description : "",
    assignedTo: taskToAssign?.assignedTo || "Team Alpha",
    dueDate: taskToAssign?.dueDate || "",
    priority: taskToAssign?.priority || "Medium",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.dueDate) {
      alert("Please fill all required fields.");
      return;
    }

    if (taskToAssign) {
      // Assigning existing task
      onAssign({
        id: taskToAssign.id,
        ...taskToAssign,
        ...formData,
        assignedDate: new Date().toISOString().split("T")[0],
      });
    } else {
      // Creating new task
      const newTask = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        assignedBy: "Admin User",
        assignedTo: "Unassigned",
        assignedDate: new Date().toISOString().split("T")[0],
        dueDate: formData.dueDate,
        priority: formData.priority,
        status: "Pending",
      };
      onAssign(newTask);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <FiClipboard size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {taskToAssign
                  ? `Assign Task: ${taskToAssign.title}`
                  : "Create New Task"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {taskToAssign
                  ? "Assign this task to a student or team"
                  : "Create a new task for your course"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter task description"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm resize-none focus:border-blue-500"
            />
          </div>

          {/* Conditional Layout: 2 Columns when assigning existing task, Full-width Due Date when creating new task */}
          {taskToAssign ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Assign To (Only shown when assigning an existing task) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign To (Team / Student)
                </label>

                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm focus:border-blue-500"
                >
                  <option value="Team Alpha">Team Alpha</option>
                  <option value="Team Beta">Team Beta</option>
                  <option value="Team Gamma">Team Gamma</option>
                  <option value="Team Delta">Team Delta</option>
                  <option value="All Students">All Students</option>
                  <option value="Ali Hassan">Ali Hassan</option>
                  <option value="Sara Bilal">Sara Bilal</option>
                  <option value="Usman Tariq">Usman Tariq</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm focus:border-blue-500"
                />
              </div>
            </div>
          ) : (
            /* Due Date Full-Width (When creating new task) */
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm focus:border-blue-500"
              />
            </div>
          )}

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none text-sm focus:border-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow"
            >
              {taskToAssign ? "Assign Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssignTaskModal;