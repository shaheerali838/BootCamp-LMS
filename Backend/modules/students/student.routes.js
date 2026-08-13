import express from "express";
import {
  createStudent,
  getStudents,
  getStudentById,
  getStudentsByBatch,
  updateStudent,
  updateStudentStatus,
  deleteStudent,
} from "./student.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { requirePermission } from "../../middleware/permissionMiddleware.js";
import PERMISSIONS from "../../constants/permission.js";

const router = express.Router();

// 1. Create a new Student

router.post(
  "/",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_STUDENTS),
  createStudent
);

// 2. Get All Students (With Pagination & Search)

router.get(
  "/",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_STUDENTS),
  getStudents
);

// 3. Get All Students in a Specific Batch

router.get(
  "/batch/:batchId",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_STUDENTS),
  getStudentsByBatch
);

// 4. Get Single Student by ID

router.get(
  "/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_STUDENTS),
  getStudentById
);

// 5. Update Student details

router.put(
  "/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_STUDENTS),
  updateStudent
);

// 6. Update Student Status (Active / Inactive)

router.patch(
  "/:id/status",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_STUDENTS),
  updateStudentStatus
);

// 7. Delete Student

router.delete(
  "/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_STUDENTS),
  deleteStudent
);

export default router;
