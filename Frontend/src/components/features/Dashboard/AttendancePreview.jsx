import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useAttendance } from "../../../context/AcademicContext";

function AttendancePreview() {
  const { attendance } = useAttendance();
  const today = "2026-08-11";
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const data = attendance
    .map((student) => {
      const todayAttendance = student.attendance?.find(
        (item) => item.date === today
      );

      return {
        ...student,
        name: student.name || "",
        rollNo: student.rollNo || "",
        team: student.team || "",
        initials: student.initials || "NA",
        status: todayAttendance?.status || "Unmarked",
        time: todayAttendance?.time || todayAttendance?.checkInTime || "--:--",
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
        Leave: 3,
        Absent: 4,
        Unmarked: 5,
      };

      return (priority[a.status] || 99) - (priority[b.status] || 99);
    });

  // itemsPerPage is the single source of truth for both pagination math
  // AND the card's fixed height below — keep these in sync.
  const itemsPerPage = 4;
  const totalPages = Math.ceil(data.length / itemsPerPage) || 1;
  const currentPage = Math.min(page, totalPages);
  const displayedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700 border border-green-200";
      case "Late":
        return "bg-orange-100 text-orange-700 border border-orange-200";
      case "Leave":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "Absent":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-white text-gray-500 border border-gray-200";
    }
  };

  return (
    // FIX: fixed height computed from itemsPerPage instead of h-full (which
    // stretched this card to match its sibling via CSS grid row-stretch and
    // left dead space whenever the pagination block below wasn't rendered).
    // header (~52px) + table header row (~34px) + itemsPerPage rows (~41px each)
    // + pagination bar (~45px) + outer p-4 padding (32px total) = fixed total.
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between p-4 h-[380px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Today's Attendance
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Live check-ins for active batch
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <FiSearch
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-36 pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            {/* View All */}
            <Link
              to="/attendance"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-5 px-3 py-2 bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase mt-2 rounded-t-lg">
          <span>Student</span>
          <span>Team</span>
          <span>Roll No.</span>
          <span>Time</span>
          <span className="text-right">Status</span>
        </div>

        {/* Attendance Rows */}
        <div className="divide-y divide-gray-100">
          {displayedData.map((student, index) => (
            <div
              key={student.id || student.rollNo || index}
              className="grid grid-cols-5 items-center px-3 py-2.5 hover:bg-gray-50/50 transition text-xs"
            >
              {/* Student */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                  {student.initials}
                </div>
                <span className="font-bold text-gray-900 truncate">
                  {student.name}
                </span>
              </div>

              {/* Team */}
              <span className="text-gray-500 font-medium">{student.team}</span>

              {/* Roll Number */}
              <span className="text-gray-500 font-medium">{student.rollNo}</span>

              {/* Time */}
              <span className="text-gray-500 font-medium">{student.time}</span>

              {/* Status */}
              <div className="flex justify-end">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusStyle(
                    student.status
                  )}`}
                >
                  {student.status}
                </span>
              </div>
            </div>
          ))}

          {displayedData.length === 0 && (
            <div className="px-4 py-6 text-center text-xs text-gray-500">
              No student found.
            </div>
          )}
        </div>
      </div>

      {/* FIX: pagination bar is now ALWAYS rendered (removed the
          `{totalPages > 1 && (...)}` guard). With only 1 page, both
          buttons are simply disabled instead of the whole block
          disappearing — that's what was collapsing justify-between
          down to a single child and leaving the gap. */}
      <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <button
          disabled={currentPage === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium transition"
        >
          <FiChevronLeft size={14} /> Prev
        </button>

        <span className="font-semibold text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage >= totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium transition"
        >
          Next <FiChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default AttendancePreview;