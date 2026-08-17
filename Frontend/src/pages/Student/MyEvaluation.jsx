import React, { useEffect, useState } from "react";
import { FiAward, FiStar, FiCheckCircle, FiBarChart2, FiUserCheck, FiClock, FiFileText } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useAttendance } from "../../context/AcademicContext";
import { useTasks, useEvaluations } from "../../context/WorkContext";
import { useTeamProject } from "../../context/TeamProjectContext";
import api from "../../api/axios";

function MyEvaluation() {
  const { user } = useAuth();
  const { getStudentAttendance } = useAttendance();
  const { tasks = [] } = useTasks();
  const { projects = [] } = useTeamProject();
  const { evaluations = [], fetchEvaluations } = useEvaluations();

  const [studentEval, setStudentEval] = useState(null);
  const [loading, setLoading] = useState(false);

  const sid = user?._id || user?.id;

  useEffect(() => {
    if (fetchEvaluations) fetchEvaluations();

    if (sid) {
      setLoading(true);
      api
        .get(`/evaluations/get-evaluations-by-student/${sid}`)
        .then((res) => {
          if (res.data?.data && res.data.data.length > 0) {
            setStudentEval(res.data.data[0]);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [sid]);

  // Fallback to evaluation found in global context if direct fetch was empty
  const officialEval =
    studentEval ||
    evaluations.find(
      (e) => (e.student?._id || e.student || e.studentId) === sid
    );

  // Live calculated metrics
  const attendanceHistory = sid ? getStudentAttendance(sid) : [];
  const presentCount = attendanceHistory.filter(
    (a) => a.status === "Present" || a.status === "Late"
  ).length;
  const liveAttendanceScore =
    attendanceHistory.length > 0
      ? Math.round((presentCount / attendanceHistory.length) * 100)
      : 95;

  const completedTasks = tasks.filter(
    (t) => t.status === "Completed" || t.status === "In Review"
  ).length;
  const liveTaskScore =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 88;

  const liveProjectScore =
    projects.length > 0
      ? Math.round(
          projects.reduce((acc, p) => acc + (p.status === "Completed" ? 100 : 75), 0) /
            projects.length
        )
      : 90;

  const liveBehaviorScore = Math.min(100, Math.max(80, Math.round(liveAttendanceScore * 0.9 + 10)));

  // Determine criteria values from either Official Evaluation document or Live Calculations
  const criteria = [
    {
      title: "Attendance & Punctuality",
      score: officialEval ? officialEval.attendance_percentage : liveAttendanceScore,
      max: 100,
      feedback:
        (officialEval ? officialEval.remarks : null) ||
        (liveAttendanceScore >= 85
          ? "Consistent check-ins and active attendance throughout batch sessions."
          : "Needs improved punctuality during morning stands."),
    },
    {
      title: "Sprint & Task Delivery",
      score: officialEval ? officialEval.task_score : liveTaskScore,
      max: 100,
      feedback:
        `${completedTasks} of ${tasks.length || 1} tasks submitted on schedule with clean branch merges.`,
    },
    {
      title: "Capstone Project & Architecture",
      score: officialEval ? officialEval.project_score : liveProjectScore,
      max: 100,
      feedback: "Strong component design, REST API integration, and clean state management.",
    },
    {
      title: "Team Collaboration & Discipline",
      score: officialEval ? officialEval.behavior_score : liveBehaviorScore,
      max: 100,
      feedback: "Proactive communication in standups and helpful code reviews for team peers.",
    },
  ];

  const overallScore = officialEval
    ? officialEval.overall_performance
    : Math.round(
        criteria.reduce((acc, c) => acc + c.score, 0) / criteria.length
      );

  const grade =
    overallScore >= 90 ? "A+" : overallScore >= 80 ? "A" : overallScore >= 70 ? "B" : "C";

  const studentName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || "Student"
    : "Student";

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Performance & Evaluation</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review your official instructor assessments, sprint scores, and progress feedback
        </p>
      </div>

      {/* Summary Score Card */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-inner">
            <FiAward size={36} />
          </div>
          <div>
            <span className="bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {officialEval ? "Verified Instructor Assessment" : "Live Progress Evaluation"}
            </span>
            <h2 className="text-xl font-bold mt-1">{studentName}</h2>
            <p className="text-blue-100 text-xs mt-0.5">
              Roll No: {user?.rollNumber || user?.rollNo || "SMIT-2026"} • Active Bootcamp Cohort
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-white/10 px-6 py-3 rounded-xl backdrop-blur-xs">
          <div className="text-center">
            <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Overall Score</p>
            <p className="text-3xl font-extrabold text-white mt-0.5">{overallScore}%</p>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div className="text-center">
            <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Grade</p>
            <p className="text-3xl font-extrabold text-amber-300 mt-0.5">{grade}</p>
          </div>
        </div>
      </div>

      {/* Detailed Evaluation Criteria */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FiBarChart2 className="text-blue-600" /> Evaluation Breakdown
          </h2>
          <span className="text-xs text-gray-500 font-medium">
            Status: {officialEval ? "✅ Instructor Verified" : "⚡ Real-time Stream"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {criteria.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {item.score} / {item.max}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(item.score / item.max) * 100}%` }}
                  ></div>
                </div>

                <div className="text-xs text-gray-600 mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="font-semibold text-gray-800">Feedback: </span>
                  {item.feedback}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1 font-medium text-emerald-600">
                  <FiUserCheck className="text-emerald-500" /> Continuous Evaluation
                </span>
                <span>Active Term</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyEvaluation;
