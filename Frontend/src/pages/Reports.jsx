import React, { useState, useEffect } from "react";
import { FiDownload } from "react-icons/fi";
import AttendanceReport from "../components/features/Reports/AttendanceReport";
import TaskReport from "../components/features/Reports/TaskReport";
import StudentPerformance from "../components/features/Reports/StudentPerformance";
import ProjectStatus from "../components/features/Reports/ProjectStatus";
import { useReports, useTasks } from "../context/WorkContext";
import { useStudents, useAttendance, useBatches } from "../context/AcademicContext";
import { useTeamProject } from "../context/TeamProjectContext";
import { exportToCSV } from "../utils/csvHelper";
import api from "../api/axios";

function Reports() {
  const [activeTab, setActiveTab] = useState("attendance");
  const { taskDistributionData, batchPerformanceData } = useReports();
  const { tasks = [], fetchTasks } = useTasks();
  const { students = [], fetchStudents } = useStudents();
  const { batches = [], fetchBatches } = useBatches();
  const { rawAttendance = [], fetchAttendance, getStudentAttendance } = useAttendance();
  const { teams = [], projects = [], fetchTeams, fetchProjects } = useTeamProject();

  useEffect(() => {
    if (fetchStudents) fetchStudents();
    if (fetchBatches) fetchBatches();
    if (fetchAttendance) fetchAttendance();
    if (fetchTasks) fetchTasks();
    if (fetchTeams) fetchTeams();
    if (fetchProjects) fetchProjects();
  }, [fetchStudents, fetchBatches, fetchAttendance, fetchTasks, fetchTeams, fetchProjects]);

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

  const getStudentBatchName = (student) => {
    const bId = student.batchId?._id || student.batchId?.id || student.batchId || student.batch?._id || student.batch;
    const found = batches.find((b) => String(b._id || b.id) === String(bId));
    return found ? found.batchName || found.name : student.batchId?.batchName || student.batch?.batchName || "N/A";
  };

  const handleExportCSV = async () => {
    const todayStr = new Date().toISOString().split("T")[0];

    if (activeTab === "attendance") {
      let allRecords = rawAttendance;
      try {
        const res = await api.get("/attendance");
        if (res.data?.success && Array.isArray(res.data.data)) {
          allRecords = res.data.data;
        }
      } catch (e) {
        console.warn("Using context attendance cache for export:", e);
      }

      const headers = [
        "Roll No",
        "Student Name",
        "Email",
        "Phone Number",
        "Batch",
        "Attendance Date",
        "Session Status",
        "Check-In Time",
        "Check-Out Time",
        "Total Sessions",
        "Present Count",
        "Late Count",
        "Leave Count",
        "Absent Count",
        "Attendance Rate (%)",
        "Student Status",
        "Remarks",
      ];

      const rows = [];

      students.forEach((student) => {
        const sid = String(student._id || student.id || "");
        const studentName =
          student.name || `${student.firstName || ""} ${student.lastName || ""}`.trim() || student.email || "Student";
        const rollNo = student.rollNumber || student.rollNo || "N/A";
        const email = student.email || "N/A";
        const phone = student.phoneNumber || student.phone || "N/A";
        const batchName = getStudentBatchName(student);
        const studentStatus = student.status || "Active";

        const studentRecords = allRecords.filter((rec) => {
          const recStudentId = String(rec.studentId?._id || rec.studentId || rec.student || "");
          return recStudentId === sid || (rollNo !== "N/A" && rec.studentId?.rollNumber === rollNo);
        });

        studentRecords.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

        const totalSessions = studentRecords.length;
        const presentCount = studentRecords.filter((r) => r.status === "Present").length;
        const lateCount = studentRecords.filter((r) => r.status === "Late").length;
        const leaveCount = studentRecords.filter((r) => r.status === "Leave").length;
        const absentCount = studentRecords.filter((r) => r.status === "Absent").length;
        const attendanceRate =
          totalSessions > 0
            ? `${Math.round(((presentCount + lateCount) / totalSessions) * 100)}%`
            : "100%";

        if (studentRecords.length > 0) {
          studentRecords.forEach((rec) => {
            rows.push([
              rollNo,
              studentName,
              email,
              phone,
              batchName,
              rec.date || todayStr,
              rec.status || "Present",
              rec.checkInTime || "--:--",
              rec.checkOutTime || "--:--",
              totalSessions,
              presentCount,
              lateCount,
              leaveCount,
              absentCount,
              attendanceRate,
              studentStatus,
              rec.remarks || "",
            ]);
          });
        } else {
          rows.push([
            rollNo,
            studentName,
            email,
            phone,
            batchName,
            todayStr,
            "No Records",
            "--:--",
            "--:--",
            totalSessions,
            presentCount,
            lateCount,
            leaveCount,
            absentCount,
            attendanceRate,
            studentStatus,
            "No historical logs recorded yet",
          ]);
        }
      });

      exportToCSV(`smit-attendance-history-all-${todayStr}.csv`, headers, rows);
      return;
    }

    if (activeTab === "task") {
      const headers = ["Task Title", "Sprint / Milestone", "Priority", "Status", "Assigned To", "Due Date"];
      const rows = tasks.map((t) => [
        t.title || "Untitled Task",
        t.sprintId?.title || t.sprint?.title || t.milestone || "General Sprint",
        t.priority || "Medium",
        t.status || "Pending",
        t.assignedTo?.name || `${t.assignedTo?.firstName || ""} ${t.assignedTo?.lastName || ""}`.trim() || "Unassigned",
        t.dueDate ? String(t.dueDate).split("T")[0] : "No Deadline",
      ]);

      if (rows.length === 0) {
        rows.push(...taskDistributionData.map((item) => ["Distribution Metric", item.label, "N/A", item.label, "All", item.value]));
      }

      exportToCSV(`smit-task-report-${todayStr}.csv`, headers, rows);
      return;
    }

    if (activeTab === "performance") {
      const headers = [
        "Roll No",
        "Student Name",
        "Batch",
        "Attendance Rate (%)",
        "Active Status",
        "Performance Grade",
      ];
      const rows = students.map((s) => {
        const sid = String(s._id || s.id);
        const history = getStudentAttendance(sid) || [];
        const studentName = s.name || `${s.firstName || ""} ${s.lastName || ""}`.trim() || "Student";
        const rollNo = s.rollNumber || s.rollNo || "N/A";
        const batchName = getStudentBatchName(s);
        const total = history.length;
        const present = history.filter((h) => h.status === "Present" || h.status === "Late").length;
        const rate = total > 0 ? Math.round((present / total) * 100) : 95;
        const grade = rate >= 90 ? "A+" : rate >= 80 ? "A" : rate >= 70 ? "B" : "C";

        return [rollNo, studentName, batchName, `${rate}%`, s.status || "Active", grade];
      });

      exportToCSV(`smit-student-performance-${todayStr}.csv`, headers, rows);
      return;
    }

    if (activeTab === "project") {
      const headers = ["Project Name", "Batch / Team", "Status", "Start Date", "End Date"];
      const projectList = projects.length > 0 ? projects : teams;
      const rows = projectList.map((p) => [
        p.projectName || p.name || p.teamName || "Project",
        p.batchName || p.program || "Cohort 1",
        p.status || "Active",
        p.startDate ? String(p.startDate).split("T")[0] : "N/A",
        p.endDate ? String(p.endDate).split("T")[0] : "N/A",
      ]);

      exportToCSV(`smit-project-status-${todayStr}.csv`, headers, rows);
      return;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mt-2">
            System Reports & Analytics
          </h1>

          <p className="text-xs text-gray-500 mt-0.5">
            View, analyze, and export training and attendance performance reports
          </p>
        </div>

        {/* CSV Export Button */}
        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <FiDownload size={15} />
          Export CSV
        </button>
      </div>

      {/* Report Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-semibold transition cursor-pointer ${
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