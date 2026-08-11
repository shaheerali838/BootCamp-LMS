import express from "express";
import {
  addMemberHandler,
  getTeamMembersHandler,
  getMemberByIdHandler,
  updateMemberHandler,
  removeMemberHandler,
  removeMemberByTeamAndStudentHandler,
} from "./teamMember.controller.js";
import { addMemberValidation, updateMemberValidation } from "./teamMember.validation.js";
import validateMiddleware from "../middleware/validateMiddleware.js";
import { checkTeamMemberExists, checkDuplicateMember } from "./teamMember.middleware.js";

const router = express.Router();

// Add Member to Team
router.post(
  "/",
  addMemberValidation,
  validateMiddleware,
  checkDuplicateMember,
  addMemberHandler
);

// Get All Members of a Team
router.get("/team/:teamId", getTeamMembersHandler);

// Get Member By ID
router.get("/:id", checkTeamMemberExists, getMemberByIdHandler);

// Update Member
router.put(
  "/:id",
  updateMemberValidation,
  validateMiddleware,
  checkTeamMemberExists,
  updateMemberHandler
);

// Remove Member from Team
router.delete("/:id", checkTeamMemberExists, removeMemberHandler);

// Remove Member by Team and Student ID
router.delete("/team/:teamId/student/:studentId", removeMemberByTeamAndStudentHandler);

export default router;
