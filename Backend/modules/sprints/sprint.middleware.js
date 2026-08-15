import Sprint from "../../model/sprint.model.js";

// Check Sprint Exists
const checkSprintExists = async (req, res, next) => {
  try {
    const sprint = await Sprint.findById(req.params.id);

    if (!sprint) {
      return res.status(404).json({
        success: false,
        message: "Sprint not found",
      });
    }

    req.sprint = sprint;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Check Duplicate Sprint Name
const checkDuplicateSprintName = async (req, res, next) => {
  try {
    const sprint = await Sprint.findOne({
      sprintName: req.body.sprintName,
      milestoneId: req.body.milestoneId,
    });

    if (sprint) {
      return res.status(400).json({
        success: false,
        message: "Sprint name already exists in this milestone",
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
  checkSprintExists,
  checkDuplicateSprintName,
};
