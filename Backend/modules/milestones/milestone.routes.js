import express from "express";
import {
  createMilestoneHandler,
  getAllMilestonesHandler,
  getMilestoneByIdHandler,
  updateMilestoneHandler,
  deleteMilestoneHandler,
  searchMilestoneHandler,
  getMilestonesByProjectHandler,
  getMilestonesByStatusHandler,
} from "./milestone.controller.js";
import {
  createMilestoneValidation,
  updateMilestoneValidation,
} from "./milestone.validation.js";
import validateMiddleware from "../../middleware/validateMiddleware.js";
import {
  checkMilestoneExists,
  checkDuplicateMilestoneName,
} from "./milestone.middleware.js";

// Import RBAC Middlewares
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { requirePermission } from "../../middleware/permissionMiddleware.js";
import PERMISSIONS from "../../constants/permission.js";

const router = express.Router();

// Create Milestone
router.post(
  "/create-milestone",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_MILESTONES),
  createMilestoneValidation,
  validateMiddleware,
  checkDuplicateMilestoneName,
  createMilestoneHandler,
);

// Get All Milestones
router.get(
  "/get-all-milestones",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_MILESTONES),
  getAllMilestonesHandler,
);

// Search Milestone
router.get(
  "/search-milestones",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_MILESTONES),
  searchMilestoneHandler,
);

// Get Milestones by Project
router.get(
  "/get-milestones-by-project/:projectId",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_MILESTONES),
  getMilestonesByProjectHandler,
);

// Get Milestones by Status
router.get(
  "/get-milestones-by-status/:status",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_MILESTONES),
  getMilestonesByStatusHandler,
);

// Get Milestone By ID
router.get(
  "/get-milestone/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_MILESTONES),
  checkMilestoneExists,
  getMilestoneByIdHandler,
);

// Update Milestone
router.put(
  "/update-milestone/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_MILESTONES),
  updateMilestoneValidation,
  validateMiddleware,
  checkMilestoneExists,
  updateMilestoneHandler,
);

// Delete Milestone
router.delete(
  "/delete-milestone/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_MILESTONES),
  checkMilestoneExists,
  deleteMilestoneHandler,
);

export default router;
