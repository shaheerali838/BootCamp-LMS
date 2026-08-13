import express from "express";
import { createStudent, getStudents } from "./student.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { requirePermission } from "../../middleware/permissionMiddleware.js";
import PERMISSIONS from "../../constants/permission.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_STUDENTS),
  createStudent,
);

router.get(
  "/",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_STUDENTS),
  getStudents,
);

router.get(
  "/getstudents",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_STUDENTS),
  getStudents,
);

export default router;

