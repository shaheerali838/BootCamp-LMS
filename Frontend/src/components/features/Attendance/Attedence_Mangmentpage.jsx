import React, { useMemo, useState } from "react";

import {
  FiSearch,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiCalendar,
  FiSave,
} from "react-icons/fi";

import { useStudent } from "../../../context/StudentContext";
import { useAttendance } from "../../../context/AttendanceContext";

function AttendanceManagement() {
  const { students } = useStudent();

  const {
    attendance,
    updateAttendance,
  } = useAttendance();

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const [search, setSearch] = useState("");
  const [draftAttendance, setDraftAttendance] = useState({});

  const getTodayAttendance = (studentId) => {
    const student = attendance.find(
      (item) => item.id === studentId
    );

    if (!student) {
      return {
        status: "Absent",
        time: "--:--",
      };
    }

    return (
      student.attendance.find(
        (item) => item.date === today
      ) || {
        status: "Absent",
        time: "--:--",
      }
    );
  };

  const getStatus = (student) => {
    return (
      draftAttendance[student.id]?.status ||
      getTodayAttendance(student.id).status
    );
  };

  const getTime = (student) => {
    return (
      draftAttendance[student.id]?.time ||
      getTodayAttendance(student.id).time
    );
  };

  const handleStatusChange = (
    studentId,
    status
  ) => {
    let time = "--:--";

    if (status === "Present") {
      time = new Date().toLocaleTimeString(
        "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    }

    if (status === "Late") {
      time = new Date().toLocaleTimeString(
        "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    }

    setDraftAttendance((previous) => ({
      ...previous,
      [studentId]: {
        status,
        time,
      },
    }));
  };

  const handleSave = () => {
    Object.entries(draftAttendance).forEach(
      ([studentId, data]) => {
        updateAttendance(
          Number(studentId),
          today,
          data.status,
          data.time
        );
      }
    );

    setDraftAttendance({});

    alert("Attendance saved successfully!");
  };

  const filteredStudents = useMemo(() => {
    const value = search.toLowerCase();

    return students.filter((student) => {
      const name = student.name || "";
      const rollNo = student.rollNo || "";
      const team = student.team || "";

      return (
        name.toLowerCase().includes(value) ||
        rollNo.toLowerCase().includes(value) ||
        team.toLowerCase().includes(value)
      );
    });
  }, [students, search]);

  const presentCount = students.filter(
    (student) =>
      getStatus(student) === "Present"
  ).length;

  const lateCount = students.filter(
    (student) =>
      getStatus(student) === "Late"
  ).length;

  const leaveCount = students.filter(
    (student) =>
      getStatus(student) === "Leave"
  ).length;

  const absentCount = students.filter(
    (student) =>
      getStatus(student) === "Absent"
  ).length;

  const getStatusStyle = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-600";

      case "Late":
        return "bg-orange-100 text-orange-600";

      case "Leave":
        return "bg-blue-100 text-blue-600";

      case "Absent":
        return "bg-red-100 text-red-500";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">

      {/* Header */}

      <div>
        <div className="flex items-center gap-2 text-xs">

          <span className="text-gray-400">
            Home
          </span>

          <span className="text-gray-300">
            ›
          </span>

          <span className="font-medium text-gray-700">
            Attendance Management
          </span>

        </div>

        <div className="mt-2">

          <h1 className="text-xl font-semibold text-gray-900">
            Attendance Management
          </h1>

          <p className="text-xs text-gray-500 mt-1">
            Manage today's student attendance
          </p>

        </div>
      </div>


      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

        {/* Total */}

        <div className="bg-white border border-gray-200 rounded-xl p-4">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs text-gray-500">
                Total Students
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-1">
                {students.length}
              </h2>

            </div>

            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">

              <FiUsers size={19} />

            </div>

          </div>

        </div>


        {/* Present */}

        <div className="bg-white border border-gray-200 rounded-xl p-4">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs text-gray-500">
                Present Today
              </p>

              <h2 className="text-2xl font-semibold text-green-600 mt-1">
                {presentCount}
              </h2>

            </div>

            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">

              <FiCheckCircle size={19} />

            </div>

          </div>

        </div>


        {/* Late */}

        <div className="bg-white border border-gray-200 rounded-xl p-4">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs text-gray-500">
                Late Today
              </p>

              <h2 className="text-2xl font-semibold text-orange-500 mt-1">
                {lateCount}
              </h2>

            </div>

            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">

              <FiClock size={19} />

            </div>

          </div>

        </div>


        {/* Leave */}

        <div className="bg-white border border-gray-200 rounded-xl p-4">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs text-gray-500">
                On Leave
              </p>

              <h2 className="text-2xl font-semibold text-blue-600 mt-1">
                {leaveCount}
              </h2>

            </div>

            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">

              <FiCalendar size={19} />

            </div>

          </div>

        </div>


        {/* Absent */}

        <div className="bg-white border border-gray-200 rounded-xl p-4">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs text-gray-500">
                Absent Today
              </p>

              <h2 className="text-2xl font-semibold text-red-500 mt-1">
                {absentCount}
              </h2>

            </div>

            <div className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center">

              <FiXCircle size={19} />

            </div>

          </div>

        </div>

      </div>


      {/* Attendance Table */}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

        {/* Table Header */}

        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">

          <div>

            <h2 className="text-base font-semibold text-gray-800">
              Today's Attendance
            </h2>

            <p className="text-xs text-gray-500 mt-0.5">
              {new Date().toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </p>

          </div>


          {/* Search */}

          <div className="relative">

            <FiSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search student..."
              className="w-56 pl-9 pr-3 py-2 border border-gray-200 rounded-lg outline-none text-xs text-gray-700 focus:border-blue-500"
            />

          </div>

        </div>


        {/* Columns */}

        <div className="grid grid-cols-6 px-4 py-3 bg-gray-50 text-[11px] font-medium text-gray-500 uppercase">

          <span>
            Roll No
          </span>

          <span>
            Student
          </span>

          <span>
            Team
          </span>

          <span>
            Time
          </span>

          <span>
            Status
          </span>

          <span className="text-right">
            Actions
          </span>

        </div>


        {/* Students */}

        {filteredStudents.map((student) => {

          const status = getStatus(student);

          const time = getTime(student);

          return (

            <div
              key={student.id}
              className="grid grid-cols-6 items-center px-4 py-3 border-t border-gray-100 hover:bg-gray-50"
            >

              {/* Roll Number */}

              <span className="text-xs text-gray-500">
                {student.rollNo}
              </span>


              {/* Student */}

              <div className="flex items-center gap-2">

                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-semibold">

                  {student.initials ||
                    student.name
                      ?.split(" ")
                      .map(
                        (word) =>
                          word[0]
                      )
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}

                </div>

                <span className="text-xs font-medium text-gray-800">
                  {student.name}
                </span>

              </div>


              {/* Team */}

              <span className="text-xs text-gray-500">
                {student.team || "No Team"}
              </span>


              {/* Time */}

              <span className="text-xs text-gray-500">
                {time}
              </span>


              {/* Status */}

              <div>

                <span
                  className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-medium ${getStatusStyle(
                    status
                  )}`}
                >
                  {status}
                </span>

              </div>


              {/* Action */}

              <div className="flex justify-end">

                <div className="relative">

                  <select
                    value={status}
                    onChange={(e) =>
                      handleStatusChange(
                        student.id,
                        e.target.value
                      )
                    }
                    className={`appearance-none cursor-pointer pl-3 pr-7 py-1.5 rounded-lg text-xs font-medium border outline-none ${getStatusStyle(
                      status
                    )}`}
                  >

                    <option value="Present">
                      Present
                    </option>

                    <option value="Late">
                      Late
                    </option>

                    <option value="Leave">
                      Leave
                    </option>

                    <option value="Absent">
                      Absent
                    </option>

                  </select>

                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-current text-[9px]">
                    ▼
                  </span>

                </div>

              </div>

            </div>

          );

        })}


        {/* No Students */}

        {filteredStudents.length === 0 && (

          <div className="px-4 py-8 text-center text-xs text-gray-500">
            No student found.
          </div>

        )}

      </div>


      {/* Save Attendance */}

      <div className="flex justify-end">

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
        >

          <FiSave size={16} />

          Save Attendance

        </button>

      </div>

    </div>
  );
}

export default AttendanceManagement;