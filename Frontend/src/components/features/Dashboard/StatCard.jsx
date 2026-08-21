import React from "react";
import { useNavigate } from "react-router-dom";

function StatCard({ icon, iconBg, iconColor, value, label, path }) {
  const navigate = useNavigate();
  const isClickable = Boolean(path);

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between gap-2 min-w-0"
    >
      <div className="min-w-0 flex-1">
        <p className="text-lg font-semibold text-gray-800 truncate">{value}</p>

        <p className="text-[10px] font-medium text-gray-500 break-words leading-tight">
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