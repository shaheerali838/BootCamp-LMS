import React, { createContext, useContext, useState, useEffect } from "react";

const ProjectContext = createContext();

const STORAGE_KEY = "lms_projects";

const initialProjectData = [
  {
    id: 1,
    title: "Hackathon Portal",
    category: "Batch 11",
    progress: 75,
    status: "75% Complete",
    color: "bg-blue-600",
  },
  {
    id: 2,
    title: "LMS V2 Upgrade",
    category: "Internal",
    progress: 45,
    status: "In Progress",
    color: "bg-orange-600",
  },
  {
    id: 3,
    title: "Student Management",
    category: "Batch 10",
    progress: 90,
    status: "90% Complete",
    color: "bg-green-600",
  },
  {
    id: 4,
    title: "Attendance System",
    category: "Batch 12",
    progress: 60,
    status: "60% Complete",
    color: "bg-purple-600",
  },
  {
    id: 5,
    title: "Resource Portal",
    category: "Batch 9",
    progress: 35,
    status: "In Progress",
    color: "bg-yellow-500",
  },
  {
    id: 6,
    title: "Student Dashboard",
    category: "Internal",
    progress: 80,
    status: "80% Complete",
    color: "bg-cyan-600",
  },
];

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialProjectData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const addProject = (newProject) => {
    setProjects((prev) => [...prev, { ...newProject, id: Date.now() }]);
  };

  const updateProject = (id, updatedData) => {
    setProjects((prev) =>
      prev.map((proj) => (proj.id === id ? { ...proj, ...updatedData } : proj))
    );
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        setProjects,
        addProject,
        updateProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used inside ProjectProvider");
  }
  return context;
};

export const useProject = useProjects;
