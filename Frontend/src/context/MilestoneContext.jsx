import React, { createContext, useContext, useState, useEffect } from "react";

const MilestoneContext = createContext();

const STORAGE_KEY = "lms_milestones";

const initialMilestoneData = [
  {
    id: 1,
    projectId: 1, // Hackathon Portal
    title: "UI Wireframes & Architecture",
    dueDate: "2026-08-15",
    status: "Completed",
  },
  {
    id: 2,
    projectId: 1, // Hackathon Portal
    title: "Authentication & Role Context",
    dueDate: "2026-08-20",
    status: "In Progress",
  },
  {
    id: 3,
    projectId: 2, // LMS V2 Upgrade
    title: "Database Schema Normalization",
    dueDate: "2026-08-18",
    status: "In Progress",
  },
  {
    id: 4,
    projectId: 3, // Student Management
    title: "CRUD API Integration & Testing",
    dueDate: "2026-08-25",
    status: "Pending",
  },
];

export const MilestoneProvider = ({ children }) => {
  const [milestones, setMilestones] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialMilestoneData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(milestones));
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

  return (
    <MilestoneContext.Provider
      value={{
        milestones,
        setMilestones,
        addMilestone,
        updateMilestone,
        deleteMilestone,
      }}
    >
      {children}
    </MilestoneContext.Provider>
  );
};

export const useMilestones = () => {
  const context = useContext(MilestoneContext);
  if (!context) {
    throw new Error("useMilestones must be used inside MilestoneProvider");
  }
  return context;
};

export const useMilestone = useMilestones;
