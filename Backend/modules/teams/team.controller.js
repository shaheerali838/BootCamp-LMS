    const teamService = require("./team.service");

// Create Team
const createTeam = async (req, res) => {
  try {
    const team = await teamService.createTeam(req.body);

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Teams
const getAllTeams = async (req, res) => {
  try {
    const teams = await teamService.getAllTeams();

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Team By ID
const getTeamById = async (req, res) => {
  try {
    const team = await teamService.getTeamById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Team
const updateTeam = async (req, res) => {
  try {
    const team = await teamService.updateTeam(req.params.id, req.body);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Team updated successfully",
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Team
const deleteTeam = async (req, res) => {
  try {
    const team = await teamService.deleteTeam(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add Member
const addMember = async (req, res) => {
  try {
    const team = await teamService.addMember(
      req.params.id,
      req.body.userId
    );

    res.status(200).json({
      success: true,
      message: "Member added successfully",
      data: team,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Search Team
const searchTeam = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const teams = await teamService.searchTeam(keyword);

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Member
const removeMember = async (req, res) => {
  try {
    const team = await teamService.removeMember(
      req.params.id,
      req.body.userId
    );

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
      data: team,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Set Team Leader
const setTeamLeader = async (req, res) => {
  try {
    const team = await teamService.setTeamLeader(
      req.params.id,
      req.body.userId
    );

    res.status(200).json({
      success: true,
      message: "Team leader set successfully",
      data: team,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember,
  setTeamLeader,
  searchTeam,
};