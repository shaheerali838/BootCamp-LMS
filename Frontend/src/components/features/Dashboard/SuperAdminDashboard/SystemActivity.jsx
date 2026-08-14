import React from "react";
import { FiActivity, FiClock, FiCheckCircle } from "react-icons/fi";
import { useActivityLog } from "../../../../context/ActivityLogContext";

function SystemActivity() {
  const { activities } = useActivityLog();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <FiActivity className="text-purple-600" size={18} />
              System Activity Feed
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Live audit logs across LMS modules
            </p>
          </div>
          <span className="text-[11px] font-semibold bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-100">
            Live Stream
          </span>
        </div>

        <div className="space-y-3 mt-3">
          {activities.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="p-3 border border-gray-100 rounded-lg bg-gray-50/40 hover:bg-white transition flex items-start gap-3"
            >
              <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <FiCheckCircle size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-gray-900 leading-tight">
                  {item.action}
                </h3>
                <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                  <span>By {item.actor}</span>
                  <span className="flex items-center gap-1">
                    <FiClock size={11} />
                    {item.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SystemActivity;
