import React from "react";
import { Link } from "react-router-dom";

function MySchedule() {
  const schedule = [
    {
      id: 1,
      time: "09:00 AM",
      title: "Web Development Class",
      subtitle: "Team Alpha • Room 3",
      dotColor: "bg-emerald-500",
    },
    {
      id: 2,
      time: "11:00 AM",
      title: "Project Discussion",
      subtitle: "Team Project • Online",
      dotColor: "bg-purple-500",
    },
    {
      id: 3,
      time: "02:00 PM",
      title: "Task Submission",
      subtitle: "Module Task • Due Today",
      dotColor: "bg-blue-500",
    },
    {
      id: 4,
      time: "04:00 PM",
      title: "Mentor Session",
      subtitle: "1:1 Session • Online",
      dotColor: "bg-gray-400",
    },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-gray-900">Today's Schedule</h2>
        <Link
          to="/student/attendance"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          View Full
        </Link>
      </div>

      {/* Timeline */}
      <div className="relative space-y-6">
        {/* Vertical line behind dots */}
        <div className="absolute left-[88px] top-2 bottom-2 w-[1px] bg-gray-200" />

        {schedule.map((item) => (
          <div key={item.id} className="flex items-start text-xs relative z-10">
            {/* Time */}
            <div className="w-16 font-semibold text-gray-600 shrink-0 text-right pr-3 pt-0.5">
              {item.time}
            </div>

            {/* Dot */}
            <div className="flex items-center justify-center w-5 h-5 shrink-0">
              <div className={`w-2.5 h-2.5 rounded-full ${item.dotColor} ring-4 ring-white`} />
            </div>

            {/* Details */}
            <div className="pl-3">
              <h3 className="font-bold text-gray-900 text-sm leading-tight">
                {item.title}
              </h3>
              <p className="text-gray-400 text-xs mt-0.5 font-medium">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MySchedule;
