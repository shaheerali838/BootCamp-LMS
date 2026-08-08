const express = require("express");
const router = express.Router();

const teamController = require("./team.controller");

const {
  createTeamValidation,
  updateTeamValidation,
} = require("./team.validation");

const validateMiddleware = require("../middleware/validateMiddleware");

const {
  checkTeamExists,
  checkDuplicateTeamName,
} = require("./team.middleware");

// Create Team
router.post(
  "/",
  createTeamValidation,
  validateMiddleware,
  checkDuplicateTeamName,
  teamController.createTeam
);

// Get All Teams
router.get("/", teamController.getAllTeams);

// Search Team
router.get("/search", teamController.searchTeam);

// Get Team By ID
router.get("/:id", checkTeamExists, teamController.getTeamById);

// Update Team
router.put(
  "/:id",
  updateTeamValidation,
  validateMiddleware,
  checkTeamExists,
  teamController.updateTeam
);

// Delete Team
router.delete("/:id", checkTeamExists, teamController.deleteTeam);

module.exports = router;