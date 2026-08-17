import React from "react";
import { Link } from "react-router-dom";
import { FiVolume2 } from "react-icons/fi";
import { useAnnouncement } from "../../../../context/AnnouncementContext";

function Announcements() {
  const { announcements: contextAnnouncements = [] } = useAnnouncement();

  const announcements = contextAnnouncements.slice(0, 4).map((a, idx) => {
    let dateStr = "Recent";
    if (a.createdAt) {
      const d = new Date(a.createdAt);
      if (!isNaN(d.getTime())) {
        dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }
    }

    return {
      id: a._id || a.id || idx,
      title: a.title,
      subtitle: a.description || "Campus announcement update",
      date: dateStr,
      avatarType: idx % 2 === 0 ? "initials" : "icon",
      avatarText: (a.postedBy || "SA").slice(0, 2).toUpperCase(),
      avatarBg:
        idx === 0
          ? "bg-blue-100 text-blue-600"
          : idx === 1
          ? "bg-orange-100 text-orange-500"
          : "bg-purple-100 text-purple-600",
    };
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-gray-900">Announcements</h2>
            <span className="text-[10px] font-bold bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded-full">
              {contextAnnouncements.length}
            </span>
          </div>
          <Link
            to="/student/announcements"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            View All
          </Link>
        </div>

        {/* List */}
        {announcements.length > 0 ? (
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
        ) : (
          <div className="py-6 text-center text-gray-400 space-y-1">
            <FiVolume2 size={22} className="mx-auto opacity-50 text-gray-300" />
            <p className="text-xs">No recent announcements</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Announcements;
