import React, { useState } from "react";

import AttendanceReport from "../components/Reports/AttendanceReport";
import TaskReport from "../components/Reports/TaskReport";
import StudentPerformance from "../components/Reports/StudentPerformance";
import ProjectStatus from "../components/Reports/ProjectStatus";

function Reports() {
  const [activeTab, setActiveTab] = useState("attendance");

  const tabs = [
    {
      id: "attendance",
      label: "Attendance Report",
      component: <AttendanceReport />,
    },
    {
      id: "task",
      label: "Task Report",
      component: <TaskReport />,
    },
    {
      id: "performance",
      label: "Student Performance",
      component: <StudentPerformance />,
    },
    {
      id: "project",
      label: "Project Status",
      component: <ProjectStatus />,
    },
  ];

  const activeComponent = tabs.find(
    (tab) => tab.id === activeTab
  );

  return (
    <div className="p-5 space-y-5">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">
            Home
          </span>

          <span className="text-gray-300">
            ›
          </span>

          <span className="font-semibold text-gray-800">
            Reports
          </span>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mt-3">
          Reports
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          View and analyze your training reports
        </p>
      </div>

      {/* Report Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

        <div className="flex border-b border-gray-200">

          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-4 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}

        </div>

        {/* Active Report */}
        <div>
          {activeComponent?.component}
        </div>

      </div>

    </div>
  );
}

export default Reports;