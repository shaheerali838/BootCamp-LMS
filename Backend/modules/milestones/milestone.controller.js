import {
  createMilestone,
  getAllMilestones,
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
  searchMilestone,
  getMilestonesByProject,
  getMilestonesByStatus,
} from "./milestone.service.js";

// Create Milestone
const createMilestoneHandler = async (req, res) => {
  try {
    const milestone = await createMilestone(req.body);

    res.status(201).json({
      success: true,
      message: "Milestone created successfully",
      data: milestone,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Milestones
const getAllMilestonesHandler = async (req, res) => {
  try {
    const milestones = await getAllMilestones();

    res.status(200).json({
      success: true,
      count: milestones.length,
      data: milestones,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Milestone By ID
const getMilestoneByIdHandler = async (req, res) => {
  try {
    const milestone = await getMilestoneById(req.params.id);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    res.status(200).json({
      success: true,
      data: milestone,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Milestone
const updateMilestoneHandler = async (req, res) => {
  try {
    const milestone = await updateMilestone(req.params.id, req.body);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Milestone updated successfully",
      data: milestone,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Milestone
const deleteMilestoneHandler = async (req, res) => {
  try {
    const milestone = await deleteMilestone(req.params.id);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Milestone deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search Milestone
const searchMilestoneHandler = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const milestones = await searchMilestone(keyword);

    res.status(200).json({
      success: true,
      count: milestones.length,
      data: milestones,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Milestones by Project
const getMilestonesByProjectHandler = async (req, res) => {
  try {
    const { projectId } = req.params;
    const milestones = await getMilestonesByProject(projectId);

    res.status(200).json({
      success: true,
      count: milestones.length,
      data: milestones,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Milestones by Status
const getMilestonesByStatusHandler = async (req, res) => {
  try {
    const { status } = req.params;
    const milestones = await getMilestonesByStatus(status);

    res.status(200).json({
      success: true,
      count: milestones.length,
      data: milestones,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createMilestoneHandler,
  getAllMilestonesHandler,
  getMilestoneByIdHandler,
  updateMilestoneHandler,
  deleteMilestoneHandler,
  searchMilestoneHandler,
  getMilestonesByProjectHandler,
  getMilestonesByStatusHandler,
};
