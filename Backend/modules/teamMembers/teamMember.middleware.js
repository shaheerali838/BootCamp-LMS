import TeamMember from "../../model/teamMember.model.js";
import { checkDuplicateMember as checkDuplicateMemberService } from "./teamMember.service.js";

// Check Team Member Exists
const checkTeamMemberExists = async (req, res, next) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    req.teamMember = member;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Check Duplicate Member
const checkDuplicateMember = async (req, res, next) => {
  try {
    const { teamId, studentId } = req.body;

    const existingMember = await checkDuplicateMemberService(teamId, studentId);

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "Student is already a member of this team",
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
  checkTeamMemberExists,
  checkDuplicateMember,
};
