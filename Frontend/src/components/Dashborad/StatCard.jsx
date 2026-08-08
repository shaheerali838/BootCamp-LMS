import React from "react";
import { useNavigate } from "react-router-dom";

function StatCard({ icon, iconBg, iconColor, value, label, path }) {
  const navigate = useNavigate();
  const isClickable = Boolean(path);

  return (
    <div
      onClick={() => isClickable && navigate(path)}
      className={`bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between
        ${isClickable ? "cursor-pointer hover:shadow-md hover:border-blue-200 transition-all" : ""}`}
    >
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-xs font-semibold text-gray-400 tracking-wide mt-1">
          {label}
        </div>
      </div>
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center ${iconBg}`}
      >
        <span className={iconColor}>{icon}</span>
      </div>
    </div>
  );
}

export default StatCard;