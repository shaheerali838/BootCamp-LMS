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
import { createMilestoneValidation, updateMilestoneValidation } from "./milestone.validation.js";
import validateMiddleware from "../../middleware/validateMiddleware.js";
import { checkMilestoneExists, checkDuplicateMilestoneName } from "./milestone.middleware.js";

const router = express.Router();

// Create Milestone
router.post(
  "/",
  createMilestoneValidation,
  validateMiddleware,
  checkDuplicateMilestoneName,
  createMilestoneHandler
);

// Get All Milestones
router.get("/", getAllMilestonesHandler);

// Search Milestone
router.get("/search", searchMilestoneHandler);

// Get Milestones by Project
router.get("/project/:projectId", getMilestonesByProjectHandler);

// Get Milestones by Status
router.get("/status/:status", getMilestonesByStatusHandler);

// Get Milestone By ID
router.get("/:id", checkMilestoneExists, getMilestoneByIdHandler);

// Update Milestone
router.put(
  "/:id",
  updateMilestoneValidation,
  validateMiddleware,
  checkMilestoneExists,
  updateMilestoneHandler
);

// Delete Milestone
router.delete("/:id", checkMilestoneExists, deleteMilestoneHandler);

export default router;
