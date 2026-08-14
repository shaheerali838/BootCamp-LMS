import React, { useState } from "react";
import { FiDownload } from "react-icons/fi";
import AttendanceReport from "../components/Reports/AttendanceReport";
import TaskReport from "../components/Reports/TaskReport";
import StudentPerformance from "../components/Reports/StudentPerformance";
import ProjectStatus from "../components/Reports/ProjectStatus";
import { useReports } from "../context/ReportContext";

function Reports() {
  const [activeTab, setActiveTab] = useState("attendance");
  const { attendanceReportData, taskDistributionData, batchPerformanceData } = useReports();

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

  const activeComponent = tabs.find((tab) => tab.id === activeTab);

  const handleExportCSV = () => {
    let headers = [];
    let rows = [];

    if (activeTab === "attendance") {
      headers = ["Day", "Present", "Absent", "Late"];
      rows = attendanceReportData.map((item) => [
        item.day,
        item.present,
        item.absent,
        item.late,
      ]);
    } else if (activeTab === "task") {
      headers = ["Category / Label", "Value"];
      rows = taskDistributionData.map((item) => [item.label, item.value]);
    } else {
      headers = ["Period / Category", "Performance Index"];
      rows = batchPerformanceData.map((item) => [item.month, item.value]);
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    const todayStr = new Date().toISOString().split("T")[0];

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smit-report-${activeTab}-${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Home</span>
            <span>›</span>
            <span className="font-semibold text-gray-800">Reports</span>
          </div>

          <h1 className="text-xl font-semibold text-gray-900 mt-2">
            System Reports & Analytics
          </h1>

          <p className="text-xs text-gray-500 mt-0.5">
            View and analyze your training performance reports
          </p>
        </div>

        {/* CSV Export Button */}
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
        >
          <FiDownload size={15} />
          Export CSV
        </button>
      </div>

      {/* Report Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-semibold transition ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Report */}
        <div>{activeComponent?.component}</div>
      </div>
    </div>
  );
}

export default Reports;