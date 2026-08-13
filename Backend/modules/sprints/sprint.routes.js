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
import { createSprintValidation, updateSprintValidation } from "./sprint.validation.js";
import validateMiddleware from "../../middleware/validateMiddleware.js";
import { checkSprintExists, checkDuplicateSprintName } from "./sprint.middleware.js";

const router = express.Router();

// Create Sprint
router.post(
  "/",
  createSprintValidation,
  validateMiddleware,
  checkDuplicateSprintName,
  createSprintHandler
);

// Get All Sprints
router.get("/", getAllSprintsHandler);

// Search Sprint
router.get("/search", searchSprintHandler);

// Get Sprints by Milestone
router.get("/milestone/:milestoneId", getSprintsByMilestoneHandler);

// Get Sprints by Status
router.get("/status/:status", getSprintsByStatusHandler);

// Get Sprint By ID
router.get("/:id", checkSprintExists, getSprintByIdHandler);

// Update Sprint
router.put(
  "/:id",
  updateSprintValidation,
  validateMiddleware,
  checkSprintExists,
  updateSprintHandler
);

// Delete Sprint
router.delete("/:id", checkSprintExists, deleteSprintHandler);

export default router;
