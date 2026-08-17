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
  "/create-team",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_TEAMS),
  createTeamValidation,
  validateMiddleware,
  checkDuplicateTeamName,
  createTeamHandler,
);

// Get All Teams
router.get(
  "/get-all-teams",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_TEAMS),
  getAllTeamsHandler,
);

// Search Team
router.get(
  "/search-teams",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_TEAMS),
  searchTeamHandler,
);

// Get Team By ID
router.get(
  "/get-team/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_TEAMS),
  checkTeamExists,
  getTeamByIdHandler,
);

// Update Team
router.put(
  "/update-team/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_TEAMS),
  updateTeamValidation,
  validateMiddleware,
  checkTeamExists,
  updateTeamHandler,
);

// Delete Team
router.delete(
  "/delete-team/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_TEAMS),
  checkTeamExists,
  deleteTeamHandler,
);

export default router;
