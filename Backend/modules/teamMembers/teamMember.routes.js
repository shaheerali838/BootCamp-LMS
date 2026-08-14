import express from "express";
import {
  addMemberHandler,
  getTeamMembersHandler,
  getMemberByIdHandler,
  updateMemberHandler,
  removeMemberHandler,
  removeMemberByTeamAndStudentHandler,
} from "./teamMember.controller.js";
import {
  addMemberValidation,
  updateMemberValidation,
} from "./teamMember.validation.js";
import validateMiddleware from "../../middleware/validateMiddleware.js";
import {
  checkTeamMemberExists,
  checkDuplicateMember,
} from "./teamMember.middleware.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { requirePermission } from "../../middleware/permissionMiddleware.js";
import PERMISSIONS from "../../constants/permission.js";

const router = express.Router();

// Add Member to Team
router.post(
  "/add-member",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_TEAMS),
  addMemberValidation,
  validateMiddleware,
  checkDuplicateMember,
  addMemberHandler,
);

// Get All Members of a Team
router.get(
  "/get-members-by-team/:teamId",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_TEAMS),
  getTeamMembersHandler,
);

// Get Member By ID
router.get(
  "/get-member/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_TEAMS),
  checkTeamMemberExists,
  getMemberByIdHandler,
);

// Update Member
router.put(
  "/update-member/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_TEAMS),
  updateMemberValidation,
  validateMiddleware,
  checkTeamMemberExists,
  updateMemberHandler,
);

// Remove Member from Team
router.delete(
  "/remove-member/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_TEAMS),
  checkTeamMemberExists,
  removeMemberHandler,
);

// Remove Member by Team and Student ID
router.delete(
  "/remove-specific-member/team/:teamId/student/:studentId",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_TEAMS),
  removeMemberByTeamAndStudentHandler,
);
export default router;
