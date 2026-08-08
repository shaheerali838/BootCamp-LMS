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
  return await Team.findOneAndUpdate(
    {
      _id: id,
      isDeleted: false,
    },
    data,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("leader", "name email")
    .populate("members", "name email");
};

// Delete Team - Soft Delete
const deleteTeam = async (id) => {
  return await Team.findOneAndUpdate(
    {
      _id: id,
      isDeleted: false,
    },
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );
};

// Add Member
const addMember = async (teamId, userId) => {
  const team = await Team.findOne({
    _id: teamId,
    isDeleted: false,
  });

  if (!team) {
    throw new Error("Team not found");
  }

  // Check if user is already a member
  const alreadyMember = team.members.some(
    (member) => member.toString() === userId.toString()
  );

  if (alreadyMember) {
    throw new Error("User is already a member of this team");
  }

  // Check maximum members
  if (team.members.length >= team.maxMembers) {
    throw new Error("Team has reached the maximum member limit");
  }

  // Add user to team
  team.members.push(userId);

  await team.save();

  return await Team.findById(team._id)
    .populate("leader", "name email")
    .populate("members", "name email");
};

// Search Team
const searchTeam = async (keyword) => {
  return await Team.find({
    isDeleted: false,
    teamName: {
      $regex: keyword,
      $options: "i",
    },
  })
    .populate("leader", "name email")
    .populate("members", "name email");
};

// Remove Member
const removeMember = async (teamId, userId) => {
  const team = await Team.findOne({
    _id: teamId,
    isDeleted: false,
  });

  if (!team) {
    throw new Error("Team not found");
  }

  // Check if user is actually a member
  const memberExists = team.members.some(
    (memberId) => memberId.toString() === userId.toString()
  );

  if (!memberExists) {
    throw new Error("User is not a member of this team");
  }

  // Remove user from members array
  team.members = team.members.filter(
    (memberId) => memberId.toString() !== userId.toString()
  );

  await team.save();

  return await Team.findById(team._id)
    .populate("leader", "name email")
    .populate("members", "name email");
};

// Set Team Leader
const setTeamLeader = async (teamId, userId) => {
  const team = await Team.findOne({
    _id: teamId,
    isDeleted: false,
  });

  if (!team) {
    throw new Error("Team not found");
  }

  // Check if user is a member of this team
  const isMember = team.members.some(
    (memberId) => memberId.toString() === userId.toString()
  );

  if (!isMember) {
    throw new Error("User must be a team member before becoming leader");
  }

  // Set leader
  team.leader = userId;

  await team.save();

  return await Team.findById(team._id)
    .populate("leader", "name email")
    .populate("members", "name email");
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