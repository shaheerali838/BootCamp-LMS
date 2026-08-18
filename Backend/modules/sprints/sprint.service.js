import Sprint from "../../model/sprint.model.js";

// Create Sprint
const createSprint = async (sprintData) => {
  const sprint = await Sprint.create(sprintData);
  return sprint;
};

// Get All Sprints
const getAllSprints = async () => {
  return await Sprint.find()
    .populate("milestoneId", "milestoneName description dueDate status");
};

// Get Sprint By ID
const getSprintById = async (id) => {
  return await Sprint.findById(id)
    .populate("milestoneId", "milestoneName description dueDate status");
};

// Update Sprint
const updateSprint = async (id, data) => {
  return await Sprint.findByIdAndUpdate(
    id,
    data,
    {
      returnDocument: "after",
      runValidators: true,
    }
  )
    .populate("milestoneId", "milestoneName description dueDate status");
};

// Delete Sprint
const deleteSprint = async (id) => {
  return await Sprint.findByIdAndDelete(id);
};

// Search Sprint
const searchSprint = async (keyword) => {
  return await Sprint.find({
    sprintName: {
      $regex: keyword,
      $options: "i",
    },
  })
    .populate("milestoneId", "milestoneName description dueDate status");
};

// Get Sprints by Milestone
const getSprintsByMilestone = async (milestoneId) => {
  return await Sprint.find({ milestoneId })
    .populate("milestoneId", "milestoneName description dueDate status");
};

// Get Sprints by Status
const getSprintsByStatus = async (status) => {
  return await Sprint.find({ status })
    .populate("milestoneId", "milestoneName description dueDate status");
};

export {
  createSprint,
  getAllSprints,
  getSprintById,
  updateSprint,
  deleteSprint,
  searchSprint,
  getSprintsByMilestone,
  getSprintsByStatus,
};
