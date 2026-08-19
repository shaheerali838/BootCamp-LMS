import express from "express";
import {
  getAllAttendance,
  getMyAttendance,
  getStudentAttendanceById,
  markAttendance,
  getAttendanceOverviewStats,
  deleteAttendance,
} from "./attendance.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { requirePermission } from "../../middleware/permissionMiddleware.js";
import PERMISSIONS from "../../constants/permission.js";

const router = express.Router();

router.use(authMiddleware);

// ── Student Self Attendance Endpoint ───────────────────────
router.get("/my-attendance", getMyAttendance);

// ── Admin / Mentor Endpoints ───────────────────────────────
router.get("/overview-stats",          requirePermission(PERMISSIONS.VIEW_ATTENDANCE), getAttendanceOverviewStats);
router.get("/student/:studentId",     requirePermission(PERMISSIONS.VIEW_ATTENDANCE), getStudentAttendanceById);
router.get("/",                       requirePermission(PERMISSIONS.VIEW_ATTENDANCE), getAllAttendance);
router.post("/mark",                  requirePermission(PERMISSIONS.MARK_ATTENDANCE), markAttendance);
router.delete("/:id",                 requirePermission(PERMISSIONS.MARK_ATTENDANCE), deleteAttendance);

export default router;
