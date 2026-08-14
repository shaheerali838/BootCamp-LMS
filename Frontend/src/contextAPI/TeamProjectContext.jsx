import React, { createContext, useContext, useState, useEffect } from "react";

const TeamProjectContext = createContext();

const STORAGE_TEAMS = "lms-teams";
const STORAGE_PROJECTS = "lms-projects";

const loadFromStorage = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
        console.error(`Failed to load ${key} from localStorage:`, e);
        return fallback;
    }
};

export const TeamProjectProvider = ({ children }) => {
    const [teams, setTeams] = useState(() => loadFromStorage(STORAGE_TEAMS, []));
    const [projects, setProjects] = useState(() => loadFromStorage(STORAGE_PROJECTS, []));

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_TEAMS, JSON.stringify(teams));
        } catch (e) {
            console.error("Failed to save teams to localStorage:", e);
        }
    }, [teams]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_PROJECTS, JSON.stringify(projects));
        } catch (e) {
            console.error("Failed to save projects to localStorage:", e);
        }
    }, [projects]);

    // Add Team
    const addTeam = (team) => {
        const newTeam = {
            id: Date.now(),
            name: team.name,
            lead: team.lead || "",
            description: team.description || "",
            members: team.members || [],
            createdAt: new Date().toLocaleDateString(),
        };

        setTeams((prev) => [...prev, newTeam]);
    };

    // Update Team
    const updateTeam = (id, updatedTeam) => {
        setTeams((prev) =>
            prev.map((team) => (team.id === id ? { ...team, ...updatedTeam } : team))
        );
    };

    // Delete Team
    const deleteTeam = (id) => {
        setTeams((prev) => prev.filter((team) => team.id !== id));

        // Delete projects belonging to this team
        setProjects((prev) => prev.filter((project) => String(project.teamId) !== String(id)));
    };

    // Add Project
    const addProject = (project) => {
        // Accept both `projectName` (form) and `name` (internal) and `batch`/`teamId`
        const teamId = project.teamId ?? project.batch ?? project.team ?? null;

        const newProject = {
            id: Date.now(),
            name: project.name || project.projectName || "Untitled Project",
            projectName: project.projectName || project.name || "",
            description: project.description || "",
            startDate: project.startDate || null,
            deadline: project.deadline || null,
            teamId: teamId !== null ? teamId : null,
            status: project.status || "Pending",
            createdAt: new Date().toLocaleDateString(),
        };

        setProjects((prev) => [...prev, newProject]);
    };

    // Update Project
    const updateProject = (id, updatedProject) => {
        setProjects((prev) =>
            prev.map((project) =>
                project.id === id
                    ? {
                          ...project,
                          ...updatedProject,
                          teamId:
                              updatedProject.teamId !== undefined
                                  ? updatedProject.teamId
                                  : project.teamId,
                      }
                    : project
            )
        );
    };

    // Update only the status of a project
    const updateProjectStatus = (id, status) => {
        setProjects((prev) =>
            prev.map((project) =>
                project.id === id ? { ...project, status } : project
            )
        );
    };

    // Delete Project
    const deleteProject = (id) => {
        setProjects(
            projects.filter(
                (project) => project.id !== id
            )
        );
    };

    // Get projects of a team
    const getTeamProjects = (teamId) => {
        return projects.filter(
            (project) =>
                Number(project.teamId) === Number(teamId)
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

                getTeamProjects,
                updateProjectStatus,
            }}
        >
            {children}
        </TeamProjectContext.Provider>
    );
};

export const useTeamProject = () => {
    return useContext(TeamProjectContext);
};