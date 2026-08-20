import React, { useState, useEffect } from "react";
import {
  FiClipboard,
  FiCheckCircle,
  FiExternalLink,
  FiClock,
  FiCheck,
  FiX,
  FiUser,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";
import { useTasks } from "../context/WorkContext";
import { useStudent } from "../context/AcademicContext";
import { useTeamProject } from "../context/TeamProjectContext";

function Deliverables() {
  const { tasks, fetchTasks, updateTaskStatus } = useTasks();
  const { students = [], fetchStudents } = useStudent();
  const { teams = [], fetchTeams } = useTeamProject();
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (fetchTasks) fetchTasks();
    if (fetchStudents) fetchStudents();
    if (fetchTeams) fetchTeams();
  }, [fetchTasks, fetchStudents, fetchTeams]);

  // Helper to resolve student name
  const resolveStudentName = (raw) => {
    if (!raw) return null;
    if (typeof raw === "object" && raw) {
      const name = `${raw.firstName || ""} ${raw.lastName || ""}`.trim() || raw.name || raw.email;
      const roll = raw.rollNumber || raw.rollNo || "";
      return { name, roll };
    }
    const rawId = String(raw);
    const found = students.find((s) => String(s._id || s.id) === rawId);
    if (found) {
      const name = `${found.firstName || ""} ${found.lastName || ""}`.trim() || found.name || found.email;
      const roll = found.rollNumber || found.rollNo || "";
      return { name, roll };
    }
    return { name: "Student", roll: "" };
  };

  // Helper to resolve team name
  const resolveTeamName = (raw) => {
    if (!raw) return null;
    if (typeof raw === "object" && raw) return raw.teamName || raw.name || "Assigned Team";
    const rawId = String(raw);
    const found = teams.find((t) => String(t._id || t.id) === rawId);
    return found ? found.teamName || found.name : "Assigned Team";
  };

  const deliverableTasks = tasks.filter((t) => t.submission || t.status === "In Review" || t.status === "Completed");

  const filtered = deliverableTasks.filter((t) => {
    if (filter === "All") return true;
    return t.status === filter;
  });

  return (
    <div className="p-5 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Admin Portal</span>
          <span>›</span>
          <span className="font-semibold text-gray-800">Student Deliverables</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Review Student Deliverables</h1>
        <p className="text-sm text-gray-500 mt-1">
          Inspect submitted code repositories, review sprint tasks, and evaluate student submissions
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-3">
        {["All", "In Review", "Completed", "In Progress"].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
              filter === status
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status === "In Review" ? "Under Review" : status === "Completed" ? "Approved" : status}
          </button>
        ))}
      </div>

      {/* Deliverables List */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const studentInfo = resolveStudentName(item.assignedStudentId);
          const teamName = resolveTeamName(item.assignedTeamId);

          return (
            <div
              key={item._id || item.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-300 transition"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      item.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : item.status === "In Review"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    ● {item.status === "Completed" ? "Approved" : item.status === "In Review" ? "In Review" : item.status}
                  </span>

                  {/* Student / Team badge */}
                  {studentInfo && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-medium flex items-center gap-1">
                      <FiUser size={12} /> {studentInfo.name} {studentInfo.roll ? `(${studentInfo.roll})` : ""}
                    </span>
                  )}
                  {teamName && (
                    <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200 font-medium flex items-center gap-1">
                      <FiUsers size={12} /> {teamName}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500">{item.description}</p>

                {item.submission && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-wrap items-center gap-4 text-xs">
                    <a
                      href={item.submission.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                    >
                      <FiExternalLink size={13} /> Open Repository / Demo URL
                    </a>
                    {item.submission.notes && (
                      <span className="text-gray-600 italic">
                        "{item.submission.notes}"
                      </span>
                    )}
                    <span className="text-gray-400 ml-auto">
                      Submitted on: {item.submission.submittedAt || "Recently"}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => updateTaskStatus(item._id || item.id, "Completed")}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <FiCheck size={14} /> Approve
                </button>
                <button
                  type="button"
                  onClick={() => updateTaskStatus(item._id || item.id, "In Progress")}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <FiX size={14} /> Request Revision
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
            <FiClipboard size={36} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No deliverables matching this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Deliverables;
