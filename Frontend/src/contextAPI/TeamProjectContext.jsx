import React, { createContext, useContext, useEffect, useState } from "react";

const TeamProjectContext = createContext();

const getSavedData = (key, fallback) => {
  if (typeof window === "undefined") return fallback;

  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage:`, error);
    return fallback;
  }
};

export const TeamProjectProvider = ({ children }) => {
  const [teams, setTeams] = useState(() => getSavedData("lms-teams", []));
  const [projects, setProjects] = useState(() => getSavedData("lms-projects", []));

  useEffect(() => {
    window.localStorage.setItem("lms-teams", JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    window.localStorage.setItem("lms-projects", JSON.stringify(projects));
  }, [projects]);

  const addTeam = (team) => {
    const newTeam = {
      id: Date.now(),
      name: team.name,
      lead: team.lead || "",
      description: team.description,
      members: team.members || [],
      createdAt: new Date().toLocaleDateString(),
    };

    setTeams((prevTeams) => [...prevTeams, newTeam]);
  };

  const addProject = (project) => {
    const newProject = {
      id: Date.now(),
      name: project.name,
      description: project.description,
      teamId: project.teamId,
      status: project.status || "Pending",
      createdAt: new Date().toLocaleDateString(),
    };

    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  const updateProjectStatus = (projectId, status) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? { ...project, status }
          : project
      )
    );
  };

  const getTeamProjects = (teamId) => {
    return projects.filter((project) => project.teamId === teamId);
  };

  return (
    <TeamProjectContext.Provider
      value={{
        teams,
        projects,
        addTeam,
        addProject,
        updateProjectStatus,
        getTeamProjects,
      }}
    >
      {children}
    </TeamProjectContext.Provider>
  );
};

export const useTeamProject = () => {
  return useContext(TeamProjectContext);
};