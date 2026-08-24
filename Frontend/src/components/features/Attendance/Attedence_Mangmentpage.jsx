import React, { useState, useMemo, useEffect } from "react";
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
import { useTeamProject } from "../../../context/TeamProjectContext";
import { PageSkeleton } from "../../common/Skeleton";

function AttendanceManagement() {
  const { students = [], loading: studentsLoading, fetchStudents } = useStudents();
  const { updateAttendance, getStudentAttendance, loading: attendanceLoading } = useAttendance();
  const { teams = [], teamsLoading, fetchTeams } = useTeamProject();

  useEffect(() => {
    if (fetchStudents) fetchStudents();
    if (fetchTeams) fetchTeams();
  }, [fetchStudents, fetchTeams]);

  const [search, setSearch] = useState("");
  const [draftAttendance, setDraftAttendance] = useState({});

  const today = new Date().toISOString().split("T")[0];

  const isLoading = studentsLoading && students.length === 0;

  const getStudentId = (student) => String(student._id || student.id || "");

  const getStudentName = (student) =>
    student.name ||
    `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
    student.email ||
    "Student";

  const getStudentTeam = (student) => {
    const sid = String(student._id || student.id || "");
    const studentRoll = String(
      student.rollNumber || student.rollNo || "",
    ).toLowerCase();
    const studentName = String(
      student.firstName
        ? `${student.firstName} ${student.lastName || ""}`
        : student.name || "",
    )
      .trim()
      .toLowerCase();

    const found = teams.find((team) => {
      const leadId = String(
        team.teamLead?._id || team.teamLead || team.lead || "",
      );
      const leadName = String(
        team.teamLead?.name || team.teamLead?.firstName
          ? `${team.teamLead.firstName} ${team.teamLead.lastName || ""}`
          : team.lead || "",
      ).toLowerCase();

      if (leadId && leadId === sid) return true;
      if (leadName && studentName && leadName === studentName) return true;

      if (Array.isArray(team.members)) {
        return team.members.some((m) => {
          const mId = String(m._id || m.id || m.studentId || m);
          const mRoll = String(m.rollNumber || m.rollNo || "").toLowerCase();
          const mName = String(
            m.name || m.firstName ? `${m.firstName} ${m.lastName || ""}` : m,
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

    return found ? found.teamName || found.name : "No Team";
  };

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
    if (draftAttendance[sid]?.status) {
      return draftAttendance[sid].status;
    }
    return getTodayAttendance(sid).status || "Unmarked";
  };

  const getCheckInTime = (student) => {
    const sid = getStudentId(student);
    if (draftAttendance[sid]?.checkInTime) {
      return draftAttendance[sid].checkInTime;
    }
    return getTodayAttendance(sid).checkInTime || "--:--";
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

  const handleSave = () => {
    Object.entries(draftAttendance).forEach(([studentId, data]) => {
      if (data.status) {
        updateAttendance(studentId, today, data.status, data.checkInTime);
      }
    });

    setDraftAttendance({});
    alert("Attendance saved successfully!");
  };

  const filteredStudents = useMemo(() => {
    const value = search.toLowerCase();

    return students.filter((student) => {
      const name = getStudentName(student).toLowerCase();
      const rollNo = (student.rollNumber || student.rollNo || "").toLowerCase();
      const team = getStudentTeam(student).toLowerCase();

      return (
        name.includes(value) || rollNo.includes(value) || team.includes(value)
      );
    });
  }, [students, teams, search]);

  const presentCount = students.filter(
    (student) => getStatus(student) === "Present",
  ).length;
  const lateCount = students.filter(
    (student) => getStatus(student) === "Late",
  ).length;
  const leaveCount = students.filter(
    (student) => getStatus(student) === "Leave",
  ).length;
  const absentCount = students.filter(
    (student) => getStatus(student) === "Absent",
  ).length;

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

  if (isLoading) {
    return <PageSkeleton statCount={4} rowCount={8} />;
  }

  return (
    <div className="pt-6 px-3 pb-3 min-h-screen mx-auto space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Attendance</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Mark and track daily student presence
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 w-fit">
          <FiCalendar size={14} className="text-[#0476b9]" />
          <span>{today}</span>
        </div>
      </div>

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

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <FiSave size={14} />
            Save Attendance
          </button>
        </div>

        {/* Table wrapper */}
        <div className="overflow-x-auto w-full">
          <div className="min-w-165">
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
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 truncate">
                          {studentName}
                        </div>
                        <div
                          className={`text-[11px] truncate ${
                            teamName !== "No Team"
                              ? "text-blue-600 font-medium"
                              : "text-gray-400"
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
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(sid, "Present")}
                        className="text-xs px-2.5 py-1 rounded-lg border border-green-600 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-xs transition cursor-pointer whitespace-nowrap"
                      >
                        Present
                      </button>

                      <select
                        value={
                          draftAttendance[sid]?.status &&
                          draftAttendance[sid]?.status !== "Present"
                            ? draftAttendance[sid].status
                            : ""
                        }
                        onChange={(e) =>
                          handleStatusChange(sid, e.target.value)
                        }
                        className={`text-xs px-2 py-1 rounded-lg border outline-none cursor-pointer transition whitespace-nowrap ${getDropdownStyle(
                          draftAttendance[sid]?.status &&
                            draftAttendance[sid]?.status !== "Present"
                            ? draftAttendance[sid].status
                            : "",
                        )}`}
                      >
                        <option value="">Mark As...</option>
                        <option value="Late">Late</option>
                        <option value="Leave">On Leave</option>
                        <option value="Absent">Absent</option>
                      </select>
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
    </div>
  );
}

export default AttendanceManagement;
