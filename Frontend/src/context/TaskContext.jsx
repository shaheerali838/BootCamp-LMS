import React, { createContext, useContext, useState, useEffect } from "react";

const TaskContext = createContext();

const STORAGE_KEY = "lms_tasks";

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

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialTaskData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
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

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        addTask,
        updateTaskStatus,
        submitDeliverable,
        updateTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used inside TaskProvider");
  }
  return context;
};

export const useTask = useTasks;
