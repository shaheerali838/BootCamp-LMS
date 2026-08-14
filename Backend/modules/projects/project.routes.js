import express from "express";
import {
  createProjectHandler,
  getAllProjectsHandler,
  getProjectByIdHandler,
  updateProjectHandler,
  deleteProjectHandler,
  searchProjectHandler,
  getProjectsByBatchHandler,
  getProjectsByStatusHandler,
} from "./project.controller.js";
import {
  createProjectValidation,
  updateProjectValidation,
} from "./project.validation.js";
import validateMiddleware from "../../middleware/validateMiddleware.js";
import {
  checkProjectExists,
  checkDuplicateProjectName,
} from "./project.middleware.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { requirePermission } from "../../middleware/permissionMiddleware.js";
import PERMISSIONS from "../../constants/permission.js";

const router = express.Router();

// Create Project
router.post(
  "/create-project",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_PROJECTS),
  createProjectValidation,
  validateMiddleware,
  checkDuplicateProjectName,
  createProjectHandler
);

// Get All Projects
router.get(
  "/get-all-projects",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_PROJECTS),
  getAllProjectsHandler,
);

// Search Project
router.get(
  "/search-projects",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_PROJECTS),
  searchProjectHandler,
);

// Get Projects by Batch
router.get(
  "/get-projects-by-batch/:batchId",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_PROJECTS),
  getProjectsByBatchHandler,
);

// Get Projects by Status
router.get(
  "/get-projects-by-status/:status",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_PROJECTS),
  getProjectsByStatusHandler,
);

// Get Project By ID
router.get(
  "/get-project/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_PROJECTS),
  checkProjectExists,
  getProjectByIdHandler,
);

// Update Project
router.put(
  "/update-project/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_PROJECTS),
  updateProjectValidation,
  validateMiddleware,
  checkProjectExists,
  updateProjectHandler,
);

// Delete Project
router.delete(
  "/delete-project/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_PROJECTS),
  checkProjectExists,
  deleteProjectHandler,
);

export default router;
