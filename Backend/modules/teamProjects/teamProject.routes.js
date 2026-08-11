import express from "express";
import {
  assignProjectHandler,
  getTeamProjectsHandler,
  getProjectTeamsHandler,
  getTeamProjectByIdHandler,
  updateTeamProjectHandler,
  removeProjectHandler,
  removeProjectByTeamAndProjectHandler,
} from "./teamProject.controller.js";
import { assignProjectValidation, updateTeamProjectValidation } from "./teamProject.validation.js";
import validateMiddleware from "../middleware/validateMiddleware.js";
import { checkTeamProjectExists, checkDuplicateAssignment } from "./teamProject.middleware.js";

const router = express.Router();

// Assign Project to Team
router.post(
  "/",
  assignProjectValidation,
  validateMiddleware,
  checkDuplicateAssignment,
  assignProjectHandler
);

// Get All Projects of a Team
router.get("/team/:teamId", getTeamProjectsHandler);

// Get All Teams of a Project
router.get("/project/:projectId", getProjectTeamsHandler);

// Get TeamProject By ID
router.get("/:id", checkTeamProjectExists, getTeamProjectByIdHandler);

// Update TeamProject
router.put(
  "/:id",
  updateTeamProjectValidation,
  validateMiddleware,
  checkTeamProjectExists,
  updateTeamProjectHandler
);

// Remove Project from Team
router.delete("/:id", checkTeamProjectExists, removeProjectHandler);

// Remove Project by Team and Project ID
router.delete("/team/:teamId/project/:projectId", removeProjectByTeamAndProjectHandler);

export default router;
