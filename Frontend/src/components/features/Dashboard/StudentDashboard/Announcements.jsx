import React from "react";
import { Link } from "react-router-dom";
import { FiVolume2 } from "react-icons/fi";
import { useAnnouncement } from "../../../../context/AnnouncementContext";

function Announcements() {
  const { announcements: contextAnnouncements = [] } = useAnnouncement();

  const fallbackAnnouncements = [
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

  const announcements = contextAnnouncements.length > 0
    ? contextAnnouncements.slice(0, 3).map((a, idx) => ({
        id: a.id,
        title: a.title,
        subtitle: a.description || "School announcement update",
        date: a.createdAt || "Recent",
        avatarType: idx % 2 === 0 ? "initials" : "icon",
        avatarText: (a.postedBy || "SA").slice(0, 2).toUpperCase(),
        avatarBg: idx === 0 ? "bg-blue-100 text-blue-600" : idx === 1 ? "bg-orange-100 text-orange-500" : "bg-purple-100 text-purple-600",
      }))
    : fallbackAnnouncements;


  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900">Announcements</h2>
        <Link
          to="/student/announcements"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          View All
        </Link>
      </div>

      {/* List (Tightly content-fitted) */}
      <div className="space-y-3">
        {announcements.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-7 h-7 rounded-full ${item.avatarBg} font-bold text-[10px] flex items-center justify-center shrink-0`}
              >
                {item.avatarType === "icon" ? (
                  <FiVolume2 size={13} />
                ) : (
                  item.avatarText
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-gray-900 truncate leading-tight">
                  {item.title}
                </h3>
                <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>

            <span className="text-[10px] font-medium text-gray-400 shrink-0">
              {item.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Announcements;
