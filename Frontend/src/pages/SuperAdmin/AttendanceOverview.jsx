import React, { useMemo, useState, useEffect } from "react";
import { FiCalendar, FiCheckCircle, FiSearch, FiXCircle, FiClock, FiUsers, FiFilter, FiActivity, FiDownload } from "react-icons/fi";
import { useStudent, useAttendance, useBatches } from "../../context/AcademicContext";
import { useTeamProject } from "../../context/TeamProjectContext";
import { exportToCSV } from "../../utils/csvHelper";
import api from "../../api/axios";

function AttendanceOverview() {
  const { students = [], fetchStudents } = useStudent();
  const { batches = [], fetchBatches } = useBatches();
  const { attendance = [], rawAttendance = [], fetchAttendance, getStudentAttendance } = useAttendance();
  const { teams = [], fetchTeams } = useTeamProject();
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All");

  useEffect(() => {
    if (fetchStudents) fetchStudents();
    if (fetchBatches) fetchBatches();
    if (fetchTeams) fetchTeams();
    if (fetchAttendance) fetchAttendance();
  }, [fetchStudents, fetchBatches, fetchTeams, fetchAttendance]);

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
      if (selectedBatch !== "All") {
        const bId =
          student.batchId?._id ||
          student.batchId?.id ||
          (typeof student.batchId === "string" ? student.batchId : null) ||
          student.batch?._id ||
          student.batch;
        if (String(bId) !== String(selectedBatch)) return false;
      }

      const name = student.name || `${student.firstName || ""} ${student.lastName || ""}`.trim();
      const rollNo = String(student.rollNumber || student.rollNo || "");
      const team = getStudentTeam(student);

      return (
        name.toLowerCase().includes(value) ||
        rollNo.toLowerCase().includes(value) ||
        team.toLowerCase().includes(value)
      );
    });
  }, [students, teams, search, selectedBatch]);

  // Overall system metrics from rawAttendance
  const totalLogs = rawAttendance.length;
  const totalPresentLogs = rawAttendance.filter((r) => r.status === "Present").length;
  const totalLateLogs = rawAttendance.filter((r) => r.status === "Late").length;
  const totalAbsentLogs = rawAttendance.filter((r) => r.status === "Absent").length;
  const systemAttendanceRate =
    totalLogs > 0 ? Math.round(((totalPresentLogs + totalLateLogs) / totalLogs) * 100) : 100;

  const handleExportCSV = async () => {
    const todayStr = new Date().toISOString().split("T")[0];
    let allRecords = rawAttendance;
    try {
      const res = await api.get("/attendance");
      if (res.data?.success && Array.isArray(res.data.data)) {
        allRecords = res.data.data;
      }
    } catch (e) {
      console.warn("Using context attendance cache for export:", e);
    }

    const headers = [
      "Roll Number",
      "Student Name",
      "Email",
      "Team",
      "Batch",
      "Attendance Date",
      "Session Status",
      "Time",
      "Total Sessions Logged",
      "Present Sessions",
      "Late Sessions",
      "Leave Sessions",
      "Absent Sessions",
      "Attendance Percentage",
      "Student Status",
      "Remarks",
    ];

    const rows = [];

    filteredStudents.forEach((student) => {
      const sid = String(student._id || student.id || "");
      const studentName = student.name || `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Student";
      const rollNo = student.rollNumber || student.rollNo || "N/A";
      const email = student.email || "N/A";
      const teamName = getStudentTeam(student);
      const batchObj = batches.find(
        (b) =>
          String(b._id || b.id) ===
          String(student.batchId?._id || student.batchId || student.batch?._id || student.batch)
      );
      const batchName =
        batchObj?.batchName ||
        student.batchId?.batchName ||
        student.batch?.batchName ||
        "All Batches";
      const studentStatus = student.status || "Active";

      const studentRecords = allRecords.filter((rec) => {
        const recStudentId = String(rec.studentId?._id || rec.studentId || rec.student || "");
        return recStudentId === sid || (rollNo !== "N/A" && rec.studentId?.rollNumber === rollNo);
      });

      studentRecords.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

      const totalRecords = studentRecords.length;
      const presentCount = studentRecords.filter((h) => h.status === "Present").length;
      const lateCount = studentRecords.filter((h) => h.status === "Late").length;
      const leaveCount = studentRecords.filter((h) => h.status === "Leave").length;
      const absentCount = studentRecords.filter((h) => h.status === "Absent").length;
      const percentage =
        totalRecords > 0
          ? `${Math.round(((presentCount + lateCount) / totalRecords) * 100)}%`
          : "100%";

      if (studentRecords.length > 0) {
        studentRecords.forEach((rec) => {
          rows.push([
            rollNo,
            studentName,
            email,
            teamName,
            batchName,
            rec.date || todayStr,
            rec.status || "Present",
            rec.checkInTime || rec.time || "--:--",
            totalRecords,
            presentCount,
            lateCount,
            leaveCount,
            absentCount,
            percentage,
            studentStatus,
            rec.remarks || "",
          ]);
        });
      } else {
        rows.push([
          rollNo,
          studentName,
          email,
          teamName,
          batchName,
          todayStr,
          "No Records",
          "--:--",
          totalRecords,
          presentCount,
          lateCount,
          leaveCount,
          absentCount,
          percentage,
          studentStatus,
          "No historical logs recorded yet",
        ]);
      }
    });

    exportToCSV(`system_attendance_analytics_${todayStr}.csv`, headers, rows);
  };

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              System Attendance Analytics
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Live tracking and status logs synchronized across all enrolled students
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
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-blue-100 w-fit">
              <FiCalendar size={15} />
              <span>Today: {new Date().toISOString().split("T")[0]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Overall Rate
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiActivity size={16} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-blue-600 mt-1">{systemAttendanceRate}%</h2>
          <p className="text-xs text-gray-400 mt-0.5">Across {totalLogs} logged sessions</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Total Students
            </span>
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FiUsers size={16} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">{students.length}</h2>
          <p className="text-xs text-indigo-600 mt-0.5">Enrolled candidates</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Present Logs
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FiCheckCircle size={16} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-emerald-600 mt-1">{totalPresentLogs + totalLateLogs}</h2>
          <p className="text-xs text-emerald-600 mt-0.5">{totalPresentLogs} On-time • {totalLateLogs} Late</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Absent Logs
            </span>
            <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <FiXCircle size={16} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mt-1">{totalAbsentLogs}</h2>
          <p className="text-xs text-red-500 mt-0.5">Unexcused missed classes</p>
        </div>
      </div>

      {/* Search & Batch Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <FiSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student by name, roll no, or team..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-xs w-full sm:w-auto">
            <FiFilter size={14} className="text-gray-400" />
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="bg-transparent border-none outline-none font-semibold text-gray-700 text-xs cursor-pointer w-full"
            >
              <option value="All">All Batches</option>
              {batches.map((b) => (
                <option key={b._id || b.id} value={b._id || b.id}>
                  {b.batchName || b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Student Attendance Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs w-full max-w-full min-w-0">
        <div className="overflow-x-auto w-full min-w-0 max-w-full">
          <div className="grid grid-cols-6 min-w-[650px] px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
            <span className="col-span-2">Student Name & Team</span>
            <span>Roll Number</span>
            <span>Total Logs</span>
            <span>Attendance Rate</span>
            <span className="text-right">Status</span>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredStudents.map((student) => {
              const sid = String(student._id || student.id);
              const history = getStudentAttendance(sid);
              const studentName = student.name || `${student.firstName || ""} ${student.lastName || ""}`.trim();
              const studentTeam = getStudentTeam(student);
              const totalRecords = history.length;
              const presentCount = history.filter(
                (h) => h.status === "Present" || h.status === "Late"
              ).length;
              const percentage = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 100;
              const avatar = student.profilePicture || student.profileImage || student.image || "";

              return (
                <div
                  key={sid}
                  className="grid grid-cols-6 min-w-[650px] items-center px-4 py-3 hover:bg-gray-50/50 text-xs"
                >
                {/* Name & Team */}
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-blue-200 shadow-2xs">
                    {avatar ? (
                      <img src={avatar} alt={studentName} className="w-full h-full object-cover" />
                    ) : (
                      studentName.charAt(0).toUpperCase()
                    )}
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
                  {totalRecords} sessions
                </span>

                {/* Attendance Rate */}
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        percentage < 75 ? "bg-red-500" : percentage < 85 ? "bg-amber-500" : "bg-emerald-500"
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
    </div>
  );
}

export default AttendanceOverview;
