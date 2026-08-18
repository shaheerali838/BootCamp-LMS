import TeamProject from "../../model/teamProject.model.js";

// Assign Project to Team
const assignProject = async (projectData) => {
  const teamProject = await TeamProject.create(projectData);
  return teamProject;
};

// Get All Projects of a Team
const getTeamProjects = async (teamId) => {
  return await TeamProject.find({ teamId })
    .populate("projectId", "projectName description status")
    .populate("teamId", "teamName");
};

// Get All Teams of a Project
const getProjectTeams = async (projectId) => {
  return await TeamProject.find({ projectId })
    .populate("teamId", "teamName")
    .populate("projectId", "projectName description status");
};

// Get TeamProject By ID
const getTeamProjectById = async (id) => {
  return await TeamProject.findById(id)
    .populate("projectId", "projectName description status")
    .populate("teamId", "teamName");
};

// Update TeamProject
const updateTeamProject = async (id, data) => {
  return await TeamProject.findByIdAndUpdate(
    id,
    data,
    {
      returnDocument: "after",
      runValidators: true,
    }
  )
    .populate("projectId", "projectName description status")
    .populate("teamId", "teamName");
};

// Remove Project from Team
const removeProject = async (id) => {
  return await TeamProject.findByIdAndDelete(id);
};

// Remove Project by Team and Project ID
const removeProjectByTeamAndProject = async (teamId, projectId) => {
  return await TeamProject.findOneAndDelete({ teamId, projectId });
};

// Check if Project is already assigned to Team
const checkDuplicateAssignment = async (teamId, projectId) => {
  return await TeamProject.findOne({ teamId, projectId });
};

export {
  assignProject,
  getTeamProjects,
  getProjectTeams,
  getTeamProjectById,
  updateTeamProject,
  removeProject,
  removeProjectByTeamAndProject,
  checkDuplicateAssignment,
};
