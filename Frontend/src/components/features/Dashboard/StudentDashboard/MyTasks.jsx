import React from "react";
import { Link } from "react-router-dom";
import { FiClipboard, FiCheckCircle } from "react-icons/fi";
import { useTasks } from "../../../../context/WorkContext";
import { useTeamProject } from "../../../../context/TeamProjectContext";
import { useAuth } from "../../../../context/AuthContext";

function MyTasks() {
  const { user } = useAuth();
  const { tasks = [] } = useTasks();
  const { teams = [] } = useTeamProject();

  const sid = String(user?._id || user?.id || "");
  const studentRoll = String(user?.rollNumber || user?.rollNo || "").toLowerCase();
  const studentName = String(
    user?.firstName ? `${user.firstName} ${user.lastName || ""}` : user?.name || ""
  ).trim().toLowerCase();

  // Find student teams
  const studentTeams = teams.filter((team) => {
    if (!sid && !studentRoll && !studentName) return false;
    const leadId = String(team.teamLead?._id || team.teamLead || team.lead || "");
    const leadName = String(team.teamLead?.name || team.teamLead?.firstName ? `${team.teamLead.firstName} ${team.teamLead.lastName || ""}` : team.lead || "").toLowerCase();
    if (leadId && leadId === sid) return true;
    if (leadName && studentName && leadName.includes(studentName)) return true;

    if (Array.isArray(team.members)) {
      return team.members.some((m) => {
        const mId = String(m._id || m.id || m.studentId || m);
        const mRoll = String(m.rollNumber || m.rollNo || "").toLowerCase();
        const mName = String(m.name || m.firstName ? `${m.firstName} ${m.lastName || ""}` : m).toLowerCase();
        return (
          (sid && mId === sid) ||
          (studentRoll && mRoll === studentRoll) ||
          (studentName && mName && (mName === studentName || mName.includes(studentName)))
        );
      });
    }
    return false;
  });

  const studentTeamIds = new Set(studentTeams.map((t) => String(t._id || t.id)));

  const studentTasks = tasks.filter((t) => {
    const assignStudent = String(t.assignedStudentId?._id || t.assignedStudentId || t.assignedStudent || "");
    const assignTeam = String(t.assignedTeamId?._id || t.assignedTeamId || t.assignedTeam || "");
    return (assignStudent && assignStudent === sid) || (assignTeam && studentTeamIds.has(assignTeam));
  });

  const getDotColor = (index) => {
    const colors = ["bg-purple-500", "bg-blue-500", "bg-amber-500", "bg-emerald-500"];
    return colors[index % colors.length];
  };

  const getBadgeStyle = (status) => {
    if (status === "Completed") {
      return "bg-emerald-50 text-emerald-600 border border-emerald-100";
    }
    if (status === "In Progress" || status === "In Review") {
      return "bg-orange-50 text-orange-600 border border-orange-100";
    }
    return "bg-gray-100 text-gray-600 border border-gray-200";
  };

  const displayTasks = studentTasks.slice(0, 4);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-gray-900">My Tasks</h2>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
              {studentTasks.length}
            </span>
          </div>
          <Link
            to="/student/tasks"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            View All
          </Link>
        </div>

        {/* List */}
        {displayTasks.length > 0 ? (
          <div className="space-y-3">
            {displayTasks.map((task, idx) => (
              <div key={task._id || task.id || idx} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-2 h-2 rounded-full ${getDotColor(idx)} shrink-0`} />
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-gray-900 truncate leading-tight">
                      {task.title || "Untitled Task"}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                      Due: {task.dueDate || "Ongoing sprint"}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getBadgeStyle(
                    task.status || "Pending"
                  )}`}
                >
                  {task.status || "Pending"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-gray-400 space-y-1">
            <FiClipboard size={22} className="mx-auto opacity-50 text-gray-300" />
            <p className="text-xs">No tasks currently assigned</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTasks;
