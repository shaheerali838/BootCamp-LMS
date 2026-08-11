import express from "express";
import {
  createTeamHandler,
  getAllTeamsHandler,
  getTeamByIdHandler,
  updateTeamHandler,
  deleteTeamHandler,
  searchTeamHandler,
} from "./team.controller.js";
import {
  createTeamValidation,
  updateTeamValidation,
} from "./team.validation.js";
import { checkTeamExists, checkDuplicateTeamName } from "./team.middleware.js";
import validateMiddleware from "../../middleware/validateMiddleware.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { requirePermission } from "../../middleware/permissionMiddleware.js";
import PERMISSIONS from "../../constants/permission.js";

const router = express.Router();

// Create Team
router.post(
  "/",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_TEAMS),
  createTeamValidation,
  validateMiddleware,
  checkDuplicateTeamName,
  createTeamHandler,
);

// Get All Teams
router.get(
  "/",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_TEAMS),
  getAllTeamsHandler,
);

// Search Team
router.get(
  "/search",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_TEAMS),
  searchTeamHandler,
);

// Get Team By ID
router.get(
  "/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_TEAMS),
  checkTeamExists,
  getTeamByIdHandler,
);

// Update Team
router.put(
  "/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_TEAMS),
  updateTeamValidation,
  validateMiddleware,
  checkTeamExists,
  updateTeamHandler,
);

// Delete Team
router.delete(
  "/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_TEAMS),
  checkTeamExists,
  deleteTeamHandler,
);

export default router;
