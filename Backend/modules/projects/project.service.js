import Project from "../../model/project.model.js";

// Create Project
const createProject = async (projectData) => {
  const project = await Project.create(projectData);
  return project;
};

// Get All Projects
const getAllProjects = async () => {
  return await Project.find()
    .populate("batch", "batchName")
    .populate("createdBy", "firstName lastName email");
};

// Get Project By ID
const getProjectById = async (id) => {
  return await Project.findById(id)
    .populate("batch", "batchName")
    .populate("createdBy", "firstName lastName email");
};

// Update Project
const updateProject = async (id, data) => {
  return await Project.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("batch", "batchName")
    .populate("createdBy", "firstName lastName email");
};

// Delete Project
const deleteProject = async (id) => {
  return await Project.findByIdAndDelete(id);
};

// Search Project
const searchProject = async (keyword) => {
  return await Project.find({
    projectName: {
      $regex: keyword,
      $options: "i",
    },
  })
    .populate("batch", "batchName")
    .populate("createdBy", "firstName lastName email");
};

// Get Projects by Batch
const getProjectsByBatch = async (batchId) => {
  return await Project.find({ batch: batchId })
    .populate("batch", "batchName")
    .populate("createdBy", "firstName lastName email");
};

// Get Projects by Status
const getProjectsByStatus = async (status) => {
  return await Project.find({ status })
    .populate("batch", "batchName")
    .populate("createdBy", "firstName lastName email");
};

export {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  searchProject,
  getProjectsByBatch,
  getProjectsByStatus,
};
