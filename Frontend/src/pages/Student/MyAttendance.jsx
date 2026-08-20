import React, { useMemo, useEffect } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiShield,
  FiAlertCircle,
  FiDownload,
} from "react-icons/fi";
import { useAttendance } from "../../context/AcademicContext";
import { useAuth } from "../../context/AuthContext";
import { exportToCSV } from "../../utils/csvHelper";

function MyAttendance() {
  const { user } = useAuth();
  const {
    rawAttendance = [],
    myAttendanceStats,
    fetchAttendance,
    getStudentAttendance,
  } = useAttendance();

  useEffect(() => {
    if (fetchAttendance) fetchAttendance();
  }, [fetchAttendance]);

  const studentId = String(user?._id || user?.id || "");
  const studentName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.name ||
      "Student"
    : "Student";
  const rollNo = user?.rollNumber || user?.rollNo || "SMIT";

  const history = useMemo(() => {
    if (!studentId && rawAttendance.length > 0) return rawAttendance;
    return getStudentAttendance(studentId);
  }, [studentId, rawAttendance, getStudentAttendance]);

  const totalClasses = myAttendanceStats?.totalDays ?? history.length;
  const presentCount =
    myAttendanceStats?.presentDays ??
    history.filter((item) => item.status === "Present").length;
  const lateCount =
    myAttendanceStats?.lateDays ??
    history.filter((item) => item.status === "Late").length;
  const leaveCount =
    myAttendanceStats?.leaveDays ??
    history.filter((item) => item.status === "Leave").length;
  const absentCount =
    myAttendanceStats?.absentDays ??
    history.filter((item) => item.status === "Absent").length;

  const attendancePercentage =
    myAttendanceStats?.attendancePercentage !== undefined
      ? myAttendanceStats.attendancePercentage
      : totalClasses > 0
        ? Math.round(((presentCount + lateCount) / totalClasses) * 100)
        : 100;

  const handleExportCSV = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const headers = [
      "Date",
      "Check-in Time",
      "Check-out Time",
      "Status",
      "Remarks",
    ];
    const rows = history.map((item) => [
      item.date || todayStr,
      item.checkInTime || item.time || "--:--",
      item.checkOutTime || "--:--",
      item.status || "Present",
      item.remarks || "",
    ]);

    exportToCSV(`my_attendance_${rollNo}_${todayStr}.csv`, headers, rows);
  };

  return (
    <div className="p-5 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Attendance Portal
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Live synchronized records for{" "}
              <span className="font-semibold text-gray-800">{studentName}</span>{" "}
              (Roll No:{" "}
              <span className="font-semibold text-blue-600">{rollNo}</span>)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <FiDownload size={14} />
              Export CSV
            </button>
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 w-fit">
              <FiShield size={13} className="text-emerald-600" />
              Live Cloud Synced
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Attendance Rate
          </p>
          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {attendancePercentage}%
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {attendancePercentage >= 85
              ? "Qualifying Status: Excellent"
              : "Target: 80% Minimum"}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Present
            </p>
            <FiCheckCircle className="text-emerald-500" size={20} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {presentCount}
          </h2>
          <p className="text-xs text-emerald-600 mt-1">Sessions Attended</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Late / Leave
            </p>
            <FiClock className="text-amber-500" size={20} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {lateCount + leaveCount}
          </h2>
          <p className="text-xs text-amber-600 mt-1">
            {lateCount} Late • {leaveCount} Leave
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Absent
            </p>
            <FiXCircle className="text-red-500" size={20} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {absentCount}
          </h2>
          <p className="text-xs text-red-600 mt-1">Missed Sessions</p>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FiCalendar size={18} className="text-blue-600" />
            Attendance History Log
          </h2>
          <span className="text-xs text-gray-400 font-medium">
            Total Sessions: {history.length}
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-4 px-5 py-3 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            <span>Date</span>
            <span>Check-in Time</span>
            <span className="text-right">Status</span>
          </div>

          {history.map((item, idx) => (
            <div
              key={item._id || idx}
              className="grid grid-cols-4 px-5 py-3.5 items-center hover:bg-gray-50/50 text-xs"
            >
              <span className="font-semibold text-gray-800">{item.date}</span>
              <span className="text-gray-600 font-medium">
                {item.checkInTime || item.time || "--:--"}
              </span>
              <span className="text-gray-500">
                {item.checkOutTime || "--:--"}
              </span>
              <div className="text-right">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold ${
                    item.status === "Present"
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : item.status === "Late"
                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                        : item.status === "Leave"
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}

          {history.length === 0 && (
            <div className="py-12 text-center text-gray-400 space-y-1">
              <FiAlertCircle
                size={24}
                className="mx-auto opacity-50 text-gray-300"
              />
              <p className="text-xs font-medium">
                No attendance records logged yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyAttendance;
