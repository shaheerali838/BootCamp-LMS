import express from "express";
import {
  getEligibleMentors,
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from "./admin.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { requirePermission } from "../../middleware/permissionMiddleware.js";
import PERMISSIONS from "../../constants/permission.js";

const router = express.Router();

router.use(authMiddleware);

// 1. Get Eligible Mentors (Authorized for SUPER_ADMIN and ADMIN with VIEW_MENTORS permission)
router.get("/get-mentors", requirePermission(PERMISSIONS.VIEW_MENTORS), getEligibleMentors);
router.get("/mentors", requirePermission(PERMISSIONS.VIEW_MENTORS), getEligibleMentors);

// 2. Full Admin Management (SUPER_ADMIN only with MANAGE_SUPER_ADMINS permission)
router.post("/create-admin", requirePermission(PERMISSIONS.MANAGE_SUPER_ADMINS), createAdmin);
router.get("/get-all-admins", requirePermission(PERMISSIONS.MANAGE_SUPER_ADMINS), getAllAdmins);
router.get("/get-admin/:id", requirePermission(PERMISSIONS.MANAGE_SUPER_ADMINS), getAdminById);
router.put("/update-admin/:id", requirePermission(PERMISSIONS.MANAGE_SUPER_ADMINS), updateAdmin);
router.delete("/delete-admin/:id", requirePermission(PERMISSIONS.MANAGE_SUPER_ADMINS), deleteAdmin);

export default router;
