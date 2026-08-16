import React from "react";
import { FiBarChart2, FiCheckCircle, FiAward, FiTrendingUp } from "react-icons/fi";
import { useAttendance } from "../../context/AttendanceContext";
import { useTasks } from "../../context/TaskContext";
import { useReports } from "../../context/ReportContext";

function Reports() {
  const { attendance } = useAttendance();
  const { tasks } = useTasks();
  const { batchPerformanceData } = useReports();

  const studentRecord = attendance.find((s) => s.rollNo === "SMIT-1001") || { attendance: [] };
  const history = studentRecord.attendance || [];
  const presentCount = history.filter((a) => a.status === "Present" || a.status === "Late").length;
  const attendanceRate = history.length > 0 ? Math.round((presentCount / history.length) * 100) : 92;

  const completedTasks = tasks.filter((t) => t.status === "Completed" || t.status === "In Review").length;
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 75;

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Student Portal</span>
          <span>›</span>
          <span className="font-semibold text-gray-800">My Reports</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Personal Performance & Evaluation</h1>
            <p className="text-sm text-gray-500 mt-1">
              Individual scorecard and monthly progress breakdown
            </p>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-medium">
            Student Scorecard
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Attendance Score</span>
            <FiCheckCircle className="text-emerald-600" size={18} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">{attendanceRate}%</h2>
          <p className="text-xs text-emerald-600 mt-1">Grade: Excellent</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Task Completion</span>
            <FiBarChart2 className="text-blue-600" size={18} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">{taskCompletionRate}%</h2>
          <p className="text-xs text-blue-600 mt-1">{completedTasks} of {tasks.length} Submitted</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Evaluation Grade</span>
            <FiAward className="text-purple-600" size={18} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">A</h2>
          <p className="text-xs text-purple-600 mt-1">Top 10% in Batch 11</p>
        </div>
      </div>

      {/* Instructor Evaluation Feedback */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <FiTrendingUp className="text-blue-600" />
          Instructor Evaluation Feedback
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm space-y-2 text-gray-700">
          <p>
            <strong>Comments by Sir Ahmed:</strong> "Ali demonstrates great problem-solving skills in React component architecture and state management. Deliverables are clean and well-structured."
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-200">
            <span>Overall Score: <strong>92/100</strong></span>
            <span>Code Quality: <strong>A+</strong></span>
            <span>Punctuality: <strong>95%</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
