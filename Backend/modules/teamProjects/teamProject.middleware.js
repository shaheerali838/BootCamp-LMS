import TeamProject from "../../model/teamProject.model.js";
import { checkDuplicateAssignment as checkDuplicateAssignmentService } from "./teamProject.service.js";

// Check Team Project Exists
const checkTeamProjectExists = async (req, res, next) => {
  try {
    const teamProject = await TeamProject.findById(req.params.id);

    if (!teamProject) {
      return res.status(404).json({
        success: false,
        message: "Team project assignment not found",
      });
    }

    req.teamProject = teamProject;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Check Duplicate Assignment
const checkDuplicateAssignment = async (req, res, next) => {
  try {
    const { teamId, projectId } = req.body;

    const existingAssignment = await checkDuplicateAssignmentService(teamId, projectId);

    if (existingAssignment) {
      return res.status(400).json({
        success: false,
        message: "Project is already assigned to this team",
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
  checkTeamProjectExists,
  checkDuplicateAssignment,
};
