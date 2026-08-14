import React from "react";

function ReportTabs({ activeTab, setActiveTab }) {
  const tabs = [
    "Attendance Report",
    "Task Report",
    "Student Performance",
    "Project Status",
  ];

  return (
    <div className="flex items-center border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-5 py-3 text-sm font-medium transition ${
            activeTab === tab
              ? "text-gray-900 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default ReportTabs;