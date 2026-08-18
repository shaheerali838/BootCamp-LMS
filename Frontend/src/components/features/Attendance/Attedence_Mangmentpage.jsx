import React, { useState, useMemo } from "react";
import {
  FiCalendar,
  FiClock,
  FiSearch,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiSave,
} from "react-icons/fi";
import { useStudents, useAttendance } from "../../../context/AcademicContext";

function AttendanceManagement() {
  const { students = [], fetchStudents } = useStudents();
  const { updateAttendance, getStudentAttendance } = useAttendance();

  React.useEffect(() => {
    if (fetchStudents) fetchStudents();
  }, [fetchStudents]);

  const [search, setSearch] = useState("");
  const [draftAttendance, setDraftAttendance] = useState({});

  const today = new Date().toISOString().split("T")[0];

  const getStudentId = (student) => student._id || student.id;

  const getStudentName = (student) =>
    student.name || `${student.firstName || ""} ${student.lastName || ""}`.trim() || student.email || "Student";

  const getTodayAttendance = (studentId) => {
    const student = students.find((s) => getStudentId(s) === studentId);
    if (!student) return { status: "", checkInTime: "--:--" };

    const records = getStudentAttendance(studentId);
    const todayRec = records.find((item) => item.date === today);

    return (
      todayRec || {
        status: "",
        checkInTime: "--:--",
      }
    );
  };

  const getStatus = (student) => {
    const sid = getStudentId(student);
    if (draftAttendance[sid]?.status !== undefined) {
      return draftAttendance[sid].status;
    }
    return getTodayAttendance(sid).status || "";
  };

  const getCheckInTime = (student) => {
    const sid = getStudentId(student);
    if (draftAttendance[sid]?.checkInTime !== undefined) {
      return draftAttendance[sid].checkInTime;
    }
    return (
      getTodayAttendance(sid).checkInTime ||
      getTodayAttendance(sid).time ||
      "--:--"
    );
  };

  const handleStatusChange = (studentId, status) => {
    let checkInTime = "--:--";

    if (status === "Present" || status === "Late") {
      checkInTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    setDraftAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        checkInTime,
      },
    }));
  };

  const handleSave = () => {
    Object.entries(draftAttendance).forEach(([studentId, data]) => {
      if (data.status) {
        updateAttendance(
          studentId,
          today,
          data.status,
          data.checkInTime
        );
      }
    });

    setDraftAttendance({});
    alert("Attendance saved successfully!");
  };

  const filteredStudents = useMemo(() => {
    const value = search.toLowerCase();

    return students.filter((student) => {
      const name = getStudentName(student).toLowerCase();
      const rollNo = (student.rollNo || "").toLowerCase();
      const team = (student.team || "").toLowerCase();

      return (
        name.includes(value) ||
        rollNo.includes(value) ||
        team.includes(value)
      );
    });
  }, [students, search]);

  const presentCount = students.filter((student) => getStatus(student) === "Present").length;
  const lateCount = students.filter((student) => getStatus(student) === "Late").length;
  const leaveCount = students.filter((student) => getStatus(student) === "Leave").length;
  const absentCount = students.filter((student) => getStatus(student) === "Absent").length;

  const getDropdownStyle = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700 border-green-300 font-semibold";
      case "Late":
        return "bg-orange-100 text-orange-700 border-orange-300 font-semibold";
      case "Leave":
        return "bg-blue-100 text-blue-700 border-blue-300 font-semibold";
      case "Absent":
        return "bg-red-100 text-red-700 border-red-300 font-semibold";
      default:
        return "bg-white text-gray-500 border-gray-300";
    }
  };

  return (
    <div className="pt-6 px-3 pb-3 min-h-screen mx-auto space-y-3">
      {/* Header */}
      <div>
        <div className="mt-2">
          <h1 className="text-2xl font-bold text-gray-800">
            Attendance Management
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Track and manage daily student attendance
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] text-gray-500 font-medium uppercase">
              Present
            </p>
            <p className="text-xl font-bold text-green-600 mt-1">
              {presentCount}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <FiCheckCircle size={18} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] text-gray-500 font-medium uppercase">
              Late
            </p>
            <p className="text-xl font-bold text-orange-600 mt-1">{lateCount}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
            <FiClock size={18} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] text-gray-500 font-medium uppercase">
              Leave
            </p>
            <p className="text-xl font-bold text-blue-600 mt-1">{leaveCount}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <FiAlertCircle size={18} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] text-gray-500 font-medium uppercase">
              Absent
            </p>
            <p className="text-xl font-bold text-red-600 mt-1">{absentCount}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-600">
            <FiXCircle size={18} />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        {/* Date Selector & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FiCalendar size={16} className="text-gray-500" />
            <span className="text-xs font-semibold text-gray-700">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="relative">
            <FiSearch
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student..."
              className="w-56 pl-9 pr-3 py-2 border border-gray-200 rounded-lg outline-none text-xs text-gray-700 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-6 px-4 py-3 bg-gray-50 text-[11px] font-medium text-gray-500 uppercase">
          <span>Roll No</span>
          <span className="col-span-2">Student & Team</span>
          <span>Check-in</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Students Rows */}
        <div className="divide-y divide-gray-100">
          {filteredStudents.map((student) => {
            const sid = getStudentId(student);
            const status = getStatus(student);
            const checkIn = getCheckInTime(student);
            const studentName = getStudentName(student);
            const initials =
              student.initials ||
              studentName
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "ST";

            return (
              <div
                key={sid}
                className="grid grid-cols-6 items-center px-4 py-3 hover:bg-gray-50/50 text-xs"
              >
                {/* Roll Number */}
                <span className="font-semibold text-gray-700">
                  {student.rollNo || "N/A"}
                </span>

                {/* Student & Team */}
                <div className="col-span-2 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                    {initials}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{studentName}</div>
                    <div className="text-[11px] text-gray-400">
                      {student.team || "No Team"}
                    </div>
                  </div>
                </div>

                {/* Check-in Time */}
                <span className="text-gray-600 font-medium">{checkIn}</span>

                {/* Status Badge */}
                <div>
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-[10px] ${
                      status ? getDropdownStyle(status) : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {status || "Unmarked"}
                  </span>
                </div>

                {/* Actions Dropdown */}
                <div className="flex justify-end">
                  <select
                    value={status}
                    onChange={(e) =>
                      handleStatusChange(sid, e.target.value)
                    }
                    className={`appearance-none cursor-pointer px-3 py-1.5 rounded-lg text-xs border outline-none transition ${getDropdownStyle(
                      status
                    )}`}
                  >
                    <option value="" disabled hidden>
                      Select Status
                    </option>
                    <option className="bg-green-100 text-green-700 border-green-300" value="Present">Present</option>
                    <option className="bg-orange-100 text-orange-700 border-orange-300" value="Late">Late</option>
                    <option className="bg-blue-100 text-blue-700 border-blue-300" value="Leave">Leave</option>
                    <option className="bg-red-100 text-red-700 border-red-300" value="Absent">Absent</option>
                  </select>
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
      </div>

      {/* Save Attendance */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow-xs cursor-pointer"
        >
          <FiSave size={16} />
          Save Attendance
        </button>
      </div>
    </div>
  );
}

export default AttendanceManagement;