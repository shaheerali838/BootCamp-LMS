import React, { createContext, useContext, useState, useEffect } from "react";

const ActivityLogContext = createContext();

const STORAGE_KEY = "lms_activity";

const initialActivityData = [
  {
    id: 1,
    action: "New batch created (Batch 12 - Mobile App Dev)",
    actor: "Sara Bilal (SuperAdmin)",
    timestamp: "10 mins ago",
    type: "batch",
  },
  {
    id: 2,
    action: "New student registered (Ali Hassan)",
    actor: "Sir Ahmed",
    timestamp: "1 hour ago",
    type: "student",
  },
  {
    id: 3,
    action: "New project added (Hackathon Portal)",
    actor: "Sir Bilal",
    timestamp: "3 hours ago",
    type: "project",
  },
  {
    id: 4,
    action: "Attendance report generated for Batch 11",
    actor: "System",
    timestamp: "5 hours ago",
    type: "attendance",
  },
  {
    id: 5,
    action: "Milestone status updated to Completed",
    actor: "Sir Usman",
    timestamp: "Yesterday",
    type: "milestone",
  },
];

export const ActivityLogProvider = ({ children }) => {
  const [activities, setActivities] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialActivityData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }, [activities]);

  const addActivityLog = (action, actor = "SuperAdmin", type = "system") => {
    setActivities((prev) => [
      {
        id: Date.now(),
        action,
        actor,
        timestamp: "Just now",
        type,
      },
      ...prev,
    ]);
  };

  return (
    <ActivityLogContext.Provider
      value={{
        activities,
        setActivities,
        addActivityLog,
      }}
    >
      {children}
    </ActivityLogContext.Provider>
  );
};

export const useActivityLog = () => {
  const context = useContext(ActivityLogContext);
  if (!context) {
    throw new Error("useActivityLog must be used inside ActivityLogProvider");
  }
  return context;
};
