import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const WorkContext = createContext();

// ── Static report data (no backend route) ─────────────────
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
  reportSummary: { taskCompleted: 84, lastUpdated: "Today" },
};

export const WorkProvider = ({ children }) => {
  // ── Tasks ─────────────────────────────────────────────────
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState(null);

  const fetchTasks = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    setTasksLoading(true);
    try {
      const res = await api.get("/tasks/get-all-tasks");
      setTasks(res.data.data || []);
      setTasksError(null);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setTasksError(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setTasksLoading(false);
    }
  };

  const addTask = async (newTask) => {
    setTasksLoading(true);
    try {
      const res = await api.post("/tasks/create-task", newTask);
      if (res.data.success) setTasks((prev) => [res.data.data, ...prev]);
      setTasksError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to add task:", err);
      setTasksError(err.response?.data?.message || "Failed to create task");
      throw err;
    } finally {
      setTasksLoading(false);
    }
  };

  const updateTask = async (id, updatedData) => {
    setTasksLoading(true);
    try {
      const res = await api.put(`/tasks/update-task/${id}`, updatedData);
      if (res.data.success) {
        setTasks((prev) => prev.map((t) => (t._id === id ? res.data.data : t)));
      }
      setTasksError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to update task:", err);
      setTasksError(err.response?.data?.message || "Failed to update task");
      throw err;
    } finally {
      setTasksLoading(false);
    }
  };

  const updateTaskStatus = (id, status) => updateTask(id, { status });

  const deleteTask = async (id) => {
    setTasksLoading(true);
    try {
      await api.delete(`/tasks/delete-task/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      setTasksError(null);
    } catch (err) {
      console.error("Failed to delete task:", err);
      setTasksError(err.response?.data?.message || "Failed to delete task");
      throw err;
    } finally {
      setTasksLoading(false);
    }
  };

  const submitDeliverable = async (id, submissionData) => {
    return updateTask(id, {
      status: "In Review",
      submission: { ...submissionData, submittedAt: new Date().toISOString().split("T")[0] },
    });
  };

  // ── Milestones ────────────────────────────────────────────
  const [milestones, setMilestones] = useState([]);
  const [milestonesLoading, setMilestonesLoading] = useState(false);
  const [milestonesError, setMilestonesError] = useState(null);

  const fetchMilestones = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    setMilestonesLoading(true);
    try {
      const res = await api.get("/milestones/get-all-milestones");
      setMilestones(res.data.data || []);
      setMilestonesError(null);
    } catch (err) {
      console.error("Failed to fetch milestones:", err);
      setMilestonesError(err.response?.data?.message || "Failed to fetch milestones");
    } finally {
      setMilestonesLoading(false);
    }
  };

  const addMilestone = async (newMilestone) => {
    setMilestonesLoading(true);
    try {
      const payload = {
        title: newMilestone.title,
        projectId: newMilestone.projectId,
        dueDate: newMilestone.dueDate,
        status: newMilestone.status || "Pending",
      };
      const res = await api.post("/milestones/create-milestone", payload);
      if (res.data.success) setMilestones((prev) => [res.data.data, ...prev]);
      setMilestonesError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to add milestone:", err);
      setMilestonesError(err.response?.data?.message || "Failed to create milestone");
      throw err;
    } finally {
      setMilestonesLoading(false);
    }
  };

  const updateMilestone = async (id, updatedData) => {
    setMilestonesLoading(true);
    try {
      const res = await api.put(`/milestones/update-milestone/${id}`, updatedData);
      if (res.data.success) {
        setMilestones((prev) => prev.map((m) => (m._id === id ? res.data.data : m)));
      }
      setMilestonesError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to update milestone:", err);
      setMilestonesError(err.response?.data?.message || "Failed to update milestone");
      throw err;
    } finally {
      setMilestonesLoading(false);
    }
  };

  const deleteMilestone = async (id) => {
    setMilestonesLoading(true);
    try {
      await api.delete(`/milestones/delete-milestone/${id}`);
      setMilestones((prev) => prev.filter((m) => m._id !== id));
      setMilestonesError(null);
    } catch (err) {
      console.error("Failed to delete milestone:", err);
      setMilestonesError(err.response?.data?.message || "Failed to delete milestone");
      throw err;
    } finally {
      setMilestonesLoading(false);
    }
  };

  // ── Sprints ───────────────────────────────────────────────
  const [sprints, setSprints] = useState([]);
  const [sprintsLoading, setSprintsLoading] = useState(false);
  const [sprintsError, setSprintsError] = useState(null);

  const fetchSprints = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    setSprintsLoading(true);
    try {
      const res = await api.get("/sprints/get-all-sprints");
      setSprints(res.data.data || []);
      setSprintsError(null);
    } catch (err) {
      console.error("Failed to fetch sprints:", err);
      setSprintsError(err.response?.data?.message || "Failed to fetch sprints");
    } finally {
      setSprintsLoading(false);
    }
  };

  const addSprint = async (newSprint) => {
    setSprintsLoading(true);
    try {
      const payload = {
        name: newSprint.name,
        projectId: newSprint.projectId,
        startDate: newSprint.startDate,
        endDate: newSprint.endDate || undefined,
        status: newSprint.status || "Active",
      };
      const res = await api.post("/sprints/create-sprint", payload);
      if (res.data.success) setSprints((prev) => [res.data.data, ...prev]);
      setSprintsError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to add sprint:", err);
      setSprintsError(err.response?.data?.message || "Failed to create sprint");
      throw err;
    } finally {
      setSprintsLoading(false);
    }
  };

  const updateSprint = async (id, updatedData) => {
    setSprintsLoading(true);
    try {
      const res = await api.put(`/sprints/update-sprint/${id}`, updatedData);
      if (res.data.success) {
        setSprints((prev) => prev.map((s) => (s._id === id ? res.data.data : s)));
      }
      setSprintsError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to update sprint:", err);
      setSprintsError(err.response?.data?.message || "Failed to update sprint");
      throw err;
    } finally {
      setSprintsLoading(false);
    }
  };

  const deleteSprint = async (id) => {
    setSprintsLoading(true);
    try {
      await api.delete(`/sprints/delete-sprint/${id}`);
      setSprints((prev) => prev.filter((s) => s._id !== id));
      setSprintsError(null);
    } catch (err) {
      console.error("Failed to delete sprint:", err);
      setSprintsError(err.response?.data?.message || "Failed to delete sprint");
      throw err;
    } finally {
      setSprintsLoading(false);
    }
  };

  // ── Bootstrap ─────────────────────────────────────────────
  useEffect(() => {
    fetchTasks();
    fetchMilestones();
    fetchSprints();
  }, []);

  // ── Dynamic Reports Calculations ─────────────────────────
  const completedTasksCount = tasks.filter(
    (t) => t.status === "Completed" || t.status === "In Review"
  ).length;
  const taskCompletionPercentage =
    tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  const lowPriorityTasks = tasks.filter((t) => t.priority === "Low").length;
  const mediumPriorityTasks = tasks.filter((t) => t.priority === "Medium").length;
  const highPriorityTasks = tasks.filter((t) => t.priority === "High").length;
  const pendingTasks = tasks.filter(
    (t) => t.status === "Pending" || t.status === "In Progress"
  ).length;

  const dynamicTaskDistributionData = [
    { label: "Completed", value: completedTasksCount },
    { label: "In Progress / Pending", value: pendingTasks },
    { label: "High Priority", value: highPriorityTasks },
    { label: "Med Priority", value: mediumPriorityTasks },
  ].filter((item) => item.value > 0);

  const taskDistributionData =
    dynamicTaskDistributionData.length > 0
      ? dynamicTaskDistributionData
      : initialReportData.taskDistributionData;

  const reportSummary = {
    taskCompleted: taskCompletionPercentage,
    lastUpdated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  };

  return (
    <WorkContext.Provider
      value={{
        // Tasks
        tasks, tasksLoading, tasksError,
        fetchTasks, addTask, updateTask, updateTaskStatus, deleteTask, submitDeliverable,
        // Milestones
        milestones, milestonesLoading, milestonesError,
        fetchMilestones, addMilestone, updateMilestone, deleteMilestone,
        // Sprints
        sprints, sprintsLoading, sprintsError,
        fetchSprints, addSprint, updateSprint, deleteSprint,
        // Reports
        attendanceReportData: initialReportData.attendanceReportData,
        taskDistributionData,
        batchPerformanceData: initialReportData.batchPerformanceData,
        reportSummary,
      }}
    >
      {children}
    </WorkContext.Provider>
  );
};

export const useWork = () => {
  const context = useContext(WorkContext);
  if (!context) throw new Error("useWork must be used inside WorkProvider");
  return context;
};

// ── Thin compatibility wrappers ───────────────────────────
export const useTasks = () => {
  const { tasks, tasksLoading, tasksError, fetchTasks, addTask, updateTask, updateTaskStatus, deleteTask, submitDeliverable } = useWork();
  return { tasks, loading: tasksLoading, error: tasksError, fetchTasks, addTask, updateTask, updateTaskStatus, deleteTask, submitDeliverable };
};
export const useTask = useTasks;

export const useMilestones = () => {
  const { milestones, milestonesLoading, milestonesError, fetchMilestones, addMilestone, updateMilestone, deleteMilestone } = useWork();
  return { milestones, loading: milestonesLoading, error: milestonesError, fetchMilestones, addMilestone, updateMilestone, deleteMilestone };
};
export const useMilestone = useMilestones;

export const useSprints = () => {
  const { sprints, sprintsLoading, sprintsError, fetchSprints, addSprint, updateSprint, deleteSprint } = useWork();
  return { sprints, loading: sprintsLoading, error: sprintsError, fetchSprints, addSprint, updateSprint, deleteSprint };
};
export const useSprint = useSprints;

export const useReports = () => {
  const { attendanceReportData, taskDistributionData, batchPerformanceData, reportSummary } = useWork();
  return { attendanceReportData, taskDistributionData, batchPerformanceData, reportSummary };
};
export const useReport = useReports;
