import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { attendanceData } from "../common/attendanceData";

function AttendancePreview() {
  const today = "2026-08-11";

  const [search, setSearch] = useState("");

  const data = attendanceData
    .map((student) => {
      const todayAttendance = student.attendance.find(
        (item) => item.date === today
      );

      return {
        ...student,
        status: todayAttendance?.status || "Absent",
        time: todayAttendance?.time || "--:--",
      };
    })
    .filter((student) => {
      const value = search.toLowerCase();

      return (
        student.name.toLowerCase().includes(value) ||
        student.rollNo.toLowerCase().includes(value) ||
        student.team.toLowerCase().includes(value)
      );
    })
    .sort((a, b) => {
      const priority = {
        Late: 1,
        Present: 2,
        Absent: 3,
      };

      return priority[a.status] - priority[b.status];
    });

  const getStatusStyle = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-600";

      case "Late":
        return "bg-orange-100 text-orange-600";

      case "Absent":
        return "bg-red-100 text-red-500";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
   
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          Today's Attendance
        </h2>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <FiSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-40 pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

         
          <Link
            to="/attendance"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-5 px-5 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
        <span>Student</span>
        <span>Team</span>
        <span>Roll No.</span>
        <span>Time</span>
        <span className="text-right">Status</span>
      </div>

      {/* Attendance Data */}
      {data.slice(0, 9).map((student) => (
        <div
          key={student.id}
          className="grid grid-cols-5 items-center px-5 py-3 border-t border-gray-100"
        >
          {/* Student */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
              {student.initials}
            </div>

            <span className="text-sm font-medium text-gray-800">
              {student.name}
            </span>
          </div>

          {/* Team */}
          <span className="text-sm text-gray-500">
            {student.team}
          </span>

          {/* Roll Number */}
          <span className="text-sm text-gray-500">
            {student.rollNo}
          </span>

          {/* Time */}
          <span className="text-sm text-gray-500">
            {student.time}
          </span>

          {/* Status */}
          <div className="flex justify-end">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                student.status
              )}`}
            >
              {student.status}
            </span>
          </div>
        </div>
      ))}

      
      {data.length === 0 && (
        <div className="px-5 py-8 text-center text-sm text-gray-500">
          No student found.
        </div>
      )}
    </div>
  );
}

export default AttendancePreview;