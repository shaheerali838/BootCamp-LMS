import Project from "../../model/project.model.js";
import Team from "../../model/team.model.js";
import TeamProject from "../../model/teamProject.model.js";

// Create Project
const createProject = async (projectData) => {
  const project = await Project.create(projectData);
  return project;
};

// ================= TEAM POPULATION CONFIG (ENHANCED) =================
const teamPopulateConfig = {
  path: "teamId",
  select: "teamName members teamLead mentor batchId description status",
  populate: [
    { path: "teamLead", select: "firstName lastName email rollNumber" },
    { path: "members", select: "firstName lastName email rollNumber" },
    { path: "mentor", select: "firstName lastName email" },
  ],
};
// ======================================================================

// Helper to build base filter based on requesting user role
const buildUserProjectFilter = async (user, additionalFilter = {}) => {
  if (user && (user.role === "STUDENT" || user.rollNumber)) {
    const studentId = user._id;

    // Find all teams where student is leader or member
    const studentTeams = await Team.find({
      $or: [{ teamLead: studentId }, { members: studentId }],
    }).select("_id");

    const teamIds = studentTeams.map((t) => t._id);

    // Find all mapped team projects
    const teamProjectMappings = await TeamProject.find({
      teamId: { $in: teamIds },
    }).select("projectId");

    const mappedProjectIds = teamProjectMappings.map((tp) => tp.projectId);

    // If student is not part of any team, they have 0 assigned projects
    if (teamIds.length === 0 && mappedProjectIds.length === 0) {
      return { _id: { $in: [] } }; // Match nothing
    }

    return {
      ...additionalFilter,
      $or: [
        { teamId: { $in: teamIds } },
        { _id: { $in: mappedProjectIds } },
      ],
    };
  }

  return additionalFilter;
};

// Get All Projects
const getAllProjects = async (user = null) => {
  const filter = await buildUserProjectFilter(user);
  return await Project.find(filter)
    .populate("batch", "batchName")
    .populate(teamPopulateConfig)
    .populate("createdBy", "firstName lastName email");
};

// Get Project By ID
const getProjectById = async (id) => {
  return await Project.findById(id)
    .populate("batch", "batchName")
    .populate(teamPopulateConfig)
    .populate("createdBy", "firstName lastName email");
};

// Update Project
const updateProject = async (id, data) => {
  return await Project.findByIdAndUpdate(
    id,
    data,
    {
      returnDocument: "after",
      runValidators: true,
    }
  )
    .populate("batch", "batchName")
    .populate(teamPopulateConfig)
    .populate("createdBy", "firstName lastName email");
};

// Delete Project
const deleteProject = async (id) => {
  return await Project.findByIdAndDelete(id);
};

// Search Project
const searchProject = async (keyword, user = null) => {
  const filter = await buildUserProjectFilter(user, {
    projectName: {
      $regex: keyword,
      $options: "i",
    },
  });

  return await Project.find(filter)
    .populate("batch", "batchName")
    .populate(teamPopulateConfig)
    .populate("createdBy", "firstName lastName email");
};

// Get Projects by Batch
const getProjectsByBatch = async (batchId, user = null) => {
  const filter = await buildUserProjectFilter(user, { batch: batchId });

  return await Project.find(filter)
    .populate("batch", "batchName")
    .populate(teamPopulateConfig)
    .populate("createdBy", "firstName lastName email");
};

// Get Projects by Status
const getProjectsByStatus = async (status, user = null) => {
  const filter = await buildUserProjectFilter(user, { status });

  return await Project.find(filter)
    .populate("batch", "batchName")
    .populate(teamPopulateConfig)
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
