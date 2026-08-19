import React, { useMemo, useState, useEffect } from "react";
import { FiCalendar, FiCheckCircle, FiSearch, FiXCircle, FiClock, FiUsers } from "react-icons/fi";
import { useStudent, useAttendance } from "../../context/AcademicContext";
import { useTeamProject } from "../../context/TeamProjectContext";

function AttendanceOverview() {
  const { students = [], fetchStudents } = useStudent();
  const { attendance = [] } = useAttendance();
  const { teams = [], fetchTeams } = useTeamProject();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (fetchStudents) fetchStudents();
    if (fetchTeams) fetchTeams();
  }, [fetchStudents, fetchTeams]);

  const getStudentTeam = (student) => {
    const sid = String(student._id || student.id || "");
    const studentRoll = String(student.rollNumber || student.rollNo || "").toLowerCase();
    const studentName = String(
      student.firstName ? `${student.firstName} ${student.lastName || ""}` : student.name || ""
    ).trim().toLowerCase();

    const found = teams.find((team) => {
      const leadId = String(team.teamLead?._id || team.teamLead || team.lead || "");
      const leadName = String(
        team.teamLead?.name || team.teamLead?.firstName
          ? `${team.teamLead.firstName} ${team.teamLead.lastName || ""}`
          : team.lead || ""
      ).toLowerCase();

      if (leadId && leadId === sid) return true;
      if (leadName && studentName && leadName === studentName) return true;

      if (Array.isArray(team.members)) {
        return team.members.some((m) => {
          const mId = String(m._id || m.id || m.studentId || m);
          const mRoll = String(m.rollNumber || m.rollNo || "").toLowerCase();
          const mName = String(
            m.name || m.firstName ? `${m.firstName} ${m.lastName || ""}` : m
          ).toLowerCase();
          return (
            (sid && mId === sid) ||
            (studentRoll && mRoll === studentRoll) ||
            (studentName && mName === studentName)
          );
        });
      }
      return false;
    });

    return found ? (found.teamName || found.name) : "No Team";
  };

  const filteredStudents = useMemo(() => {
    const value = search.toLowerCase();
    return students.filter((student) => {
      const name = student.name || `${student.firstName || ""} ${student.lastName || ""}`.trim();
      const rollNo = student.rollNumber || student.rollNo || "";
      const team = getStudentTeam(student);

      return (
        name.toLowerCase().includes(value) ||
        rollNo.toLowerCase().includes(value) ||
        team.toLowerCase().includes(value)
      );
    });
  }, [students, teams, search]);

  const getStudentHistory = (studentId) => {
    const record = attendance.find(
      (item) => item.id === studentId || item.studentId === studentId || item._id === studentId
    );
    return record ? record.attendance || [] : [];
  };

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Attendance Analytics
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Live tracking and status logs across all enrolled students
            </p>
          </div>

          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-100">
            <FiCalendar size={15} />
            <span>Today: {new Date().toISOString().split("T")[0]}</span>
          </div>
        </div>
      </div>

      {/* Search Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
        <div className="relative max-w-md">
          <FiSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student by name, roll no, or team..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Student Attendance Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="grid grid-cols-6 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
          <span className="col-span-2">Student Name & Team</span>
          <span>Roll Number</span>
          <span>Total Logs</span>
          <span>Attendance Rate</span>
          <span className="text-right">Status</span>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredStudents.map((student) => {
            const sid = student._id || student.id;
            const history = getStudentHistory(sid);
            const studentName = student.name || `${student.firstName || ""} ${student.lastName || ""}`.trim();
            const studentTeam = getStudentTeam(student);
            const totalRecords = history.length;
            const presentCount = history.filter(
              (h) => h.status === "Present" || h.status === "Late"
            ).length;
            const percentage = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 95;

            return (
              <div
                key={sid}
                className="grid grid-cols-6 items-center px-4 py-3 hover:bg-gray-50/50 text-xs"
              >
                {/* Name & Team */}
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                    {studentName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 truncate">
                      {studentName}
                    </div>
                    <div className={`text-[11px] truncate ${
                      studentTeam !== "No Team" ? "text-blue-600 font-semibold" : "text-gray-400"
                    }`}>
                      {studentTeam}
                    </div>
                  </div>
                </div>

                {/* Roll Number */}
                <span className="font-semibold text-gray-700">
                  {student.rollNumber || student.rollNo || "N/A"}
                </span>

                {/* Total Records */}
                <span className="text-gray-600 font-medium">
                  {totalRecords} records
                </span>

                {/* Attendance Rate */}
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        percentage < 75 ? "bg-red-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {percentage}%
                  </span>
                </div>

                {/* Status */}
                <div className="text-right">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      (student.status || "").toLowerCase() === "active"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {student.status || "Active"}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredStudents.length === 0 && (
            <div className="py-12 text-center text-xs text-gray-500">
              No students found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendanceOverview;
