import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUserPlus,
  FiCalendar,
  FiGrid,
  FiClipboard,
  FiUpload,
  FiFolderPlus,
} from "react-icons/fi";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Enroll Student",
      icon: <FiUserPlus size={16} />,
      color: "bg-emerald-600 hover:bg-emerald-700 text-white",
      path: "/students",
    },
    {
      label: "Mark Attendance",
      icon: <FiCalendar size={16} />,
      color: "bg-blue-600 hover:bg-blue-700 text-white",
      path: "/attendance",
    },
    {
      label: "Create Team",
      icon: <FiGrid size={16} />,
      color: "bg-indigo-600 hover:bg-indigo-700 text-white",
      path: "/teams",
    },
    {
      label: "Create Task",
      icon: <FiClipboard size={16} />,
      color: "bg-purple-600 hover:bg-purple-700 text-white",
      path: "/tasks",
    },
    {
      label: "Upload Resource",
      icon: <FiUpload size={16} />,
      color: "bg-cyan-600 hover:bg-cyan-700 text-white",
      path: "/resources",
    },
    {
      label: "Create Project",
      icon: <FiFolderPlus size={16} />,
      color: "bg-amber-600 hover:bg-amber-700 text-white",
      path: "/projects",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900 pb-3 border-b border-gray-100">
        Quick Administrative Actions
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => navigate(action.path)}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition ${action.color}`}
          >
            {action.icon}
            <span className="truncate">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
