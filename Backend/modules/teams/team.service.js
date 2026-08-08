const Team = require("./team.model");

// Create Team
const createTeam = async (teamData) => {
  const team = await Team.create(teamData);
  return team;
};

// Get All Teams
const getAllTeams = async () => {
  return await Team.find({ isDeleted: false })
    .populate("leader", "name email")
    .populate("members", "name email");
};

// Get Team By ID
const getTeamById = async (id) => {
  return await Team.findOne({
    _id: id,
    isDeleted: false,
  })
    .populate("leader", "name email")
    .populate("members", "name email");
};

// Update Team
const updateTeam = async (id, data) => {
  return await Team.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// Delete Team (Soft Delete)
const deleteTeam = async (id) => {
  return await Team.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );
};

// Search Team
const searchTeam = async (keyword) => {
  return await Team.find({
    isDeleted: false,
    teamName: {
      $regex: keyword,
      $options: "i",
    },
  });
};

module.exports = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  searchTeam,
};