import React, { useState, useEffect } from "react";
import {
  FiUpload,
  FiLink,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiExternalLink,
  FiAlertCircle,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { useTasks } from "../../context/WorkContext";
import { useTeamProject } from "../../context/TeamProjectContext";
import { useAuth } from "../../context/AuthContext";

function MyDeliverables() {
  const { user } = useAuth();
  const { tasks = [], fetchTasks, submitDeliverable } = useTasks();
  const { teams = [], fetchTeams } = useTeamProject();

  const [selectedTask, setSelectedTask] = useState(null);
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (fetchTasks) fetchTasks();
    if (fetchTeams) fetchTeams();
  }, [fetchTasks, fetchTeams]);

  const studentId = String(user?._id || user?.id || "");
  const studentRoll = String(user?.rollNumber || user?.rollNo || "").toLowerCase();
  const studentName = String(
    user?.firstName ? `${user.firstName} ${user.lastName || ""}` : user?.name || ""
  ).trim().toLowerCase();

  // Find teams the student belongs to (Leader or Member)
  const studentTeams = teams.filter((team) => {
    if (!studentId && !studentRoll && !studentName) return false;

    const rawLead = team.teamLead || team.lead || team.teamLeadId;
    const leadId = String(rawLead?._id || rawLead?.id || rawLead || "");
    const leadRoll = String(rawLead?.rollNumber || rawLead?.rollNo || "").toLowerCase();
    const leadName = String(
      rawLead?.firstName ? `${rawLead.firstName} ${rawLead.lastName || ""}` : rawLead?.name || rawLead || ""
    ).trim().toLowerCase();

    if (studentId && leadId && leadId === studentId) return true;
    if (studentRoll && leadRoll && leadRoll === studentRoll) return true;
    if (studentName && leadName && (leadName === studentName || leadName.includes(studentName))) return true;

    if (Array.isArray(team.members)) {
      return team.members.some((m) => {
        const mId = String(m?._id || m?.id || m?.studentId || m || "");
        const mRoll = String(m?.rollNumber || m?.rollNo || "").toLowerCase();
        const mName = String(
          m?.firstName ? `${m.firstName} ${m.lastName || ""}` : m?.name || m || ""
        ).trim().toLowerCase();

        return (
          (studentId && mId && mId === studentId) ||
          (studentRoll && mRoll && mRoll === studentRoll) ||
          (studentName && mName && (mName === studentName || mName.includes(studentName)))
        );
      });
    }
    return false;
  });

  const studentTeamIds = new Set(studentTeams.map((t) => String(t._id || t.id)));

  // Filter tasks dynamically assigned ONLY to this student OR their team
  const myAssignedTasks = tasks.filter((t) => {
    const assignStudentId = String(
      t.assignedStudentId?._id || t.assignedStudentId?.id || (typeof t.assignedStudentId === "string" ? t.assignedStudentId : "") || t.assignedStudent || ""
    );
    const assignTeamId = String(
      t.assignedTeamId?._id || t.assignedTeamId?.id || (typeof t.assignedTeamId === "string" ? t.assignedTeamId : "") || t.assignedTeam || ""
    );

    const isDirectlyAssigned = Boolean(studentId && assignStudentId && assignStudentId === studentId);
    const isTeamAssigned = Boolean(assignTeamId && studentTeamIds.has(assignTeamId));

    return isDirectlyAssigned || isTeamAssigned;
  });

  const submittedTasks = myAssignedTasks.filter(
    (t) => t.submission || t.status === "In Review" || t.status === "Completed"
  );
  const pendingTasks = myAssignedTasks.filter(
    (t) => !t.submission && t.status !== "Completed" && t.status !== "In Review"
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTask || !url) return;

    setSubmitting(true);
    try {
      await submitDeliverable(selectedTask._id || selectedTask.id, {
        url: url.trim(),
        notes: notes.trim(),
      });

      setSelectedTask(null);
      setUrl("");
      setNotes("");
    } catch (err) {
      console.error("Submission failed:", err);
      alert(err?.response?.data?.message || err?.message || "Failed to submit deliverable.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-5 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Student Portal</span>
          <span>›</span>
          <span className="font-semibold text-gray-800">My Deliverables</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">My Deliverables & Submissions</h1>
        <p className="text-sm text-gray-500 mt-1">
          Submit project repositories, deployment URLs, and track evaluation reviews for your assigned tasks
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Submissions */}
        <div className="lg:col-span-2 space-y-5">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FiClock className="text-amber-500" /> Pending Deliverables ({pendingTasks.length})
              </span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Tasks assigned to you or your team awaiting link submission</p>
          </div>

          <div className="space-y-3">
            {pendingTasks.map((task) => {
              const isTeamTask = Boolean(task.assignedTeamId);
              return (
                <div
                  key={task._id || task.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-300 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">{task.title}</h3>
                      {isTeamTask ? (
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded border border-indigo-200 flex items-center gap-1">
                          <FiUsers size={11} /> Team Deliverable
                        </span>
                      ) : (
                        <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                          <FiUser size={11} /> Individual
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{task.description}</p>
                    <div className="flex items-center gap-3 pt-1 text-xs text-gray-400">
                      <span>Due Date: <strong className="text-gray-700">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No deadline"}</strong></span>
                      <span>•</span>
                      <span className="text-amber-600 font-medium">Priority: {task.priority || "Medium"}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTask(task);
                      setUrl("");
                      setNotes("");
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shrink-0 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <FiUpload size={14} /> Submit Work
                  </button>
                </div>
              );
            })}

            {pendingTasks.length === 0 && (
              <div className="py-8 text-center text-gray-400 bg-white rounded-xl border border-gray-200 text-sm">
                <FiCheckCircle size={32} className="mx-auto mb-2 text-emerald-500" />
                <p className="font-semibold text-gray-700">All pending deliverables are submitted!</p>
                <p className="text-xs text-gray-400 mt-1">You have no overdue or pending work required.</p>
              </div>
            )}
          </div>

          {/* Past Submissions */}
          <div className="pt-3">
            <h2 className="text-base font-bold text-gray-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500" /> Submitted Deliverables ({submittedTasks.length})
              </span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Deliverables under review or approved by mentors</p>
          </div>

          <div className="space-y-3">
            {submittedTasks.map((task) => (
              <div
                key={task._id || task.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{task.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                      task.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    ● {task.status === "Completed" ? "Approved" : "In Review"}
                  </span>
                </div>

                {task.submission && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <FiLink className="text-blue-500 shrink-0" />
                      <a
                        href={task.submission.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 font-medium hover:underline truncate"
                      >
                        {task.submission.url}
                      </a>
                    </div>
                    {task.submission.notes && (
                      <span className="text-gray-500 italic truncate max-w-xs">
                        "{task.submission.notes}"
                      </span>
                    )}
                    <span className="text-gray-400 shrink-0">
                      {task.submission.submittedAt || "Submitted"}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {submittedTasks.length === 0 && (
              <div className="py-8 text-center text-gray-400 bg-white rounded-xl border border-gray-200 text-sm">
                No deliverables submitted yet.
              </div>
            )}
          </div>
        </div>

        {/* Submission Form Sidebar Pane */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs h-fit sticky top-6">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-3">
            <FiUpload className="text-blue-600" />
            {selectedTask ? "Submit Deliverable" : "Submission Panel"}
          </h2>

          {selectedTask ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-900">
                <p className="font-semibold">{selectedTask.title}</p>
                <p className="text-blue-700 mt-0.5">{selectedTask.description}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Repository / Live URL *
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/username/repo or Vercel URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Notes / Implementation Details
                </label>
                <textarea
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any instructions, credentials, or features completed..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Deliverable"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  disabled={submitting}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 text-gray-400 text-xs">
              <FiFileText size={32} className="mx-auto mb-2 opacity-50" />
              Select a pending deliverable from the list to submit your repository link or live demo URL.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyDeliverables;
