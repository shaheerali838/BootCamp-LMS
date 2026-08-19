import mongoose from "mongoose";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  searchProject,
  getProjectsByBatch,
  getProjectsByStatus,
} from "./project.service.js";
import TeamProject from "../../model/teamProject.model.js";

// Create Project
const createProjectHandler = async (req, res) => {
  try {
    // ================= SAFE TEAM ID EXTRACTION (ADDED) =================
    const rawTeamId =
      req.body.teamId?._id ||
      req.body.teamId?.id ||
      (typeof req.body.teamId === "string" ? req.body.teamId : null) ||
      req.body.batch?._id ||
      req.body.batch?.id ||
      (typeof req.body.batch === "string" ? req.body.batch : null) ||
      req.body.batchId;

    const teamId =
      rawTeamId && mongoose.Types.ObjectId.isValid(String(rawTeamId))
        ? String(rawTeamId)
        : undefined;
    // ===================================================================

    const payload = {
      ...req.body,
      projectName: req.body.projectName || req.body.name,
      createdBy: req.user?._id || req.body.createdBy,
      teamId,
      status: (req.body.status || "pending").toLowerCase(),
    };

    const project = await createProject(payload);

    if (teamId) {
      await TeamProject.findOneAndUpdate(
        { projectId: project._id },
        { teamId, projectId: project._id, assignedDate: new Date() },
        { upsert: true, returnDocument: "after" },
      ).catch(() => {});
    }

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Projects
const getAllProjectsHandler = async (req, res) => {
  try {
    const projects = await getAllProjects();

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

// Get Project By ID
const getProjectByIdHandler = async (req, res) => {
  try {
    const project = await getProjectById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Project
const updateProjectHandler = async (req, res) => {
  try {
    // ================= SAFE TEAM ID EXTRACTION (ADDED) =================
    const rawTeamId =
      req.body.teamId?._id ||
      req.body.teamId?.id ||
      (typeof req.body.teamId === "string" ? req.body.teamId : null) ||
      req.body.batch?._id ||
      req.body.batch?.id ||
      (typeof req.body.batch === "string" ? req.body.batch : null) ||
      req.body.batchId;

    const teamId =
      rawTeamId && mongoose.Types.ObjectId.isValid(String(rawTeamId))
        ? String(rawTeamId)
        : undefined;
    // ===================================================================

    const payload = {
      ...req.body,
    };

    if (req.body.name && !req.body.projectName) {
      payload.projectName = req.body.name;
    }
    if (teamId) {
      payload.teamId = teamId;
    }
    if (req.body.status) {
      payload.status = req.body.status.toLowerCase();
    }

    const project = await updateProject(req.params.id, payload);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (teamId) {
      await TeamProject.findOneAndUpdate(
        { projectId: project._id },
        { teamId, projectId: project._id, assignedDate: new Date() },
        { upsert: true, returnDocument: "after" },
      ).catch(() => {});
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Project
const deleteProjectHandler = async (req, res) => {
  try {
    const project = await deleteProject(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await TeamProject.deleteMany({ projectId: req.params.id }).catch(() => {});

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search Project
const searchProjectHandler = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const projects = await searchProject(keyword);

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

// Get Projects by Batch
const getProjectsByBatchHandler = async (req, res) => {
  try {
    const { batchId } = req.params;
    const projects = await getProjectsByBatch(batchId);

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

// Get Projects by Status
const getProjectsByStatusHandler = async (req, res) => {
  try {
    const { status } = req.params;
    const projects = await getProjectsByStatus(status);

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

export {
  createProjectHandler,
  getAllProjectsHandler,
  getProjectByIdHandler,
  updateProjectHandler,
  deleteProjectHandler,
  searchProjectHandler,
  getProjectsByBatchHandler,
  getProjectsByStatusHandler,
};
