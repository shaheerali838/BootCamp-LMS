import express from "express";
import {
  createSprintHandler,
  getAllSprintsHandler,
  getSprintByIdHandler,
  updateSprintHandler,
  deleteSprintHandler,
  searchSprintHandler,
  getSprintsByMilestoneHandler,
  getSprintsByStatusHandler,
} from "./sprint.controller.js";
import {
  createSprintValidation,
  updateSprintValidation,
} from "./sprint.validation.js";
import validateMiddleware from "../../middleware/validateMiddleware.js";
import {
  checkSprintExists,
  checkDuplicateSprintName,
} from "./sprint.middleware.js";

// Import RBAC Middlewares
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { requirePermission } from "../../middleware/permissionMiddleware.js";
import PERMISSIONS from "../../constants/permission.js";

const router = express.Router();

// Create Sprint
router.post(
  "/",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_SPRINTS),
  createSprintValidation,
  validateMiddleware,
  checkDuplicateSprintName,
  createSprintHandler,
);

// Get All Sprints
router.get(
  "/",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_SPRINTS),
  getAllSprintsHandler,
);

// Search Sprint
router.get(
  "/search",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_SPRINTS),
  searchSprintHandler,
);

// Get Sprints by Milestone
router.get(
  "/milestone/:milestoneId",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_SPRINTS),
  getSprintsByMilestoneHandler,
);

// Get Sprints by Status
router.get(
  "/status/:status",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_SPRINTS),
  getSprintsByStatusHandler,
);

// Get Sprint By ID
router.get(
  "/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_SPRINTS),
  checkSprintExists,
  getSprintByIdHandler,
);

// Update Sprint
router.put(
  "/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_SPRINTS),
  updateSprintValidation,
  validateMiddleware,
  checkSprintExists,
  updateSprintHandler,
);

// Delete Sprint
router.delete(
  "/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_SPRINTS),
  checkSprintExists,
  deleteSprintHandler,
);

export default router;
