import React from "react";
import { Link } from "react-router-dom";
import { FiVolume2 } from "react-icons/fi";

function Announcements() {
  const announcements = [
    {
      id: 1,
      title: "New Module Released",
      subtitle: "Check the new React module in resources.",
      date: "Aug 12, 2026",
      avatarType: "initials",
      avatarText: "AH",
      avatarBg: "bg-blue-100 text-blue-600",
    },
    {
      id: 2,
      title: "Project Submission Update",
      subtitle: "All projects are due by Aug 20, 2026.",
      date: "Aug 11, 2026",
      avatarType: "icon",
      avatarBg: "bg-orange-100 text-orange-500",
    },
    {
      id: 3,
      title: "Holiday Notice",
      subtitle: "Institute will remain closed on Aug 14.",
      date: "Aug 10, 2026",
      avatarType: "initials",
      avatarText: "FN",
      avatarBg: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-900">Announcements</h2>
        <Link
          to="/student/announcements"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          View All
        </Link>
      </div>

      {/* List */}
      <div className="space-y-4">
        {announcements.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full ${item.avatarBg} font-bold text-xs flex items-center justify-center shrink-0`}
              >
                {item.avatarType === "icon" ? (
                  <FiVolume2 size={16} />
                ) : (
                  item.avatarText
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight">
                  {item.title}
                </h3>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-medium text-gray-400 shrink-0">
              {item.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Announcements;
