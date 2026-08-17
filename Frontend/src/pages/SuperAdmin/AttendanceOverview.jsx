import React, { useMemo, useState } from "react";
import { FiCalendar, FiCheckCircle, FiSearch, FiXCircle, FiClock, FiUsers } from "react-icons/fi";
import { useStudent, useAttendance } from "../../context/AcademicContext";

function AttendanceOverview() {
  const { students } = useStudent();
  const { attendance } = useAttendance();
  const [search, setSearch] = useState("");

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

  const getStudentHistory = (studentId) => {
    const record = attendance.find(
      (item) => item.id === studentId || item.studentId === studentId
    );
    return record ? record.attendance || [] : [];
  };

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
       
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiCalendar className="text-blue-600" />
              System-Wide Attendance Overview
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Read-only aggregate inspection of attendance across all enrolled students
            </p>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-3 py-1.5 rounded-full border border-blue-200">
            System-Wide Audit
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="relative max-w-md">
          <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student by name, roll no, or team..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Student Attendance List */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-5 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
          <span>Roll No</span>
          <span className="col-span-2">Student Name & Team</span>
          <span>Latest Record</span>
          <span className="text-right">Attendance Ratio</span>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredStudents.map((student) => {
            const history = getStudentHistory(student.id);
            const presentCount = history.filter(
              (a) => a.status === "Present" || a.status === "Late"
            ).length;
            const pct =
              history.length > 0
                ? Math.round((presentCount / history.length) * 100)
                : student.attendance || 100;
            const latest = history[0] || {
              date: "Today",
              status: "Present",
              time: "08:45 AM",
            };

            const studentName = student.name || `${student.firstName || ""} ${student.lastName || ""}`.trim() || student.email || "Student";
            const initials = student.initials || studentName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "ST";

            return (
              <div
                key={student._id || student.id}
                className="grid grid-cols-5 px-5 py-4 items-center hover:bg-gray-50 text-sm"
              >
                <span className="font-semibold text-gray-700 text-xs">
                  {student.rollNo || "N/A"}
                </span>
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                    {initials}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{studentName}</div>
                    <div className="text-xs text-gray-400">
                      {student.team || "No Team"}
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-800">
                    {latest.date} ({latest.time})
                  </span>
                  <span
                    className={`inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-semibold ${
                      latest.status === "Present"
                        ? "bg-emerald-100 text-emerald-700"
                        : latest.status === "Late"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {latest.status}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        pct < 75 ? "bg-red-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-800">{pct}%</span>
                </div>
              </div>
            );
          })}
          {filteredStudents.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-500">
              No student records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendanceOverview;
