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
import { createProjectValidation, updateProjectValidation } from "./project.validation.js";
import validateMiddleware from "../middleware/validateMiddleware.js";
import { checkProjectExists, checkDuplicateProjectName } from "./project.middleware.js";

const router = express.Router();

// Create Project
router.post(
  "/",
  createProjectValidation,
  validateMiddleware,
  checkDuplicateProjectName,
  createProjectHandler
);

// Get All Projects
router.get("/", getAllProjectsHandler);

// Search Project
router.get("/search", searchProjectHandler);

// Get Projects by Batch
router.get("/batch/:batchId", getProjectsByBatchHandler);

// Get Projects by Status
router.get("/status/:status", getProjectsByStatusHandler);

// Get Project By ID
router.get("/:id", checkProjectExists, getProjectByIdHandler);

// Update Project
router.put(
  "/:id",
  updateProjectValidation,
  validateMiddleware,
  checkProjectExists,
  updateProjectHandler
);

// Delete Project
router.delete("/:id", checkProjectExists, deleteProjectHandler);

export default router;
