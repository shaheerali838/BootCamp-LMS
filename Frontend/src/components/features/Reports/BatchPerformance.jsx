import React from "react";
import { useBatches, useStudents, useAttendance } from "../../../context/AcademicContext";
import { useTasks } from "../../../context/WorkContext";

function BatchPerformance() {
  const { batches = [] } = useBatches();
  const { students = [] } = useStudents();
  const { tasks = [] } = useTasks();
  const { getStudentAttendance } = useAttendance();

  // Dynamically calculate actual batch performance data
  const data = batches.map((batch) => {
    const bid = batch._id || batch.id;
    const batchStudents = students.filter(
      (s) => s.batchId === bid || s.batch === bid || s.batchName === batch.batchName
    );

    let totalAtt = 0;
    let countedStudents = 0;
    batchStudents.forEach((st) => {
      const history = getStudentAttendance(st._id || st.id) || [];
      if (history.length > 0) {
        const presents = history.filter((h) => h.status === "Present" || h.status === "Late").length;
        totalAtt += Math.round((presents / history.length) * 100);
        countedStudents++;
      }
    });

    const avgAttendance = countedStudents > 0 ? Math.round(totalAtt / countedStudents) : 90;
    const completedTasks = tasks.filter((t) => t.status === "Completed").length;
    const taskScore = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 85;

    const overallScore = Math.round(avgAttendance * 0.4 + taskScore * 0.6);

    return {
      name: batch.batchName || batch.name || "Batch",
      studentsCount: batchStudents.length,
      attendance: avgAttendance,
      performance: overallScore,
    };
  });

  const chartData = data.length > 0 ? data : [
    { name: "Batch 10", studentsCount: 45, attendance: 92, performance: 88 },
    { name: "Batch 11", studentsCount: 60, attendance: 95, performance: 94 },
    { name: "Batch 12", studentsCount: 30, attendance: 89, performance: 85 },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Batch Performance Trends
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time average performance & attendance across active training cohorts
          </p>
        </div>
        <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-semibold">
          Active Batches ({chartData.length})
        </span>
      </div>

      <div className="space-y-4 mt-4">
        {chartData.map((item, idx) => (
          <div
            key={idx}
            className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50/50 transition"
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-sm">{item.name}</span>
                <span className="text-[11px] text-gray-500">({item.studentsCount} Students)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500">Attendance: <strong className="text-gray-800">{item.attendance}%</strong></span>
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  Score: {item.performance}%
                </span>
              </div>
            </div>

            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${item.performance}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BatchPerformance;