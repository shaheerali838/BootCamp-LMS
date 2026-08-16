import React, { createContext, useContext, useState, useEffect } from "react";

const WorkContext = createContext();

const TASK_STORAGE_KEY = "lms_tasks";
const MILESTONE_STORAGE_KEY = "lms_milestones";
const SPRINT_STORAGE_KEY = "lms_sprints";
const REPORT_STORAGE_KEY = "lms_reports";

const initialTaskData = [
  {
    id: 1,
    title: "Build Student Dashboard",
    description:
      "Create the student dashboard UI with responsive design and reusable components.",
    assignedBy: "Sir Ahmed",
    assignedDate: "2026-08-10",
    dueDate: "2026-08-15",
    status: "Pending",
    submission: null,
  },
  {
    id: 2,
    title: "Attendance Management",
    description:
      "Complete the attendance management page with student status and save functionality.",
    assignedBy: "Sir Bilal",
    assignedDate: "2026-08-11",
    dueDate: "2026-08-17",
    status: "In Progress",
    submission: null,
  },
  {
    id: 3,
    title: "Reports Page",
    description:
      "Create the reports page with attendance, task reports, student performance and project status.",
    assignedBy: "Sir Ahmed",
    assignedDate: "2026-08-11",
    dueDate: "2026-08-20",
    status: "Completed",
    submission: {
      url: "https://github.com/example/reports-submission",
      notes: "Completed all reports and charts.",
      submittedAt: "2026-08-12",
    },
  },
  {
    id: 4,
    title: "Team Management",
    description:
      "Create team management functionality and display team members.",
    assignedBy: "Sir Usman",
    assignedDate: "2026-08-12",
    dueDate: "2026-08-22",
    status: "Pending",
    submission: null,
  },
];

const initialMilestoneData = [
  {
    id: 1,
    projectId: 1,
    title: "UI Wireframes & Architecture",
    dueDate: "2026-08-15",
    status: "Completed",
  },
  {
    id: 2,
    projectId: 1,
    title: "Authentication & Role Context",
    dueDate: "2026-08-20",
    status: "In Progress",
  },
  {
    id: 3,
    projectId: 2,
    title: "Database Schema Normalization",
    dueDate: "2026-08-18",
    status: "In Progress",
  },
  {
    id: 4,
    projectId: 3,
    title: "CRUD API Integration & Testing",
    dueDate: "2026-08-25",
    status: "Pending",
  },
];

const initialSprintData = [
  {
    id: 1,
    projectId: 1,
    name: "Sprint 1: Auth & Wireframes",
    startDate: "2026-08-01",
    endDate: "2026-08-14",
    status: "Completed",
  },
  {
    id: 2,
    projectId: 1,
    name: "Sprint 2: Team Dashboard & API",
    startDate: "2026-08-15",
    endDate: "2026-08-28",
    status: "Active",
  },
  {
    id: 3,
    projectId: 2,
    name: "Sprint 1: Schema Redesign",
    startDate: "2026-08-10",
    endDate: "2026-08-24",
    status: "Active",
  },
  {
    id: 4,
    projectId: 3,
    name: "Sprint 1: UI Components",
    startDate: "2026-08-05",
    endDate: "2026-08-19",
    status: "Active",
  },
];

const initialReportData = {
  attendanceReportData: [
    { day: "Mon", present: 82, absent: 8, late: 5 },
    { day: "Tue", present: 90, absent: 5, late: 7 },
    { day: "Wed", present: 87, absent: 7, late: 6 },
    { day: "Thu", present: 94, absent: 4, late: 5 },
    { day: "Fri", present: 88, absent: 6, late: 8 },
  ],
  taskDistributionData: [
    { label: "UI/UX", value: 84 },
    { label: "Web Dev", value: 72 },
    { label: "Pending", value: 48 },
  ],
  batchPerformanceData: [
    { month: "Jan", value: 82 },
    { month: "Feb", value: 96 },
    { month: "Mar", value: 112 },
    { month: "Apr", value: 135 },
    { month: "May", value: 165 },
    { month: "Jun", value: 198 },
    { month: "Jul", value: 235 },
  ],
  reportSummary: {
    taskCompleted: 84,
    lastUpdated: "Today",
  },
};

export const WorkProvider = ({ children }) => {
  // --- Task State ---
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem(TASK_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialTaskData;
  });

  useEffect(() => {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask) => {
    setTasks((prev) => [
      ...prev,
      { ...newTask, id: Date.now(), status: newTask.status || "Pending" },
    ]);
  };

  const updateTaskStatus = (id, status) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const submitDeliverable = (id, submissionData) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: "In Review",
              submission: { ...submissionData, submittedAt: new Date().toISOString().split("T")[0] },
            }
          : task
      )
    );
  };

  const updateTask = (id, updatedData) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updatedData } : task))
    );
  };

  // --- Milestone State ---
  const [milestones, setMilestones] = useState(() => {
    const stored = localStorage.getItem(MILESTONE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialMilestoneData;
  });

  useEffect(() => {
    localStorage.setItem(MILESTONE_STORAGE_KEY, JSON.stringify(milestones));
  }, [milestones]);

  const addMilestone = (newMilestone) => {
    setMilestones((prev) => [
      ...prev,
      {
        ...newMilestone,
        id: Date.now(),
        projectId: Number(newMilestone.projectId),
        status: newMilestone.status || "Pending",
      },
    ]);
  };

  const updateMilestone = (id, updatedData) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              ...updatedData,
              projectId: updatedData.projectId
                ? Number(updatedData.projectId)
                : m.projectId,
            }
          : m
      )
    );
  };

  const deleteMilestone = (id) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  // --- Sprint State ---
  const [sprints, setSprints] = useState(() => {
    const stored = localStorage.getItem(SPRINT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialSprintData;
  });

  useEffect(() => {
    localStorage.setItem(SPRINT_STORAGE_KEY, JSON.stringify(sprints));
  }, [sprints]);

  const addSprint = (newSprint) => {
    setSprints((prev) => [
      ...prev,
      {
        ...newSprint,
        id: Date.now(),
        projectId: Number(newSprint.projectId),
        status: newSprint.status || "Active",
      },
    ]);
  };

  const updateSprint = (id, updatedData) => {
    setSprints((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              ...updatedData,
              projectId: updatedData.projectId
                ? Number(updatedData.projectId)
                : s.projectId,
            }
          : s
      )
    );
  };

  const deleteSprint = (id) => {
    setSprints((prev) => prev.filter((s) => s.id !== id));
  };

  // --- Report State ---
  const [reports, setReports] = useState(() => {
    const stored = localStorage.getItem(REPORT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialReportData;
  });

  useEffect(() => {
    localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(reports));
  }, [reports]);

  return (
    <WorkContext.Provider
      value={{
        // Task slice
        tasks,
        setTasks,
        addTask,
        updateTaskStatus,
        submitDeliverable,
        updateTask,
        // Milestone slice
        milestones,
        setMilestones,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        // Sprint slice
        sprints,
        setSprints,
        addSprint,
        updateSprint,
        deleteSprint,
        // Report slice
        reports,
        setReports,
        attendanceReportData: reports.attendanceReportData || initialReportData.attendanceReportData,
        taskDistributionData: reports.taskDistributionData || initialReportData.taskDistributionData,
        batchPerformanceData: reports.batchPerformanceData || initialReportData.batchPerformanceData,
        reportSummary: reports.reportSummary || initialReportData.reportSummary,
      }}
    >
      {children}
    </WorkContext.Provider>
  );
};

export const useWork = () => {
  const context = useContext(WorkContext);
  if (!context) {
    throw new Error("useWork must be used inside WorkProvider");
  }
  return context;
};

// Thin exported compatibility wrappers
export const useTasks = () => {
  const { tasks, setTasks, addTask, updateTaskStatus, submitDeliverable, updateTask } = useWork();
  return { tasks, setTasks, addTask, updateTaskStatus, submitDeliverable, updateTask };
};

export const useTask = useTasks;

export const useMilestones = () => {
  const { milestones, setMilestones, addMilestone, updateMilestone, deleteMilestone } = useWork();
  return { milestones, setMilestones, addMilestone, updateMilestone, deleteMilestone };
};

export const useMilestone = useMilestones;

export const useSprints = () => {
  const { sprints, setSprints, addSprint, updateSprint, deleteSprint } = useWork();
  return { sprints, setSprints, addSprint, updateSprint, deleteSprint };
};

export const useSprint = useSprints;

export const useReports = () => {
  const {
    reports,
    setReports,
    attendanceReportData,
    taskDistributionData,
    batchPerformanceData,
    reportSummary,
  } = useWork();
  return { reports, setReports, attendanceReportData, taskDistributionData, batchPerformanceData, reportSummary };
};

export const useReport = useReports;
