import React from "react";
import { useNavigate } from "react-router-dom";

function StatCard({ icon, iconBg, iconColor, value, label, path }) {
  const navigate = useNavigate();
  const isClickable = Boolean(path);

  return (
    <div
      onClick={() => isClickable && navigate(path)}
      className={`bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between min-w-0 ${
        isClickable
          ? "cursor-pointer hover:shadow-md hover:border-blue-200 transition-all"
          : ""
      }`}
    >
      <div className="min-w-0">
        <p className="text-lg font-semibold text-gray-800">{value}</p>

        <p className="text-[10px] font-medium text-gray-500 whitespace-nowrap">
          {label}
        </p>
      </div>

      <div
        className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>
    </div>
  );
}

export default StatCard;