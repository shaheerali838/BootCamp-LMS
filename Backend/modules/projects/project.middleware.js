import Project from "../../model/project.model.js";

// Check Project Exists
const checkProjectExists = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    req.project = project;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Check Duplicate Project Name
const checkDuplicateProjectName = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      projectName: req.body.projectName,
    });

    if (project) {
      return res.status(400).json({
        success: false,
        message: "Project name already exists",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  checkProjectExists,
  checkDuplicateProjectName,
};
