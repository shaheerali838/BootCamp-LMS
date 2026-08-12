import {
  createSprint,
  getAllSprints,
  getSprintById,
  updateSprint,
  deleteSprint,
  searchSprint,
  getSprintsByMilestone,
  getSprintsByStatus,
} from "./sprint.service.js";

// Create Sprint
const createSprintHandler = async (req, res) => {
  try {
    const sprint = await createSprint(req.body);

    res.status(201).json({
      success: true,
      message: "Sprint created successfully",
      data: sprint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Sprints
const getAllSprintsHandler = async (req, res) => {
  try {
    const sprints = await getAllSprints();

    res.status(200).json({
      success: true,
      count: sprints.length,
      data: sprints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Sprint By ID
const getSprintByIdHandler = async (req, res) => {
  try {
    const sprint = await getSprintById(req.params.id);

    if (!sprint) {
      return res.status(404).json({
        success: false,
        message: "Sprint not found",
      });
    }

    res.status(200).json({
      success: true,
      data: sprint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Sprint
const updateSprintHandler = async (req, res) => {
  try {
    const sprint = await updateSprint(req.params.id, req.body);

    if (!sprint) {
      return res.status(404).json({
        success: false,
        message: "Sprint not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sprint updated successfully",
      data: sprint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Sprint
const deleteSprintHandler = async (req, res) => {
  try {
    const sprint = await deleteSprint(req.params.id);

    if (!sprint) {
      return res.status(404).json({
        success: false,
        message: "Sprint not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sprint deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search Sprint
const searchSprintHandler = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const sprints = await searchSprint(keyword);

    res.status(200).json({
      success: true,
      count: sprints.length,
      data: sprints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Sprints by Milestone
const getSprintsByMilestoneHandler = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const sprints = await getSprintsByMilestone(milestoneId);

    res.status(200).json({
      success: true,
      count: sprints.length,
      data: sprints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Sprints by Status
const getSprintsByStatusHandler = async (req, res) => {
  try {
    const { status } = req.params;
    const sprints = await getSprintsByStatus(status);

    res.status(200).json({
      success: true,
      count: sprints.length,
      data: sprints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createSprintHandler,
  getAllSprintsHandler,
  getSprintByIdHandler,
  updateSprintHandler,
  deleteSprintHandler,
  searchSprintHandler,
  getSprintsByMilestoneHandler,
  getSprintsByStatusHandler,
};
