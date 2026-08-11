import TeamMember from "../../model/teamMember.model.js";

// Add Member to Team
const addMember = async (memberData) => {
  const member = await TeamMember.create(memberData);
  return member;
};

// Get All Members of a Team
const getTeamMembers = async (teamId) => {
  return await TeamMember.find({ teamId })
    .populate("studentId", "firstName lastName email rollNumber")
    .populate("teamId", "teamName");
};

// Get Member By ID
const getMemberById = async (id) => {
  return await TeamMember.findById(id)
    .populate("studentId", "firstName lastName email rollNumber")
    .populate("teamId", "teamName");
};

// Update Member
const updateMember = async (id, data) => {
  return await TeamMember.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("studentId", "firstName lastName email rollNumber")
    .populate("teamId", "teamName");
};

// Remove Member from Team
const removeMember = async (id) => {
  return await TeamMember.findByIdAndDelete(id);
};

// Remove Member by Team and Student ID
const removeMemberByTeamAndStudent = async (teamId, studentId) => {
  return await TeamMember.findOneAndDelete({ teamId, studentId });
};

// Check if Student is already in Team
const checkDuplicateMember = async (teamId, studentId) => {
  return await TeamMember.findOne({ teamId, studentId });
};

export {
  addMember,
  getTeamMembers,
  getMemberById,
  updateMember,
  removeMember,
  removeMemberByTeamAndStudent,
  checkDuplicateMember,
};
