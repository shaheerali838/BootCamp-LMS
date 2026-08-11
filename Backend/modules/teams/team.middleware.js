import Team from "../../model/team.model.js";

// Check Team Exists
const checkTeamExists = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    req.team = team;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Check Duplicate Team Name
const checkDuplicateTeamName = async (req, res, next) => {
  try {
    const team = await Team.findOne({
      teamName: req.body.teamName,
    });

    if (team) {
      return res.status(400).json({
        success: false,
        message: "Team name already exists",
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
  checkTeamExists,
  checkDuplicateTeamName,
};

