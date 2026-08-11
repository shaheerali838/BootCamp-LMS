import React, { useState } from "react";
import {
  FiSearch,
  FiChevronDown,
  FiCalendar,
  FiSave,
} from "react-icons/fi";
import { attendanceData } from "../components/common/attendanceData";

function Attendance() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState(attendanceData);
  const [saved, setSaved] = useState(false);

  const today = "2026-08-11";

  // Get today's attendance
  const getTodayAttendance = (student) => {
    return (
      student.attendance.find(
        (item) => item.date === today
      ) || {
        date: today,
        status: "Absent",
        time: "--:--",
      }
    );
  };

  // Calculate attendance percentage
  const getAttendancePercentage = (student) => {
    const totalDays = student.attendance.length;

    if (totalDays === 0) {
      return 0;
    }

    const attendedDays = student.attendance.filter(
      (item) =>
        item.status === "Present" ||
        item.status === "Late"
    ).length;

    return Math.round(
      (attendedDays / totalDays) * 100
    );
  };

  // Change attendance
  const handleAttendanceChange = (
    studentId,
    newStatus
  ) => {
    setSaved(false);

    setStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student.id !== studentId) {
          return student;
        }

        const todayExists = student.attendance.some(
          (item) => item.date === today
        );

        let updatedAttendance;

        if (todayExists) {
          updatedAttendance = student.attendance.map(
            (item) => {
              if (item.date !== today) {
                return item;
              }

              return {
                ...item,
                status: newStatus,
                time:
                  newStatus === "Absent" ||
                  newStatus === "Leave"
                    ? "--:--"
                    : item.time === "--:--"
                    ? "08:45 AM"
                    : item.time,
              };
            }
          );
        } else {
          updatedAttendance = [
            {
              date: today,
              status: newStatus,
              time:
                newStatus === "Absent" ||
                newStatus === "Leave"
                  ? "--:--"
                  : "08:45 AM",
            },
            ...student.attendance,
          ];
        }

        return {
          ...student,
          attendance: updatedAttendance,
        };
      })
    );
  };

  // Mark all students present
  const handleMarkAllPresent = () => {
    setSaved(false);

    setStudents((prevStudents) =>
      prevStudents.map((student) => {
        const todayExists = student.attendance.some(
          (item) => item.date === today
        );

        if (todayExists) {
          return {
            ...student,
            attendance: student.attendance.map(
              (item) =>
                item.date === today
                  ? {
                      ...item,
                      status: "Present",
                      time:
                        item.time === "--:--"
                          ? "08:45 AM"
                          : item.time,
                    }
                  : item
            ),
          };
        }

        return {
          ...student,
          attendance: [
            {
              date: today,
              status: "Present",
              time: "08:45 AM",
            },
            ...student.attendance,
          ],
        };
      })
    );
  };

  // Save attendance
  const handleSaveAttendance = () => {
    console.log("Attendance saved:", students);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  // Search students
  const filteredStudents = students.filter(
    (student) => {
      const searchValue = search.toLowerCase();

      return (
        student.name
          .toLowerCase()
          .includes(searchValue) ||
        student.rollNo
          .toLowerCase()
          .includes(searchValue) ||
        student.team
          .toLowerCase()
          .includes(searchValue)
      );
    }
  );

  // Status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "text-green-600";

      case "Late":
        return "text-orange-500";

      case "Absent":
        return "text-red-500";

      case "Leave":
        return "text-purple-600";

      default:
        return "text-gray-600";
    }
  };

  // Progress color
  const getProgressColor = (percentage) => {
    if (percentage < 70) {
      return "bg-red-500";
    }

    return "bg-green-500";
  };

  // Today's counts
  const presentCount = students.filter(
    (student) =>
      getTodayAttendance(student).status ===
      "Present"
  ).length;

  const lateCount = students.filter(
    (student) =>
      getTodayAttendance(student).status === "Late"
  ).length;

  const leaveCount = students.filter(
    (student) =>
      getTodayAttendance(student).status === "Leave"
  ).length;

  const absentCount = students.filter(
    (student) =>
      getTodayAttendance(student).status === "Absent"
  ).length;

  return (
    <div className="p-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Attendance Management
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage today's student attendance
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
          <FiCalendar
            size={17}
            className="text-gray-500"
          />

          <span className="text-sm text-gray-600">
            August 11, 2026
          </span>
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
        {/* Total */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Total Students
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-1">
            {students.length}
          </h2>
        </div>

        {/* Present */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Present Today
          </p>

          <h2 className="text-2xl font-semibold text-green-600 mt-1">
            {presentCount}
          </h2>
        </div>

        {/* Late */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Late Today
          </p>

          <h2 className="text-2xl font-semibold text-orange-500 mt-1">
            {lateCount}
          </h2>
        </div>

        {/* Leave */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Leave Today
          </p>

          <h2 className="text-2xl font-semibold text-purple-600 mt-1">
            {leaveCount}
          </h2>
        </div>

        {/* Absent */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Absent Today
          </p>

          <h2 className="text-2xl font-semibold text-red-500 mt-1">
            {absentCount}
          </h2>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Search + Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-5 py-4 border-b border-gray-200">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <FiSearch
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name or roll no..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Mark All Present */}
            <button
              onClick={handleMarkAllPresent}
              className="px-5 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition"
            >
              Mark All Present
            </button>

            {/* Save Attendance */}
            <button
              onClick={handleSaveAttendance}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition"
            >
              <FiSave size={16} />

              Save Attendance
            </button>
          </div>
        </div>

        {/* Save Message */}
        {saved && (
          <div className="px-5 py-3 bg-green-50 border-b border-green-100 text-sm text-green-600">
            Attendance saved successfully.
          </div>
        )}

        {/* Table Header */}
        <div className="grid grid-cols-[1fr_1.6fr_1.4fr_1.5fr_1.2fr] items-center px-7 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase">
          <span>Roll No</span>
          <span>Name</span>
          <span>Team</span>
          <span>Attendance</span>
          <span>Action</span>
        </div>

        {/* Students */}
        {filteredStudents.map((student) => {
          const todayAttendance =
            getTodayAttendance(student);

          const percentage =
            getAttendancePercentage(student);

          return (
            <div
              key={student.id}
              className="grid grid-cols-[1fr_1.6fr_1.4fr_1.5fr_1.2fr] items-center px-7 py-4 border-b border-gray-100 hover:bg-gray-50 transition"
            >
              {/* Roll No */}
              <span className="text-sm text-gray-600">
                {student.rollNo}
              </span>

              {/* Student */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                  {student.initials}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {student.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    {todayAttendance.time}
                  </p>
                </div>
              </div>

              {/* Team */}
              <span className="text-sm text-gray-500">
                {student.team}
              </span>

              {/* Attendance */}
              <div className="flex items-center gap-3">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getProgressColor(
                      percentage
                    )}`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <span className="text-sm text-gray-700">
                  {percentage}%
                </span>
              </div>

              {/* Action Dropdown */}
              <div className="relative w-28">
                <select
                  value={todayAttendance.status}
                  onChange={(e) =>
                    handleAttendanceChange(
                      student.id,
                      e.target.value
                    )
                  }
                  className={`attendance-select w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-xs font-medium outline-none cursor-pointer hover:border-gray-300 focus:border-blue-500 ${getStatusColor(
                    todayAttendance.status
                  )}`}
                >
                  <option value="Present">
                    Present
                  </option>

                  <option value="Late">
                    Late
                  </option>

                  <option value="Absent">
                    Absent
                  </option>

                  <option value="Leave">
                    Leave
                  </option>
                </select>

                {/* Arrow inside button */}
                <FiChevronDown
                  size={14}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${getStatusColor(
                    todayAttendance.status
                  )}`}
                />
              </div>
            </div>
          );
        })}

        {/* No Results */}
        {filteredStudents.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500">
              No student found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;