import React from "react";
import { FiBarChart2, FiPieChart, FiTrendingUp } from "react-icons/fi";
import { useReports } from "../../context/ReportContext";
import BatchPerformance from "../../components/features/Reports/BatchPerformance";
import TaskDistribution from "../../components/features/Reports/TaskDistribution";

function Reports() {
  const { reportSummary } = useReports();

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
       
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiBarChart2 className="text-purple-600" />
              System Analytics & Reports
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Comprehensive system-wide performance reports and batch trends
            </p>
          </div>
          <span className="text-xs bg-purple-50 text-purple-700 font-semibold px-3 py-1.5 rounded-full border border-purple-200">
            System-Wide Data
          </span>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">Tasks Completed</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">{reportSummary.taskCompleted}%</h2>
          <p className="text-xs text-emerald-600 font-medium mt-1">+12% vs last month</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">Batch Pass Rate</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">94%</h2>
          <p className="text-xs text-blue-600 font-medium mt-1">High qualification index</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">Last Updated</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">{reportSummary.lastUpdated}</h2>
          <p className="text-xs text-purple-600 font-medium mt-1">Live data stream</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BatchPerformance />
        </div>
        <div>
          <TaskDistribution />
        </div>
      </div>
    </div>
  );
}

export default Reports;
