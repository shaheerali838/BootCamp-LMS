import TeamMember from "../../model/teamMember.model.js";

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
    const teamId = req.body.teamId || req.params.teamId;
    const studentId = req.body.studentId || req.params.studentId;

    if (!teamId || !studentId) return next();

    const query = { teamId, studentId };
    if (req.params.id) {
      query._id = { $ne: req.params.id };
    }

    const existingMember = await TeamMember.findOne(query);

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
