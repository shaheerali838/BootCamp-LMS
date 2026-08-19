import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const TeamProjectContext = createContext();

export const TeamProjectProvider = ({ children }) => {
  const { accessToken } = useAuth();

  // ── Teams ─────────────────────────────────────────────────
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [teamsError, setTeamsError] = useState(null);

  const fetchTeams = useCallback(async () => {
    const token = accessToken || localStorage.getItem("accessToken");
    if (!token) return;

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
  }, [accessToken]);

  const addTeam = async (team) => {
    setTeamsLoading(true);
    try {
      const payload = {
        teamName: team.teamName || team.name,
        batchId: team.batchId || team.batch,
        mentor: team.mentor || team.mentorId,
        teamLead: team.teamLead || team.lead || team.teamLeadId,
        members: Array.isArray(team.members)
          ? team.members.map((m) => m?._id || m?.id || m)
          : [],
        status: team.status || "active",
      };
      const res = await api.post("/teams/create-team", payload);
      // Invalidate & refetch authoritative list
      await fetchTeams();
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
        batchId: updatedTeam.batchId?._id || updatedTeam.batchId || updatedTeam.batch?._id || updatedTeam.batch,
        mentor: updatedTeam.mentor?._id || updatedTeam.mentor || updatedTeam.mentorId?._id || updatedTeam.mentorId,
        teamLead: updatedTeam.teamLead?._id || updatedTeam.teamLead || updatedTeam.lead?._id || updatedTeam.lead,
        members: Array.isArray(updatedTeam.members)
          ? updatedTeam.members.map((m) => m?._id || m?.id || m)
          : undefined,
        status: updatedTeam.status || "active",
      };
      Object.keys(payload).forEach((k) => (payload[k] === undefined || payload[k] === "") && delete payload[k]);

      const res = await api.put(`/teams/update-team/${id}`, payload);
      // Invalidate & refetch authoritative list
      await fetchTeams();
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
      // Invalidate & refetch authoritative list
      await fetchTeams();
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

  const fetchProjects = useCallback(async () => {
    const token = accessToken || localStorage.getItem("accessToken");
    if (!token) return;

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
  }, [accessToken]);

  const addProject = async (project) => {
    setProjectsLoading(true);
    try {
      const payload = {
        projectName: project.projectName || project.name || "Untitled Project",
        name: project.projectName || project.name || "Untitled Project",
        description: project.description || "",
        startDate: project.startDate || undefined,
        deadline: project.deadline || undefined,
        teamId: project.teamId || project.batch || project.batchId || undefined,
        batch: project.batch || project.batchId || undefined,
        status: (project.status || "pending").toLowerCase(),
      };
      const res = await api.post("/projects/create-project", payload);
      // Invalidate & refetch
      await fetchProjects();
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
      const payload = {
        ...updatedProject,
        projectName: updatedProject.projectName || updatedProject.name,
        teamId: updatedProject.teamId || updatedProject.batch || updatedProject.batchId,
        status: updatedProject.status ? String(updatedProject.status).toLowerCase() : undefined,
      };
      const res = await api.put(`/projects/update-project/${id}`, payload);
      // Invalidate & refetch
      await fetchProjects();
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
      // Invalidate & refetch
      await fetchProjects();
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
    projects.filter((p) => {
      const pTeamId =
        p.teamId?._id ||
        p.teamId?.id ||
        (typeof p.teamId === "string" ? p.teamId : null) ||
        p.batch?._id ||
        p.batch?.id ||
        (typeof p.batch === "string" ? p.batch : null) ||
        p.batchId;
      return String(pTeamId) === String(teamId);
    });

  // ── Sync with Auth State ────────────────────────────────────
  useEffect(() => {
    if (accessToken) {
      fetchTeams();
      fetchProjects();
    } else {
      setTeams([]);
      setProjects([]);
    }
  }, [accessToken, fetchTeams, fetchProjects]);

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