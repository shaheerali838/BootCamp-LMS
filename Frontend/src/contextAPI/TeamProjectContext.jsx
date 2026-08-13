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
  const [teams, setTeams] = useState(() =>
    getSavedData("lms-teams", [])
  );

  const [projects, setProjects] = useState(() =>
    getSavedData("lms-projects", [])
  );

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
      description: team.description || "",
      members: team.members || [],
      createdAt: new Date().toLocaleDateString(),
    };

    setTeams((prevTeams) => [...prevTeams, newTeam]);
  };

  const updateTeam = (teamId, updatedTeam) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              ...updatedTeam,
            }
          : team
      )
    );
  };

  const deleteTeam = (teamId) => {
    setTeams((prevTeams) =>
      prevTeams.filter((team) => team.id !== teamId)
    );

    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.teamId !== teamId)
    );
  };

  const addProject = (project) => {
    const newProject = {
      id: Date.now(),
      name: project.name,
      description: project.description || "",
      teamId: Number(project.teamId),
      status: project.status || "Pending",
      createdAt: new Date().toLocaleDateString(),
    };

    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  const updateProject = (projectId, updatedProject) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              ...updatedProject,
              teamId:
                updatedProject.teamId !== undefined
                  ? Number(updatedProject.teamId)
                  : project.teamId,
            }
          : project
      )
    );
  };

  const deleteProject = (projectId) => {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== projectId)
    );
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
    return projects.filter(
      (project) => Number(project.teamId) === Number(teamId)
    );
  };

  return (
    <TeamProjectContext.Provider
      value={{
        teams,
        projects,
        addTeam,
        updateTeam,
        deleteTeam,
        addProject,
        updateProject,
        deleteProject,
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