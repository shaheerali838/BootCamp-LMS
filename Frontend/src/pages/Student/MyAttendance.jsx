import React, { useMemo } from "react";
import { FiCalendar, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import { useAttendance } from "../../context/AttendanceContext";

function MyAttendance() {
  const { attendance } = useAttendance();

  // Find own record (e.g. Ali Hassan / SMIT-1001)
  const myRecord = useMemo(() => {
    return (
      attendance.find((student) => student.rollNo === "SMIT-1001" || student.id === 1) ||
      attendance[0] || { attendance: [] }
    );
  }, [attendance]);

  const history = myRecord.attendance || [];

  const totalClasses = history.length;
  const presentCount = history.filter((item) => item.status === "Present").length;
  const lateCount = history.filter((item) => item.status === "Late").length;
  const absentCount = history.filter((item) => item.status === "Absent").length;

  const attendancePercentage =
    totalClasses > 0
      ? Math.round(((presentCount + lateCount) / totalClasses) * 100)
      : 100;

  return (
    <div className="p-5 space-y-6">
      {/* Page Header */}
      <div>
        
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
            <p className="text-sm text-gray-500 mt-1">
              View-only records for Roll No: <span className="font-medium text-gray-700">{myRecord.rollNo || "SMIT-1001"}</span> ({myRecord.name || "Ali Hassan"})
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full">
            Read-Only (Self Records)
          </div>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase">Attendance Rate</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-2">{attendancePercentage}%</h2>
          <p className="text-xs text-gray-400 mt-1">Overall Percentage</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500 uppercase">Present</p>
            <FiCheckCircle className="text-emerald-500" size={18} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">{presentCount}</h2>
          <p className="text-xs text-emerald-600 mt-1">Classes Attended</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500 uppercase">Late</p>
            <FiClock className="text-amber-500" size={18} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">{lateCount}</h2>
          <p className="text-xs text-amber-600 mt-1">Late Arrivals</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500 uppercase">Absent</p>
            <FiXCircle className="text-red-500" size={18} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">{absentCount}</h2>
          <p className="text-xs text-red-600 mt-1">Missed Sessions</p>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <FiCalendar size={18} className="text-blue-600" />
            Attendance History Log
          </h2>
          <span className="text-xs text-gray-400">Synced with Admin Records</span>
        </div>

        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-3 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
            <span>Date</span>
            <span>Check-in Time</span>
            <span>Status</span>
          </div>

          {history.map((item, idx) => (
            <div key={idx} className="grid grid-cols-3 px-5 py-3.5 items-center hover:bg-gray-50/50 text-sm">
              <span className="font-medium text-gray-800">{item.date}</span>
              <span className="text-gray-500">{item.time}</span>
              <div>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === "Present"
                      ? "bg-emerald-100 text-emerald-700"
                      : item.status === "Late"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}

          {history.length === 0 && (
            <div className="py-8 text-center text-gray-500 text-sm">
              No attendance records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyAttendance;
