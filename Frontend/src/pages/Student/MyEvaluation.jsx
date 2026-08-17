import React from "react";
import { FiAward, FiStar, FiCheckCircle, FiBarChart2, FiUserCheck } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

function MyEvaluation() {
  const { user } = useAuth();

  // Mock student evaluation metrics for live UI display
  const criteria = [
    { title: "Code Quality & Architecture", score: 92, max: 100, feedback: "Clean code structure, well-organized modular components." },
    { title: "Sprint & Task Delivery", score: 88, max: 100, feedback: "On-time submissions for all milestones." },
    { title: "Team Collaboration & Git Flow", score: 95, max: 100, feedback: "Excellent PR reviews and constructive commit messages." },
    { title: "Attendance & Punctuality", score: 90, max: 100, feedback: "Consistent attendance in mentor sessions." },
  ];

  const overallScore = Math.round(
    criteria.reduce((acc, c) => acc + (c.score / c.max) * 100, 0) / criteria.length
  );

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Performance & Evaluation</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review your instructor assessments, sprint scores, and progress feedback
        </p>
      </div>

      {/* Summary Score Card */}
      <div className="bg-linear-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300">
            <FiAward size={36} />
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Student Evaluation"}
            </h2>
            <p className="text-blue-100 text-xs mt-0.5">
              Saylani Tech Bootcamp • Batch 11
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-white/10 px-6 py-3 rounded-xl backdrop-blur-xs">
          <div className="text-center">
            <p className="text-xs text-blue-200 uppercase tracking-wider">Overall Score</p>
            <p className="text-3xl font-extrabold text-white mt-0.5">{overallScore}%</p>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div className="text-center">
            <p className="text-xs text-blue-200 uppercase tracking-wider">Grade</p>
            <p className="text-3xl font-extrabold text-amber-300 mt-0.5">
              {overallScore >= 90 ? "A+" : overallScore >= 80 ? "A" : "B"}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Evaluation Criteria */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FiBarChart2 className="text-blue-600" /> Evaluation Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {criteria.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                  <span className="text-xs font-bold text-blue-600">
                    {item.score} / {item.max}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(item.score / item.max) * 100}%` }}
                  ></div>
                </div>

                <p className="text-xs text-gray-600 mt-3 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="font-semibold text-gray-800">Instructor Feedback: </span>
                  {item.feedback}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <FiUserCheck className="text-emerald-500" /> Verified by Mentor
                </span>
                <span>Term 1</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyEvaluation;
