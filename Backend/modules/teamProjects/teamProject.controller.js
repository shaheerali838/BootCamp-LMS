import {
  assignProject,
  getTeamProjects,
  getProjectTeams,
  getTeamProjectById,
  updateTeamProject,
  removeProject,
  removeProjectByTeamAndProject,
} from "./teamProject.service.js";

// Assign Project to Team
const assignProjectHandler = async (req, res) => {
  try {
    const teamProject = await assignProject(req.body);

    res.status(201).json({
      success: true,
      message: "Project assigned to team successfully",
      data: teamProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Projects of a Team
const getTeamProjectsHandler = async (req, res) => {
  try {
    const { teamId } = req.params;
    const projects = await getTeamProjects(teamId);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Teams of a Project
const getProjectTeamsHandler = async (req, res) => {
  try {
    const { projectId } = req.params;
    const teams = await getProjectTeams(projectId);

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get TeamProject By ID
const getTeamProjectByIdHandler = async (req, res) => {
  try {
    const teamProject = await getTeamProjectById(req.params.id);

    if (!teamProject) {
      return res.status(404).json({
        success: false,
        message: "Team project assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: teamProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update TeamProject
const updateTeamProjectHandler = async (req, res) => {
  try {
    const teamProject = await updateTeamProject(req.params.id, req.body);

    if (!teamProject) {
      return res.status(404).json({
        success: false,
        message: "Team project assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Team project assignment updated successfully",
      data: teamProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Project from Team
const removeProjectHandler = async (req, res) => {
  try {
    const teamProject = await removeProject(req.params.id);

    if (!teamProject) {
      return res.status(404).json({
        success: false,
        message: "Team project assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project removed from team successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Project by Team and Project ID
const removeProjectByTeamAndProjectHandler = async (req, res) => {
  try {
    const { teamId, projectId } = req.params;
    const teamProject = await removeProjectByTeamAndProject(teamId, projectId);

    if (!teamProject) {
      return res.status(404).json({
        success: false,
        message: "Team project assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project removed from team successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  assignProjectHandler,
  getTeamProjectsHandler,
  getProjectTeamsHandler,
  getTeamProjectByIdHandler,
  updateTeamProjectHandler,
  removeProjectHandler,
  removeProjectByTeamAndProjectHandler,
};
