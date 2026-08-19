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
    const name = req.body.milestoneName || req.body.title || req.body.name;
    if (!name) return next();

    const query = {
      milestoneName: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    };
    if (req.params.id) {
      query._id = { $ne: req.params.id };
    }

    const milestone = await Milestone.findOne(query);

    if (milestone) {
      return res.status(400).json({
        success: false,
        message: "Milestone name already exists",
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
