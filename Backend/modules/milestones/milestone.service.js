import Milestone from "../../model/milestone.model.js";

// Create Milestone
const createMilestone = async (milestoneData) => {
  const milestone = await Milestone.create(milestoneData);
  return milestone;
};

// Get All Milestones
const getAllMilestones = async () => {
  return await Milestone.find()
    .populate("projectId", "projectName description startDate deadline status");
};

// Get Milestone By ID
const getMilestoneById = async (id) => {
  return await Milestone.findById(id)
    .populate("projectId", "projectName description startDate deadline status");
};

// Update Milestone
const updateMilestone = async (id, data) => {
  return await Milestone.findByIdAndUpdate(
    id,
    data,
    {
      returnDocument: "after",
      runValidators: true,
    }
  )
    .populate("projectId", "projectName description startDate deadline status");
};

// Delete Milestone
const deleteMilestone = async (id) => {
  return await Milestone.findByIdAndDelete(id);
};

// Search Milestone
const searchMilestone = async (keyword) => {
  return await Milestone.find({
    milestoneName: {
      $regex: keyword,
      $options: "i",
    },
  })
    .populate("projectId", "projectName description startDate deadline status");
};

// Get Milestones by Project
const getMilestonesByProject = async (projectId) => {
  return await Milestone.find({ projectId })
    .populate("projectId", "projectName description startDate deadline status");
};

// Get Milestones by Status
const getMilestonesByStatus = async (status) => {
  return await Milestone.find({ status })
    .populate("projectId", "projectName description startDate deadline status");
};

export {
  createMilestone,
  getAllMilestones,
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
  searchMilestone,
  getMilestonesByProject,
  getMilestonesByStatus,
};
