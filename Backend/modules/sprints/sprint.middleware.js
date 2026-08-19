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
    const name = req.body.sprintName || req.body.name;
    if (!name) return next();

    const query = {
      sprintName: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    };
    if (req.params.id) {
      query._id = { $ne: req.params.id };
    }

    const sprint = await Sprint.findOne(query);

    if (sprint) {
      return res.status(400).json({
        success: false,
        message: "Sprint name already exists",
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
