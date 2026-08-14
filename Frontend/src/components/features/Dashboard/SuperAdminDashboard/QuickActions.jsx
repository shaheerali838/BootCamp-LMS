import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiShield,
  FiUserCheck,
  FiUserPlus,
  FiLayers,
  FiGrid,
  FiFolderPlus,
} from "react-icons/fi";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Add Super Admin",
      icon: <FiShield size={16} />,
      color: "bg-purple-600 hover:bg-purple-700 text-white",
      path: "/superadmin/super-admins",
    },
    {
      label: "Add Admin / Mentor",
      icon: <FiUserCheck size={16} />,
      color: "bg-blue-600 hover:bg-blue-700 text-white",
      path: "/superadmin/admins",
    },
    {
      label: "Add Student",
      icon: <FiUserPlus size={16} />,
      color: "bg-emerald-600 hover:bg-emerald-700 text-white",
      path: "/superadmin/students",
    },
    {
      label: "Create Batch",
      icon: <FiLayers size={16} />,
      color: "bg-amber-600 hover:bg-amber-700 text-white",
      path: "/superadmin/batches",
    },
    {
      label: "Create Team",
      icon: <FiGrid size={16} />,
      color: "bg-indigo-600 hover:bg-indigo-700 text-white",
      path: "/superadmin/teams",
    },
    {
      label: "Create Project",
      icon: <FiFolderPlus size={16} />,
      color: "bg-cyan-600 hover:bg-cyan-700 text-white",
      path: "/superadmin/projects",
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
