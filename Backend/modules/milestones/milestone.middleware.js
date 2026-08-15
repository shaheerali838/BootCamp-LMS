import Milestone from "../../model/milestone.model.js";

// Check Milestone Exists
const checkMilestoneExists = async (req, res, next) => {
  try {
    const milestone = await Milestone.findById(req.params.id);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    req.milestone = milestone;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Check Duplicate Milestone Name
const checkDuplicateMilestoneName = async (req, res, next) => {
  try {
    const milestone = await Milestone.findOne({
      milestoneName: req.body.milestoneName,
      projectId: req.body.projectId,
    });

    if (milestone) {
      return res.status(400).json({
        success: false,
        message: "Milestone name already exists in this project",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  checkMilestoneExists,
  checkDuplicateMilestoneName,
};
