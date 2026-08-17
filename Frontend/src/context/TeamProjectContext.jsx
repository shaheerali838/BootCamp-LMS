import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const TeamProjectContext = createContext();

export const TeamProjectProvider = ({ children }) => {
  // ── Teams ─────────────────────────────────────────────────
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [teamsError, setTeamsError] = useState(null);

  const fetchTeams = async () => {
    const token = localStorage.getItem("accessToken");
    const isAuth = typeof window !== "undefined" && (window.location.pathname === "/login" || window.location.pathname.startsWith("/auth") || window.location.pathname === "/forgot-password");
    if (!token || isAuth) return;

    setTeamsLoading(true);
    try {
      const res = await api.get("/teams/get-all-teams");
      setTeams(res.data.data || []);
      setTeamsError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setTeams([]);
        return;
      }
      console.error("Failed to fetch teams:", err);
      setTeamsError(err.response?.data?.message || "Failed to fetch teams");
    } finally {
      setTeamsLoading(false);
    }
  };

  const addTeam = async (team) => {
    setTeamsLoading(true);
    try {
      const payload = {
        teamName: team.teamName || team.name,
        batchId: team.batchId || team.batch,
        mentor: team.mentor || team.mentorId,
        teamLead: team.teamLead || team.lead || team.teamLeadId,
        status: team.status || "active",
      };
      const res = await api.post("/teams/create-team", payload);
      if (res.data.success) {
        setTeams((prev) => [res.data.data, ...prev]);
      }
      setTeamsError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to add team:", err);
      setTeamsError(err.response?.data?.message || "Failed to create team");
      throw err;
    } finally {
      setTeamsLoading(false);
    }
  };

  const updateTeam = async (id, updatedTeam) => {
    setTeamsLoading(true);
    try {
      const payload = {
        teamName: updatedTeam.teamName || updatedTeam.name,
        batchId: updatedTeam.batchId || updatedTeam.batch,
        mentor: updatedTeam.mentor || updatedTeam.mentorId,
        teamLead: updatedTeam.teamLead || updatedTeam.lead,
        status: updatedTeam.status || "active",
      };
      const res = await api.put(`/teams/update-team/${id}`, payload);
      if (res.data.success) {
        setTeams((prev) =>
          prev.map((t) => (t._id === id ? res.data.data : t))
        );
      }
      setTeamsError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to update team:", err);
      setTeamsError(err.response?.data?.message || "Failed to update team");
      throw err;
    } finally {
      setTeamsLoading(false);
    }
  };

  const deleteTeam = async (id) => {
    setTeamsLoading(true);
    try {
      await api.delete(`/teams/delete-team/${id}`);
      setTeams((prev) => prev.filter((t) => t._id !== id));
      setTeamsError(null);
    } catch (err) {
      console.error("Failed to delete team:", err);
      setTeamsError(err.response?.data?.message || "Failed to delete team");
      throw err;
    } finally {
      setTeamsLoading(false);
    }
  };

  // ── Projects ──────────────────────────────────────────────
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState(null);

  const fetchProjects = async () => {
    const token = localStorage.getItem("accessToken");
    const isAuth = typeof window !== "undefined" && (window.location.pathname === "/login" || window.location.pathname.startsWith("/auth") || window.location.pathname === "/forgot-password");
    if (!token || isAuth) return;

    setProjectsLoading(true);
    try {
      const res = await api.get("/projects/get-all-projects");
      setProjects(res.data.data || []);
      setProjectsError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setProjects([]);
        return;
      }
      console.error("Failed to fetch projects:", err);
      setProjectsError(err.response?.data?.message || "Failed to fetch projects");
    } finally {
      setProjectsLoading(false);
    }
  };

  const addProject = async (project) => {
    setProjectsLoading(true);
    try {
      const payload = {
        name: project.name || project.projectName || "Untitled Project",
        description: project.description || "",
        startDate: project.startDate || undefined,
        deadline: project.deadline || undefined,
        batchId: project.batchId || project.batch || undefined,
        status: project.status || "Pending",
      };
      const res = await api.post("/projects/create-project", payload);
      if (res.data.success) {
        setProjects((prev) => [res.data.data, ...prev]);
      }
      setProjectsError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to add project:", err);
      setProjectsError(err.response?.data?.message || "Failed to create project");
      throw err;
    } finally {
      setProjectsLoading(false);
    }
  };

  const updateProject = async (id, updatedProject) => {
    setProjectsLoading(true);
    try {
      const res = await api.put(`/projects/update-project/${id}`, updatedProject);
      if (res.data.success) {
        setProjects((prev) =>
          prev.map((p) => (p._id === id ? res.data.data : p))
        );
      }
      setProjectsError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to update project:", err);
      setProjectsError(err.response?.data?.message || "Failed to update project");
      throw err;
    } finally {
      setProjectsLoading(false);
    }
  };

  const updateProjectStatus = async (id, status) => {
    return updateProject(id, { status });
  };

  const deleteProject = async (id) => {
    setProjectsLoading(true);
    try {
      await api.delete(`/projects/delete-project/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      setProjectsError(null);
    } catch (err) {
      console.error("Failed to delete project:", err);
      setProjectsError(err.response?.data?.message || "Failed to delete project");
      throw err;
    } finally {
      setProjectsLoading(false);
    }
  };

  const getTeamProjects = (teamId) =>
    projects.filter((p) => String(p.teamId) === String(teamId));

  // ── Bootstrap ─────────────────────────────────────────────
  useEffect(() => {
    fetchTeams();
    fetchProjects();
  }, []);

  return (
    <TeamProjectContext.Provider
      value={{
        // Teams
        teams,
        teamsLoading,
        teamsError,
        fetchTeams,
        addTeam,
        updateTeam,
        deleteTeam,

        // Projects
        projects,
        projectsLoading,
        projectsError,
        fetchProjects,
        addProject,
        updateProject,
        updateProjectStatus,
        deleteProject,
        getTeamProjects,
      }}
    >
      {children}
    </TeamProjectContext.Provider>
  );
};

export const useTeamProject = () => useContext(TeamProjectContext);