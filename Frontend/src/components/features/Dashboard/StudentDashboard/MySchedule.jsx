import React from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiClock } from "react-icons/fi";
import { useTasks, useSprints } from "../../../../context/WorkContext";
import { useAuth } from "../../../../context/AuthContext";

function MySchedule() {
  const { user } = useAuth();
  const { tasks = [] } = useTasks();
  const { sprints = [] } = useSprints();

  const sid = String(user?._id || user?.id || "");

  // Filter tasks assigned to current student
  const studentTasks = tasks.filter(
    (t) => String(t.assignedStudentId?._id || t.assignedStudentId || t.assignedStudent || "") === sid
  );

  const dotColors = ["bg-emerald-500", "bg-purple-500", "bg-blue-500", "bg-orange-500"];

  const scheduleItems = [
    ...studentTasks.slice(0, 3).map((t, idx) => ({
      id: t._id || t.id || idx,
      time: t.dueDate ? new Date(t.dueDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Today",
      title: t.title || "Task Due",
      subtitle: `${t.priority || "Normal"} Priority • ${t.status || "Pending"}`,
      dotColor: dotColors[idx % dotColors.length],
    })),
    ...sprints.slice(0, 1).map((sp, idx) => ({
      id: `sprint-${sp._id || sp.id || idx}`,
      time: sp.endDate ? new Date(sp.endDate).toLocaleDateString([], { month: "short", day: "numeric" }) : "Active",
      title: sp.sprintName || "Sprint Milestone",
      subtitle: `Sprint Status: ${sp.status || "In Progress"}`,
      dotColor: "bg-blue-600",
    })),
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-gray-900">Today's Schedule & Deadlines</h2>
        <Link
          to="/student/tasks"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          View Full
        </Link>
      </div>

      {/* Timeline */}
      {scheduleItems.length > 0 ? (
        <div className="relative space-y-6">
          {/* Vertical line behind dots */}
          <div className="absolute left-[88px] top-2 bottom-2 w-[1px] bg-gray-200" />

          {scheduleItems.map((item) => (
            <div key={item.id} className="flex items-start text-xs relative z-10">
              {/* Time */}
              <div className="w-16 font-semibold text-gray-600 shrink-0 text-right pr-3 pt-0.5">
                {item.time}
              </div>

              {/* Dot */}
              <div className="flex items-center justify-center w-5 h-5 shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full ${item.dotColor} ring-4 ring-white`} />
              </div>

              {/* Details */}
              <div className="pl-3">
                <h3 className="font-bold text-gray-900 text-sm leading-tight">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-xs mt-0.5 font-medium">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-gray-400 space-y-2">
          <FiCalendar size={26} className="mx-auto opacity-40 text-gray-300" />
          <p className="text-xs">No scheduled deadlines or task milestones for today</p>
        </div>
      )}
    </div>
  );
}

export default MySchedule;
