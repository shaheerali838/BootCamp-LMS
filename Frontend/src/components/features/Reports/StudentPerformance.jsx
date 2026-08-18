import React from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { useStudents, useAttendance } from "../../../context/AcademicContext";
import { useTasks, useEvaluations } from "../../../context/WorkContext";

function StudentPerformance() {
  const { students = [] } = useStudents();
  const { getStudentAttendance } = useAttendance();
  const { tasks = [] } = useTasks();
  const { evaluations = [] } = useEvaluations();

  const getStudentName = (s) =>
    s.name || `${s.firstName || ""} ${s.lastName || ""}`.trim() || s.email || "Student";

  const data = students.map((s) => {
    const sid = s._id || s.id;
    const history = getStudentAttendance(sid) || [];
    const presentCount = history.filter((a) => a.status === "Present" || a.status === "Late").length;
    const attendancePct = history.length > 0 ? Math.round((presentCount / history.length) * 100) : 0;

    // Student task completion
    const studentTasks = tasks.filter((t) => t.studentId === sid || t.assignedTo === sid || t.student === sid);
    const completedTasks = studentTasks.filter((t) => t.status === "Completed").length;
    const tasksPct = studentTasks.length > 0 ? Math.round((completedTasks / studentTasks.length) * 100) : 0;

    // Student evaluations average
    const studentEvals = evaluations.filter((e) => (e.studentId?._id || e.studentId || e.student?._id || e.student) === sid);
    const evalAvg = studentEvals.length > 0
      ? Math.round(studentEvals.reduce((acc, curr) => acc + (curr.overallScore || curr.score || 0), 0) / studentEvals.length)
      : (tasksPct > 0 ? tasksPct : attendancePct);

    const overallPerformance = Math.round((attendancePct * 0.3) + (tasksPct * 0.3) + (evalAvg * 0.4));

    return {
      id: sid,
      name: getStudentName(s),
      team: s.team || "General",
      rollNo: s.rollNo || "N/A",
      attendance: attendancePct,
      tasks: tasksPct,
      performance: overallPerformance,
    };
  });

  return (
    <div className="space-y-5 p-5">
      {/* Overview */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
        <div className="mb-5">
          <h2 className="text-base font-bold text-gray-800">
            Student Performance Scorecard
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time evaluation based on attendance consistency and task deliverables
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[650px]">
            {/* Header */}
            <div className="grid grid-cols-5 px-4 py-3 bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase rounded-t-lg">
              <span className="col-span-2">Student & Team</span>
              <span className="text-center">Attendance %</span>
              <span className="text-center">Task Score</span>
              <span className="text-right">Performance</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-100">
              {data.map((student) => {
                const isHigh = student.performance >= 80;

                return (
                  <div
                    key={student.id}
                    className="grid grid-cols-5 items-center px-4 py-3.5 hover:bg-gray-50/50 text-xs transition"
                  >
                    {/* Student */}
                    <div className="col-span-2">
                      <div className="font-bold text-gray-900">{student.name}</div>
                      <div className="text-[11px] text-gray-400">
                        {student.team} • {student.rollNo}
                      </div>
                    </div>

                    {/* Attendance */}
                    <div className="text-center font-semibold text-gray-700">
                      {student.attendance}%
                    </div>

                    {/* Tasks */}
                    <div className="text-center font-semibold text-gray-700">
                      {student.tasks}%
                    </div>

                    {/* Performance */}
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-bold text-gray-900">
                        {student.performance}%
                      </span>
                      {isHigh ? (
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                          <FiTrendingUp size={12} /> High
                        </span>
                      ) : (
                        <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                          <FiTrendingDown size={12} /> Average
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {data.length === 0 && (
                <div className="py-8 text-center text-xs text-gray-400">
                  No student records available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentPerformance;