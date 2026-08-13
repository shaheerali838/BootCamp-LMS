import React, { createContext, useContext, useState, useEffect } from "react";

const SprintContext = createContext();

const STORAGE_KEY = "lms_sprints";

const initialSprintData = [
  {
    id: 1,
    projectId: 1, // Hackathon Portal
    name: "Sprint 1: Auth & Wireframes",
    startDate: "2026-08-01",
    endDate: "2026-08-14",
    status: "Completed",
  },
  {
    id: 2,
    projectId: 1, // Hackathon Portal
    name: "Sprint 2: Team Dashboard & API",
    startDate: "2026-08-15",
    endDate: "2026-08-28",
    status: "Active",
  },
  {
    id: 3,
    projectId: 2, // LMS V2 Upgrade
    name: "Sprint 1: Schema Redesign",
    startDate: "2026-08-10",
    endDate: "2026-08-24",
    status: "Active",
  },
  {
    id: 4,
    projectId: 3, // Student Management
    name: "Sprint 1: UI Components",
    startDate: "2026-08-05",
    endDate: "2026-08-19",
    status: "Active",
  },
];

export const SprintProvider = ({ children }) => {
  const [sprints, setSprints] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialSprintData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sprints));
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

  return (
    <SprintContext.Provider
      value={{
        sprints,
        setSprints,
        addSprint,
        updateSprint,
        deleteSprint,
      }}
    >
      {children}
    </SprintContext.Provider>
  );
};

export const useSprints = () => {
  const context = useContext(SprintContext);
  if (!context) {
    throw new Error("useSprints must be used inside SprintProvider");
  }
  return context;
};

export const useSprint = useSprints;
