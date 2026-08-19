import Team from "../../model/team.model.js";

// Create Team
const createTeam = async (teamData) => {
  const team = await Team.create(teamData);
  return await Team.findById(team._id)
    .populate("batchId", "batchName")
    .populate("mentor", "firstName lastName email")
    .populate("teamLead", "firstName lastName email rollNumber")
    .populate("members", "firstName lastName email rollNumber");
};

// Get All Teams
const getAllTeams = async () => {
  return await Team.find()
    .populate("batchId", "batchName")
    .populate("mentor", "firstName lastName email")
    .populate("teamLead", "firstName lastName email rollNumber")
    .populate("members", "firstName lastName email rollNumber");
};

// Get Team By ID
const getTeamById = async (id) => {
  return await Team.findById(id)
    .populate("batchId", "batchName")
    .populate("mentor", "firstName lastName email")
    .populate("teamLead", "firstName lastName email rollNumber")
    .populate("members", "firstName lastName email rollNumber");
};

// Update Team
const updateTeam = async (id, data) => {
  return await Team.findByIdAndUpdate(
    id,
    data,
    {
      returnDocument: "after",
      runValidators: true,
    }
  )
    .populate("batchId", "batchName")
    .populate("mentor", "firstName lastName email")
    .populate("teamLead", "firstName lastName email rollNumber")
    .populate("members", "firstName lastName email rollNumber");
};

// Delete Team
const deleteTeam = async (id) => {
  return await Team.findByIdAndDelete(id);
};

// Search Team
const searchTeam = async (keyword) => {
  return await Team.find({
    teamName: {
      $regex: keyword,
      $options: "i",
    },
  })
    .populate("batchId", "batchName")
    .populate("mentor", "firstName lastName email")
    .populate("teamLead", "firstName lastName email rollNumber")
    .populate("members", "firstName lastName email rollNumber");
};

export {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  searchTeam,
};
