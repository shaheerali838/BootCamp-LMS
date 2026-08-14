import React from "react";
import {
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";

function AttendanceReport() {
  const data = [
    {
      id: 1,
      day: "Monday",
      present: 42,
      late: 5,
      absent: 3,
    },
    {
      id: 2,
      day: "Tuesday",
      present: 45,
      late: 3,
      absent: 2,
    },
    {
      id: 3,
      day: "Wednesday",
      present: 43,
      late: 4,
      absent: 3,
    },
    {
      id: 4,
      day: "Thursday",
      present: 46,
      late: 2,
      absent: 2,
    },
    {
      id: 5,
      day: "Friday",
      present: 44,
      late: 4,
      absent: 2,
    },
  ];

  return (
    <div className="space-y-5">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Students
              </p>

              <h2 className="text-3xl font-semibold mt-2">
                50
              </h2>
            </div>

            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <FiUsers size={21} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Average Present
              </p>

              <h2 className="text-3xl font-semibold text-green-600 mt-2">
                88%
              </h2>
            </div>

            <div className="w-11 h-11 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <FiCheckCircle size={21} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Late
              </p>

              <h2 className="text-3xl font-semibold text-orange-500 mt-2">
                18
              </h2>
            </div>

            <div className="w-11 h-11 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
              <FiClock size={21} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Absent
              </p>

              <h2 className="text-3xl font-semibold text-red-500 mt-2">
                12
              </h2>
            </div>

            <div className="w-11 h-11 rounded-full bg-red-100 text-red-500 flex items-center justify-center">
              <FiXCircle size={21} />
            </div>
          </div>
        </div>

      </div>

      {/* Weekly Attendance */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Weekly Attendance %
            </h2>

            <p className="text-sm text-gray-500">
              Attendance overview for this week
            </p>
          </div>

          <span className="text-sm text-gray-500">
            Last 7 days
          </span>
        </div>

        <div className="flex items-end gap-8 h-56 px-5">

          {data.map((item) => {
            const percentage =
              (item.present /
                (item.present + item.late + item.absent)) *
              100;

            return (
              <div
                key={item.id}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <span className="text-xs text-gray-500">
                  {Math.round(percentage)}%
                </span>

                <div className="w-full max-w-14 h-40 bg-gray-100 rounded-t-lg flex items-end">
                  <div
                    className="w-full bg-blue-500 rounded-t-lg"
                    style={{
                      height: `${percentage}%`,
                    }}
                  />
                </div>

                <span className="text-xs text-gray-500">
                  {item.day.slice(0, 3)}
                </span>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}

export default AttendanceReport;