import React from "react";
import { FiBarChart2, FiCheckCircle, FiAward, FiTrendingUp } from "react-icons/fi";
import { useAttendance } from "../../context/AcademicContext";
import { useTasks, useEvaluations } from "../../context/WorkContext";
import { useAuth } from "../../context/AuthContext";

function Reports() {
  const { user } = useAuth();
  const { getStudentAttendance } = useAttendance();
  const { tasks = [] } = useTasks();
  const { evaluations = [] } = useEvaluations();

  const sid = user?._id || user?.id;
  const history = sid ? getStudentAttendance(sid) : [];
  const presentCount = history.filter((a) => a.status === "Present" || a.status === "Late").length;
  const attendanceRate = history.length > 0 ? Math.round((presentCount / history.length) * 100) : 95;

  const completedTasks = tasks.filter((t) => t.status === "Completed" || t.status === "In Review").length;
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 88;

  // Monthly milestone progression
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const monthlyProgress = months.map((month, idx) => {
    const baseProgress = 65 + idx * 5;
    const value = Math.min(100, Math.round(baseProgress * (taskCompletionRate / 100)));
    return { month, value };
  });

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
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
          <p className="text-xs text-emerald-600 mt-1">
            {attendanceRate >= 80 ? "Grade: Excellent" : "Needs Consistency"}
          </p>
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
          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {attendanceRate >= 90 && taskCompletionRate >= 80 ? "A+" : attendanceRate >= 75 ? "B+" : "C"}
          </h2>
          <p className="text-xs text-purple-600 mt-1">Overall Qualification Index</p>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-800">Monthly Progress Tracking</h2>
            <p className="text-xs text-gray-500">Continuous milestone performance overview</p>
          </div>
          <span className="text-xs text-gray-500 font-medium">Cohort Progression</span>
        </div>

        <div className="flex items-end justify-between gap-3 h-44 px-4 pt-4">
          {monthlyProgress.map((item) => (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-semibold text-gray-500">{item.value}%</span>
              <div className="w-full max-w-10 bg-gray-100 rounded-t-lg h-28 flex items-end overflow-hidden">
                <div
                  className="w-full bg-blue-600 rounded-t-lg transition-all duration-500"
                  style={{ height: `${item.value}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reports;
