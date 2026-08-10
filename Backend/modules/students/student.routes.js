import express from "express";
import { createStudent } from "./student.controller.js";
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

export default router;
