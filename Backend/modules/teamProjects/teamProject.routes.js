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
import {
  assignProjectValidation,
  updateTeamProjectValidation,
} from "./teamProject.validation.js";
import validateMiddleware from "../../middleware/validateMiddleware.js";
import {
  checkTeamProjectExists,
  checkDuplicateAssignment,
} from "./teamProject.middleware.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { requirePermission } from "../../middleware/permissionMiddleware.js";
import PERMISSIONS from "../../constants/permission.js";

const router = express.Router();

// Assign Project to Team
router.post(
  "/assign-project",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_PROJECTS),
  assignProjectValidation,
  validateMiddleware,
  checkDuplicateAssignment,
  assignProjectHandler,
);

// Get All Projects of a Team
router.get(
  "/get-projects-by-team/:teamId",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_PROJECTS),
  getTeamProjectsHandler,
);

// Get All Teams of a Project
router.get(
  "/get-teams-by-project/:projectId",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_PROJECTS),
  getProjectTeamsHandler,
);

// Get TeamProject By ID
router.get(
  "/get-team-project/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_PROJECTS),
  checkTeamProjectExists,
  getTeamProjectByIdHandler,
);

// Update TeamProject
router.put(
  "/update-team-project/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_PROJECTS),
  updateTeamProjectValidation,
  validateMiddleware,
  checkTeamProjectExists,
  updateTeamProjectHandler,
);

// Remove Project from Team
router.delete(
  "/remove-team-project/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_PROJECTS),
  checkTeamProjectExists,
  removeProjectHandler,
);

// Remove Project by Team and Project ID
router.delete(
  "/remove-specific-project/team/:teamId/project/:projectId",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_PROJECTS),
  removeProjectByTeamAndProjectHandler,
);

export default router;
