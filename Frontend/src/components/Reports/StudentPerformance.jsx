import React from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

function StudentPerformance() {
  const students = [
    {
      id: 1,
      name: "Ali Khan",
      team: "Team Alpha",
      attendance: 95,
      tasks: 92,
      performance: 94,
    },
    {
      id: 2,
      name: "Ahmed Raza",
      team: "Team Beta",
      attendance: 91,
      tasks: 88,
      performance: 90,
    },
    {
      id: 3,
      name: "Usman Ali",
      team: "Team Gamma",
      attendance: 82,
      tasks: 79,
      performance: 80,
    },
    {
      id: 4,
      name: "Hamza Khan",
      team: "Team Alpha",
      attendance: 74,
      tasks: 70,
      performance: 72,
    },
  ];

  return (
    <div className="space-y-5">

      {/* Overview */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">

        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Student Performance
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Overall student performance based on attendance and tasks
          </p>
        </div>

        <div className="overflow-x-auto">

          <div className="min-w-[750px]">

            {/* Header */}
            <div className="grid grid-cols-[1.8fr_1.4fr_1fr_1fr_1fr] px-4 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
              <span>Student</span>
              <span>Team</span>
              <span>Attendance</span>
              <span>Tasks</span>
              <span>Performance</span>
            </div>

            {/* Rows */}
            {students.map((student) => (
              <div
                key={student.id}
                className="grid grid-cols-[1.8fr_1.4fr_1fr_1fr_1fr] items-center px-4 py-4 border-t border-gray-100"
              >

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                    {student.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")}
                  </div>

                  <span className="text-sm font-medium text-gray-800">
                    {student.name}
                  </span>

                </div>

                <span className="text-sm text-gray-500">
                  {student.team}
                </span>

                <span className="text-sm text-gray-600">
                  {student.attendance}%
                </span>

                <span className="text-sm text-gray-600">
                  {student.tasks}%
                </span>

                <div className="flex items-center gap-2">

                  {student.performance >= 85 ? (
                    <FiTrendingUp className="text-green-500" />
                  ) : (
                    <FiTrendingDown className="text-red-500" />
                  )}

                  <span
                    className={`text-sm font-semibold ${
                      student.performance >= 85
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {student.performance}%
                  </span>

                </div>

              </div>
            ))}

          </div>

        </div>
      </div>
    </div>
  );
}

export default StudentPerformance;