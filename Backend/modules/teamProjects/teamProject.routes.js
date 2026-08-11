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
  "/",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_PROJECTS),
  assignProjectValidation,
  validateMiddleware,
  checkDuplicateAssignment,
  assignProjectHandler,
);

// Get All Projects of a Team
router.get(
  "/team/:teamId",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_PROJECTS),
  getTeamProjectsHandler,
);

// Get All Teams of a Project
router.get(
  "/project/:projectId",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_PROJECTS),
  getProjectTeamsHandler,
);

// Get TeamProject By ID
router.get(
  "/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_PROJECTS),
  checkTeamProjectExists,
  getTeamProjectByIdHandler,
);

// Update TeamProject
router.put(
  "/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_PROJECTS),
  updateTeamProjectValidation,
  validateMiddleware,
  checkTeamProjectExists,
  updateTeamProjectHandler,
);

// Remove Project from Team
router.delete(
  "/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_PROJECTS),
  checkTeamProjectExists,
  removeProjectHandler,
);

// Remove Project by Team and Project ID
router.delete(
  "/team/:teamId/project/:projectId",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_PROJECTS),
  removeProjectByTeamAndProjectHandler,
);

export default router;
