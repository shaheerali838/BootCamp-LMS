import React from "react";
import { FiCalendar } from "react-icons/fi";

function ScheduleCard({ data }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-3">
        <FiCalendar
          size={28}
          className="text-blue-600"
        />

        <h2 className="text-xl font-bold text-gray-900">
          Schedule — {data.month}
        </h2>
      </div>

      {/* Days */}
      <div className="mt-6 grid grid-cols-7 gap-2">

        {data.days.map((day) => (
          <div
            key={day.id}
            className={`rounded-2xl py-3 text-center ${
              day.active
                ? "bg-green-500 text-white"
                : "bg-gray-50 text-gray-500"
            }`}
          >
            <p className="text-sm font-medium">
              {day.day}
            </p>

            <p className="mt-1 text-lg font-semibold">
              {day.date}
            </p>
          </div>
        ))}

      </div>

      {/* Events */}
      <div className="mt-5 space-y-4">

        {data.events.map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-3"
          >

            <span
              className={`mt-2 h-3 w-3 shrink-0 rounded-full ${
                event.type === "warning"
                  ? "bg-orange-500"
                  : "bg-green-500"
              }`}
            />

            <div>
              <p className="font-medium text-gray-800">
                {event.title}
              </p>

              <p className="text-sm text-gray-400">
                {event.date}
              </p>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default ScheduleCard;