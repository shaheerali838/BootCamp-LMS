import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

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
  const { accessToken } = useAuth();

  // ── Tasks ─────────────────────────────────────────────────
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState(null);

  const fetchTasks = useCallback(async () => {
    const token = accessToken || localStorage.getItem("accessToken");
    if (!token) return;

    setTasksLoading(true);
    try {
      const res = await api.get("/tasks/get-all-tasks");
      setTasks(res.data.data || []);
      setTasksError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setTasks([]);
        return;
      }
      console.error("Failed to fetch tasks:", err);
      setTasksError(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setTasksLoading(false);
    }
  }, [accessToken]);

  const addTask = async (newTask) => {
    setTasksLoading(true);
    try {
      const res = await api.post("/tasks/create-task", newTask);
      // Invalidate & refetch
      await fetchTasks();
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
      const payload = {
        ...updatedData,
        assignedStudentId: updatedData.assignedStudentId?._id || updatedData.assignedStudentId || undefined,
        assignedTeamId: updatedData.assignedTeamId?._id || updatedData.assignedTeamId || undefined,
        sprintId: updatedData.sprintId?._id || updatedData.sprintId || undefined,
        status: updatedData.status ? (updatedData.status === "In Progress" ? "in progress" : String(updatedData.status).toLowerCase()) : undefined,
        priority: updatedData.priority ? String(updatedData.priority).toLowerCase() : undefined,
      };
      Object.keys(payload).forEach((k) => (payload[k] === undefined || payload[k] === "") && delete payload[k]);

      const res = await api.put(`/tasks/update-task/${id}`, payload);
      // Invalidate & refetch
      await fetchTasks();
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
      // Invalidate & refetch
      await fetchTasks();
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

  const fetchMilestones = useCallback(async () => {
    const token = accessToken || localStorage.getItem("accessToken");
    if (!token) return;

    setMilestonesLoading(true);
    try {
      const res = await api.get("/milestones/get-all-milestones");
      setMilestones(res.data.data || []);
      setMilestonesError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setMilestones([]);
        return;
      }
      console.error("Failed to fetch milestones:", err);
      setMilestonesError(err.response?.data?.message || "Failed to fetch milestones");
    } finally {
      setMilestonesLoading(false);
    }
  }, [accessToken]);

  const addMilestone = async (newMilestone) => {
    setMilestonesLoading(true);
    try {
      const payload = {
        title: newMilestone.milestoneName || newMilestone.title || "Untitled Milestone",
        description: newMilestone.description || "",
        projectId: newMilestone.projectId || undefined,
        dueDate: newMilestone.dueDate || undefined,
        status: newMilestone.status || "Pending",
      };
      const res = await api.post("/milestones/create-milestone", payload);
      // Invalidate & refetch
      await fetchMilestones();
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
      const projId = updatedData.projectId?._id || updatedData.projectId;
      const payload = {
        title: updatedData.milestoneName || updatedData.title,
        milestoneName: updatedData.milestoneName || updatedData.title,
        description: updatedData.description,
        projectId: projId || undefined,
        dueDate: updatedData.dueDate,
        status: updatedData.status,
      };
      Object.keys(payload).forEach((k) => (payload[k] === undefined || payload[k] === "") && delete payload[k]);

      const res = await api.put(`/milestones/update-milestone/${id}`, payload);
      // Invalidate & refetch
      await fetchMilestones();
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
      // Invalidate & refetch
      await fetchMilestones();
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

  const fetchSprints = useCallback(async () => {
    const token = accessToken || localStorage.getItem("accessToken");
    if (!token) return;

    setSprintsLoading(true);
    try {
      const res = await api.get("/sprints/get-all-sprints");
      setSprints(res.data.data || []);
      setSprintsError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setSprints([]);
        return;
      }
      console.error("Failed to fetch sprints:", err);
      setSprintsError(err.response?.data?.message || "Failed to fetch sprints");
    } finally {
      setSprintsLoading(false);
    }
  }, [accessToken]);

  const addSprint = async (newSprint) => {
    setSprintsLoading(true);
    try {
      const pId = newSprint.projectId?._id || newSprint.projectId || newSprint.milestoneId?._id || newSprint.milestoneId;
      const payload = {
        name: newSprint.name || newSprint.sprintName || "Sprint",
        sprintName: newSprint.sprintName || newSprint.name || "Sprint",
        projectId: pId || undefined,
        milestoneId: newSprint.milestoneId?._id || newSprint.milestoneId || undefined,
        startDate: newSprint.startDate,
        endDate: newSprint.endDate || undefined,
        status: (newSprint.status || "active").toLowerCase(),
      };
      const res = await api.post("/sprints/create-sprint", payload);
      // Invalidate & refetch
      await fetchSprints();
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
      const pId = updatedData.projectId?._id || updatedData.projectId || updatedData.milestoneId?._id || updatedData.milestoneId;
      const payload = {
        ...updatedData,
        name: updatedData.sprintName || updatedData.name,
        sprintName: updatedData.sprintName || updatedData.name,
        projectId: pId || undefined,
        milestoneId: updatedData.milestoneId?._id || updatedData.milestoneId || undefined,
        status: updatedData.status ? String(updatedData.status).toLowerCase() : undefined,
      };
      Object.keys(payload).forEach((k) => (payload[k] === undefined || payload[k] === "") && delete payload[k]);

      const res = await api.put(`/sprints/update-sprint/${id}`, payload);
      // Invalidate & refetch
      await fetchSprints();
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
      // Invalidate & refetch
      await fetchSprints();
      setSprintsError(null);
    } catch (err) {
      console.error("Failed to delete sprint:", err);
      setSprintsError(err.response?.data?.message || "Failed to delete sprint");
      throw err;
    } finally {
      setSprintsLoading(false);
    }
  };

  // ── Evaluations ───────────────────────────────────────────
  const [evaluations, setEvaluations] = useState([]);
  const [evaluationsLoading, setEvaluationsLoading] = useState(false);
  const [evaluationsError, setEvaluationsError] = useState(null);

  const fetchEvaluations = useCallback(async () => {
    const token = accessToken || localStorage.getItem("accessToken");
    if (!token) return;

    setEvaluationsLoading(true);
    try {
      const res = await api.get("/evaluations/get-all-evaluations");
      setEvaluations(res.data.data || []);
      setEvaluationsError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setEvaluations([]);
        return;
      }
      console.error("Failed to fetch evaluations:", err);
      setEvaluationsError(err.response?.data?.message || "Failed to fetch evaluations");
    } finally {
      setEvaluationsLoading(false);
    }
  }, [accessToken]);

  const addEvaluation = async (evaluationData) => {
    setEvaluationsLoading(true);
    try {
      const res = await api.post("/evaluations/create-evaluation", evaluationData);
      // Invalidate & refetch
      await fetchEvaluations();
      setEvaluationsError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to add evaluation:", err);
      setEvaluationsError(err.response?.data?.message || "Failed to create evaluation");
      throw err;
    } finally {
      setEvaluationsLoading(false);
    }
  };

  // ── Sync with Auth State ────────────────────────────────────
  useEffect(() => {
    if (accessToken) {
      fetchTasks();
      fetchMilestones();
      fetchSprints();
      fetchEvaluations();
    } else {
      setTasks([]);
      setMilestones([]);
      setSprints([]);
      setEvaluations([]);
    }
  }, [accessToken, fetchTasks, fetchMilestones, fetchSprints, fetchEvaluations]);

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
        // Evaluations
        evaluations, evaluationsLoading, evaluationsError,
        fetchEvaluations, addEvaluation,
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

export const useEvaluations = () => {
  const { evaluations, evaluationsLoading, evaluationsError, fetchEvaluations, addEvaluation } = useWork();
  return { evaluations, loading: evaluationsLoading, error: evaluationsError, fetchEvaluations, addEvaluation };
};
export const useEvaluation = useEvaluations;

export const useReports = () => {
  const { attendanceReportData, taskDistributionData, batchPerformanceData, reportSummary } = useWork();
  return { attendanceReportData, taskDistributionData, batchPerformanceData, reportSummary };
};
export const useReport = useReports;
