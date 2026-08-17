import React, { useState, useEffect } from "react";
import { FiCheckSquare, FiUser, FiPlus, FiStar, FiSearch, FiAward, FiCheck } from "react-icons/fi";
import { useStudents, useAttendance } from "../context/AcademicContext";
import { useTeamProject } from "../context/TeamProjectContext";
import { useEvaluations, useTasks } from "../context/WorkContext";
import { useAuth } from "../context/AuthContext";

function Evaluations() {
  const { user } = useAuth();
  const { students = [], fetchStudents } = useStudents();
  const { projects = [], fetchProjects } = useTeamProject();
  const { getStudentAttendance } = useAttendance();
  const { tasks = [] } = useTasks();
  const { evaluations = [], addEvaluation, fetchEvaluations } = useEvaluations();

  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [scores, setScores] = useState({
    attendance_percentage: 90,
    task_score: 85,
    project_score: 88,
    behavior_score: 92,
    remarks: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (fetchStudents) fetchStudents();
    if (fetchProjects) fetchProjects();
    if (fetchEvaluations) fetchEvaluations();
  }, []);

  const filtered = students.filter((s) => {
    const name = `${s.firstName || ""} ${s.lastName || ""} ${s.name || ""}`.toLowerCase();
    return name.includes(search.toLowerCase()) || (s.email || "").toLowerCase().includes(search.toLowerCase());
  });

  const handleOpenEvaluate = (student) => {
    setSelectedStudent(student);
    const sid = student._id || student.id;

    // Precalculate realistic defaults based on live attendance
    const attendanceHistory = getStudentAttendance(sid) || [];
    const presentCount = attendanceHistory.filter((a) => a.status === "Present" || a.status === "Late").length;
    const attPct = attendanceHistory.length > 0 ? Math.round((presentCount / attendanceHistory.length) * 100) : 92;

    setSelectedProjectId(projects[0] ? (projects[0]._id || projects[0].id) : "");
    setScores({
      attendance_percentage: attPct,
      task_score: 88,
      project_score: 90,
      behavior_score: 92,
      remarks: "Demonstrates consistent performance, clean Git branch practices, and active participation.",
    });
    setSuccessMsg("");
  };

  const overallPerf = Math.round(
    (Number(scores.attendance_percentage) * 0.25) +
    (Number(scores.task_score) * 0.35) +
    (Number(scores.project_score) * 0.25) +
    (Number(scores.behavior_score) * 0.15)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedProjectId) {
      alert("Please ensure a student and project are selected.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        student: selectedStudent._id || selectedStudent.id,
        project: selectedProjectId,
        evaluator: user?._id || user?.id,
        attendance_percentage: Number(scores.attendance_percentage),
        task_score: Number(scores.task_score),
        project_score: Number(scores.project_score),
        behavior_score: Number(scores.behavior_score),
        overall_performance: overallPerf,
        remarks: scores.remarks,
      };

      await addEvaluation(payload);
      setSuccessMsg("Evaluation submitted and verified successfully!");
      setTimeout(() => {
        setSelectedStudent(null);
        setSuccessMsg("");
      }, 1200);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit evaluation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Evaluations</h1>
        <p className="text-sm text-gray-500 mt-1">
          Evaluate bootcamp participants on code architecture, sprint deliverables, and final projects
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students by name or email..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Students List for Evaluation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((student) => {
          const sid = student._id || student.id;
          const hasEval = evaluations.some((e) => (e.student?._id || e.student) === sid);

          return (
            <div
              key={sid}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                    {student.firstName?.[0] || student.name?.[0] || "S"}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {student.firstName ? `${student.firstName} ${student.lastName || ""}` : student.name}
                    </h3>
                    <p className="text-xs text-gray-500">{student.email}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Roll: {student.rollNumber || student.rollNo || "N/A"}</span>
                  <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                    hasEval ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {hasEval ? "Evaluated" : "Pending"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleOpenEvaluate(student)}
                className="mt-4 w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FiCheckSquare size={14} /> Evaluate Performance
              </button>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
            <FiUser size={36} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No students found.</p>
          </div>
        )}
      </div>

      {/* Modal / Evaluation Sheet */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Assess: {selectedStudent.firstName || selectedStudent.name}
                </h2>
                <p className="text-xs text-gray-500">
                  Roll: {selectedStudent.rollNumber || selectedStudent.rollNo} • Calculate live scorecard
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-2">
                <FiCheck size={16} /> {successMsg}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Target Project Module</label>
                <select
                  required
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-blue-500"
                >
                  {projects.map((p) => (
                    <option key={p._id || p.id} value={p._id || p.id}>
                      {p.projectName || p.name || p.title}
                    </option>
                  ))}
                  {projects.length === 0 && (
                    <option value="">No projects registered</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Attendance Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={scores.attendance_percentage}
                    onChange={(e) => setScores({ ...scores, attendance_percentage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Task Deliverables (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={scores.task_score}
                    onChange={(e) => setScores({ ...scores, task_score: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Project Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={scores.project_score}
                    onChange={(e) => setScores({ ...scores, project_score: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Behavior & Reviews (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={scores.behavior_score}
                    onChange={(e) => setScores({ ...scores, behavior_score: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Calculated Total */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                <span className="font-semibold text-blue-900">Overall Performance Index:</span>
                <span className="text-base font-bold text-blue-700">{overallPerf}%</span>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Instructor Assessment & Remarks</label>
                <textarea
                  rows="3"
                  value={scores.remarks}
                  onChange={(e) => setScores({ ...scores, remarks: e.target.value })}
                  placeholder="Enter detailed evaluation feedback for the student..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Saving Assessment..." : "Submit Evaluation"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Evaluations;
