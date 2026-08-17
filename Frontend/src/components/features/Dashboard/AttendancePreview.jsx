import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useStudents, useAttendance } from "../../../context/AcademicContext";

function AttendancePreview() {
  const { students = [] } = useStudents();
  const { getStudentAttendance } = useAttendance();

  const today = new Date().toISOString().split("T")[0];
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const getStudentName = (s) =>
    s.name || `${s.firstName || ""} ${s.lastName || ""}`.trim() || s.email || "Student";

  const data = students
    .map((student) => {
      const sid = student._id || student.id;
      const history = getStudentAttendance(sid) || [];
      const todayAttendance = history.find((item) => item.date === today);
      const studentName = getStudentName(student);
      const initials =
        student.initials ||
        studentName
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() ||
        "ST";

      return {
        ...student,
        sid,
        name: studentName,
        rollNo: student.rollNo || "N/A",
        team: student.team || "No Team",
        initials,
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
        return "bg-green-100 text-green-700";

      case "Late":
        return "bg-orange-100 text-orange-700";

      case "Leave":
        return "bg-blue-100 text-blue-700";

      case "Absent":
        return "bg-red-100 text-red-700";

      case "Unmarked":
        return "bg-gray-100 text-gray-400";

      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col shadow-xs h-[380px] overflow-hidden">
      {/* Main Content */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Today's Attendance
            </h2>

            <p className="text-xs text-gray-500 mt-0.5">
              Live status across enrolled students
            </p>
          </div>

          <Link
            to="/attendance"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            View All
          </Link>
        </div>

        {/* Search */}
        <div className="relative mt-2.5">
          <FiSearch
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student..."
            className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg outline-none text-xs text-gray-700 focus:border-blue-500 transition"
          />
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
          {displayedData.map((student) => (
            <div
              key={student.sid}
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
              No students found.
            </div>
          )}
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500 mt-auto">
        <span>
          Showing {data.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
          {Math.min(currentPage * itemsPerPage, data.length)} of {data.length}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 rounded border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition cursor-pointer"
          >
            <FiChevronLeft size={14} />
          </button>

          <span className="px-2 font-medium text-gray-700">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1 rounded border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition cursor-pointer"
          >
            <FiChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AttendancePreview;