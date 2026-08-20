import React, { useState, useMemo, useEffect } from "react";
import {
  FiCalendar,
  FiClock,
  FiSearch,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiSave,
  FiCheck,
  FiFilter,
  FiDownload,
} from "react-icons/fi";
import { useStudents, useAttendance, useBatches } from "../../../context/AcademicContext";
import { useTeamProject } from "../../../context/TeamProjectContext";
import { exportToCSV } from "../../../utils/csvHelper";
import api from "../../../api/axios";

function AttendanceManagement() {
  const { students = [], fetchStudents } = useStudents();
  const { batches = [], fetchBatches } = useBatches();
  const { rawAttendance = [], markAttendance, fetchAttendance, getStudentAttendance } = useAttendance();
  const { teams = [], fetchTeams } = useTeamProject();

  // Helper to format today's date in local timezone YYYY-MM-DD
  const getTodayLocalDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(() => getTodayLocalDate());
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [search, setSearch] = useState("");
  const [draftAttendance, setDraftAttendance] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (fetchStudents) fetchStudents();
    if (fetchBatches) fetchBatches();
    if (fetchTeams) fetchTeams();
    if (fetchAttendance) fetchAttendance();
  }, [fetchStudents, fetchBatches, fetchTeams, fetchAttendance]);

  // Automatic midnight (12:00 AM) session rollover
  useEffect(() => {
    let timerId;
    const scheduleMidnightRollover = () => {
      const now = new Date();
      // Next midnight (12:00:01 AM tomorrow)
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        1
      );
      const msUntilMidnight = nextMidnight.getTime() - now.getTime();

      timerId = setTimeout(() => {
        const newDay = getTodayLocalDate();
        setSelectedDate(newDay);
        setDraftAttendance({});
        if (fetchAttendance) fetchAttendance();
        scheduleMidnightRollover();
      }, msUntilMidnight);
    };

    scheduleMidnightRollover();
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [fetchAttendance]);

  const getStudentId = (student) => String(student._id || student.id || "");

  const getStudentName = (student) =>
    student.name || `${student.firstName || ""} ${student.lastName || ""}`.trim() || student.email || "Student";

  const getStudentTeam = (student) => {
    const sid = getStudentId(student);
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

  const getDateAttendance = (studentId) => {
    const records = getStudentAttendance(studentId);
    const foundRec = records.find((item) => item.date === selectedDate);
    return foundRec || { status: "", checkInTime: "--:--" };
  };

  const getStatus = (student) => {
    const sid = getStudentId(student);
    if (draftAttendance[sid]?.status) {
      return draftAttendance[sid].status;
    }
    return getDateAttendance(sid).status || "Unmarked";
  };

  const getCheckInTime = (student) => {
    const sid = getStudentId(student);
    if (draftAttendance[sid]?.checkInTime) {
      return draftAttendance[sid].checkInTime;
    }
    return getDateAttendance(sid).checkInTime || "--:--";
  };

  const handleStatusChange = (studentId, status) => {
    let checkInTime = "--:--";

    if (status === "Present" || status === "Late") {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      checkInTime = `${hours}:${minutes} ${ampm}`;
    }

    setDraftAttendance((prev) => ({
      ...prev,
      [studentId]: {
        status,
        checkInTime,
      },
    }));
  };

  const handleMarkAll = (status) => {
    const newDrafts = { ...draftAttendance };
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const currentTime = `${hours}:${minutes} ${ampm}`;

    filteredStudents.forEach((student) => {
      const sid = getStudentId(student);
      newDrafts[sid] = {
        status,
        checkInTime: status === "Present" || status === "Late" ? currentTime : "--:--",
      };
    });
    setDraftAttendance(newDrafts);
  };

  const handleSave = async () => {
    const entries = Object.entries(draftAttendance);
    if (entries.length === 0) {
      alert("No attendance changes to save.");
      return;
    }

    const payload = entries.map(([studentId, data]) => {
      const studentObj = students.find((s) => getStudentId(s) === studentId);
      const batchId =
        studentObj?.batchId?._id ||
        (typeof studentObj?.batchId === "string" ? studentObj?.batchId : null) ||
        studentObj?.batch?._id;

      return {
        studentId,
        batchId,
        date: selectedDate,
        status: data.status,
        checkInTime: data.checkInTime || "--:--",
      };
    });

    setSaving(true);
    try {
      await markAttendance(payload);
      setDraftAttendance({});
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Save attendance error:", err);
      alert(err?.response?.data?.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      // Ensure authoritative complete attendance history
      let allRecords = rawAttendance;
      try {
        const res = await api.get("/attendance");
        if (res.data?.success && Array.isArray(res.data.data)) {
          allRecords = res.data.data;
        }
      } catch (e) {
        console.warn("Using context attendance cache for export:", e);
      }

      const todayStr = new Date().toISOString().split("T")[0];
      const headers = [
        "Roll No",
        "Student Name",
        "Email",
        "Phone Number",
        "Batch",
        "Team",
        "Attendance Date",
        "Session Status",
        "Time",
        "Total Sessions",
        "Present Count",
        "Late Count",
        "Leave Count",
        "Absent Count",
        "Attendance Rate (%)",
        "Student Status",
        "Remarks",
      ];

      const rows = [];

      filteredStudents.forEach((student) => {
        const sid = getStudentId(student);
        const studentName = getStudentName(student);
        const rollNo = student.rollNumber || student.rollNo || "N/A";
        const email = student.email || "N/A";
        const phone = student.phoneNumber || student.phone || "N/A";
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

        // Find all history records for this student
        const studentRecords = allRecords.filter((rec) => {
          const recStudentId = String(rec.studentId?._id || rec.studentId || rec.student || "");
          return recStudentId === sid || (rollNo !== "N/A" && rec.studentId?.rollNumber === rollNo);
        });

        // Sort records by date descending
        studentRecords.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

        const totalSessions = studentRecords.length;
        const presentCount = studentRecords.filter((r) => r.status === "Present").length;
        const lateCount = studentRecords.filter((r) => r.status === "Late").length;
        const leaveCount = studentRecords.filter((r) => r.status === "Leave").length;
        const absentCount = studentRecords.filter((r) => r.status === "Absent").length;
        const attendanceRate =
          totalSessions > 0
            ? `${Math.round(((presentCount + lateCount) / totalSessions) * 100)}%`
            : "100%";

        if (studentRecords.length > 0) {
          studentRecords.forEach((rec) => {
            rows.push([
              rollNo,
              studentName,
              email,
              phone,
              batchName,
              teamName,
              rec.date || todayStr,
              rec.status || "Present",
              rec.checkInTime || rec.time || "--:--",
              totalSessions,
              presentCount,
              lateCount,
              leaveCount,
              absentCount,
              attendanceRate,
              studentStatus,
              rec.remarks || "",
            ]);
          });
        } else {
          // If no logs recorded yet, output one summary row for the student
          rows.push([
            rollNo,
            studentName,
            email,
            phone,
            batchName,
            teamName,
            selectedDate,
            getStatus(student) !== "Unmarked" ? getStatus(student) : "No Records",
            getCheckInTime(student) !== "--:--" ? getCheckInTime(student) : "--:--",
            totalSessions,
            presentCount,
            lateCount,
            leaveCount,
            absentCount,
            attendanceRate,
            studentStatus,
            "No historical logs recorded yet",
          ]);
        }
      });

      exportToCSV(`attendance_history_all_${todayStr}.csv`, headers, rows);
    } catch (err) {
      console.error("Export CSV Error:", err);
      alert("Failed to export attendance CSV.");
    }
  };

  const filteredStudents = useMemo(() => {
    const searchVal = search.toLowerCase();

    return students.filter((student) => {
      // Batch filter
      if (selectedBatch !== "All") {
        const bId =
          student.batchId?._id ||
          student.batchId?.id ||
          (typeof student.batchId === "string" ? student.batchId : null) ||
          student.batch?._id ||
          student.batch?.id ||
          student.batch;
        if (String(bId) !== String(selectedBatch)) return false;
      }

      const name = getStudentName(student).toLowerCase();
      const rollNo = String(student.rollNumber || student.rollNo || "").toLowerCase();
      const team = getStudentTeam(student).toLowerCase();

      return (
        name.includes(searchVal) ||
        rollNo.includes(searchVal) ||
        team.includes(searchVal)
      );
    });
  }, [students, teams, search, selectedBatch]);

  const presentCount = filteredStudents.filter((s) => getStatus(s) === "Present").length;
  const lateCount = filteredStudents.filter((s) => getStatus(s) === "Late").length;
  const leaveCount = filteredStudents.filter((s) => getStatus(s) === "Leave").length;
  const absentCount = filteredStudents.filter((s) => getStatus(s) === "Absent").length;

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Mark, synchronize, and store daily student attendance records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <FiCalendar size={14} className="text-blue-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setDraftAttendance({});
              }}
              className="bg-transparent border-none outline-none font-bold cursor-pointer text-gray-800 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 text-xs">
            <FiFilter size={13} className="text-gray-400" />
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="bg-transparent border-none outline-none font-semibold text-gray-700 text-xs cursor-pointer"
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

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 animate-fadeIn">
          <FiCheck size={16} className="text-emerald-600" />
          Attendance saved and synchronized to the database successfully!
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Present
            </div>
            <div className="text-xl font-bold text-green-600 mt-0.5">
              {presentCount}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <FiCheckCircle size={16} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Late
            </div>
            <div className="text-xl font-bold text-orange-600 mt-0.5">
              {lateCount}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
            <FiClock size={16} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              On Leave
            </div>
            <div className="text-xl font-bold text-blue-600 mt-0.5">
              {leaveCount}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <FiAlertCircle size={16} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Absent
            </div>
            <div className="text-xl font-bold text-red-600 mt-0.5">
              {absentCount}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <FiXCircle size={16} />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        {/* Controls */}
        <div className="p-3 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <FiSearch
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search student, roll number, or team..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <FiDownload size={13} className="text-gray-500" />
              Export CSV
            </button>

            <button
              type="button"
              onClick={() => handleMarkAll("Present")}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              Mark All Present
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || Object.keys(draftAttendance).length === 0}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <FiSave size={14} />
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-6 px-4 py-2.5 bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
          <span>Roll No.</span>
          <span className="col-span-2">Student & Team</span>
          <span>Time</span>
          <span>Status</span>
          <span className="text-right">Action</span>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-100">
          {filteredStudents.map((student) => {
            const sid = getStudentId(student);
            const studentName = getStudentName(student);
            const teamName = getStudentTeam(student);
            const status = getStatus(student);
            const checkIn = getCheckInTime(student);
            const avatar = student.profilePicture || student.profileImage || student.image || "";
            const initials =
              student.initials ||
              studentName
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() ||
              "ST";

            return (
              <div
                key={sid}
                className="grid grid-cols-6 items-center px-4 py-3 hover:bg-gray-50/50 text-xs"
              >
                {/* Roll Number */}
                <span className="font-semibold text-gray-700">
                  {student.rollNumber || student.rollNo || "N/A"}
                </span>

                {/* Student & Team */}
                <div className="col-span-2 flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 overflow-hidden border border-blue-200">
                    {avatar ? (
                      <img src={avatar} alt={studentName} className="w-full h-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 truncate">{studentName}</div>
                    <div
                      className={`text-[11px] truncate ${
                        teamName !== "No Team" ? "text-blue-600 font-medium" : "text-gray-400"
                      }`}
                    >
                      {teamName}
                    </div>
                  </div>
                </div>

                {/* Check-in Time */}
                <span className="text-gray-600 font-medium">{checkIn}</span>

                {/* Status Badge */}
                <div>
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      status === "Present"
                        ? "bg-green-100 text-green-700"
                        : status === "Late"
                        ? "bg-orange-100 text-orange-700"
                        : status === "Leave"
                        ? "bg-blue-100 text-blue-700"
                        : status === "Absent"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                {/* Action Selector */}
                <div className="flex justify-end">
                  <select
                    value={draftAttendance[sid]?.status || (status !== "Unmarked" ? status : "")}
                    onChange={(e) => handleStatusChange(sid, e.target.value)}
                    className={`text-xs px-2 py-1 rounded border outline-none cursor-pointer transition ${getDropdownStyle(
                      draftAttendance[sid]?.status || status
                    )}`}
                  >
                    <option value="">Mark As...</option>
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Leave">Leave</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
              </div>
            );
          })}

          {filteredStudents.length === 0 && (
            <div className="py-12 text-center text-xs text-gray-500">
              No students found for the selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendanceManagement;