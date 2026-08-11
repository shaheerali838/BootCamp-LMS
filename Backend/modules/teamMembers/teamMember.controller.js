import {
  addMember,
  getTeamMembers,
  getMemberById,
  updateMember,
  removeMember,
  removeMemberByTeamAndStudent,
} from "./teamMember.service.js";

// Add Member to Team
const addMemberHandler = async (req, res) => {
  try {
    const member = await addMember(req.body);

    res.status(201).json({
      success: true,
      message: "Member added to team successfully",
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Members of a Team
const getTeamMembersHandler = async (req, res) => {
  try {
    const { teamId } = req.params;
    const members = await getTeamMembers(teamId);

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Member By ID
const getMemberByIdHandler = async (req, res) => {
  try {
    const member = await getMemberById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Member
const updateMemberHandler = async (req, res) => {
  try {
    const member = await updateMember(req.params.id, req.body);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Member from Team
const removeMemberHandler = async (req, res) => {
  try {
    const member = await removeMember(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Team member removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Member by Team and Student ID
const removeMemberByTeamAndStudentHandler = async (req, res) => {
  try {
    const { teamId, studentId } = req.params;
    const member = await removeMemberByTeamAndStudent(teamId, studentId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Team member removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  addMemberHandler,
  getTeamMembersHandler,
  getMemberByIdHandler,
  updateMemberHandler,
  removeMemberHandler,
  removeMemberByTeamAndStudentHandler,
};
