import express from "express";
import {
  createTeamHandler,
  getAllTeamsHandler,
  getTeamByIdHandler,
  updateTeamHandler,
  deleteTeamHandler,
  searchTeamHandler,
} from "./team.controller.js";
import { createTeamValidation, updateTeamValidation } from "./team.validation.js";
import validateMiddleware from "../middleware/validateMiddleware.js";
import { checkTeamExists, checkDuplicateTeamName } from "./team.middleware.js";

const router = express.Router();

// Create Team
router.post(
  "/",
  createTeamValidation,
  validateMiddleware,
  checkDuplicateTeamName,
  createTeamHandler
);

// Get All Teams
router.get("/", getAllTeamsHandler);

// Search Team
router.get("/search", searchTeamHandler);

// Get Team By ID
router.get("/:id", checkTeamExists, getTeamByIdHandler);

// Update Team
router.put(
  "/:id",
  updateTeamValidation,
  validateMiddleware,
  checkTeamExists,
  updateTeamHandler
);

// Delete Team
router.delete("/:id", checkTeamExists, deleteTeamHandler);

export default router;
