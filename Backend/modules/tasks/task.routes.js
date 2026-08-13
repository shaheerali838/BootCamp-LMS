import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { requirePermission } from "../../middleware/permissionMiddleware.js";
import PERMISSIONS from "../../constants/permission.js";
import validateMiddleware from "../../middleware/validateMiddleware.js";
import {
  createTaskValidation,
  updateTaskValidation,
} from "./task.validation.js";
import { isTaskExists } from "./task.middleware.js";

import {
  createTaskHandler,
  getTasksHandler,
  getTaskByIdHandler,
  updateTaskHandler,
  deleteTaskHandler,
  getTasksByStudentIdHandler,
  getTasksByTeamIdHandler,
  getTasksBySprintIdHandler,
} from "./task.controller.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  requirePermission(PERMISSIONS.CREATE_TASKS),
  createTaskValidation,
  validateMiddleware,
  createTaskHandler,
);

router.get(
  "/",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_TASKS),
  getTasksHandler,
);

router.get(
  "/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_TASKS),
  isTaskExists,
  getTaskByIdHandler,
);

router.put(
  "/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.UPDATE_TASKS),
  isTaskExists,
  updateTaskValidation,
  validateMiddleware,
  updateTaskHandler,
);

router.delete(
  "/:id",
  authMiddleware,
  requirePermission(PERMISSIONS.DELETE_TASKS),
  isTaskExists,
  deleteTaskHandler,
);

router.get(
  "/student/:studentId",
  authMiddleware,
  // Must use VIEW_TASKS because VIEW_STUDENTS does not exist in permission.js and will crash the app!
  requirePermission(PERMISSIONS.VIEW_TASKS),
  getTasksByStudentIdHandler,
);

router.get(
  "/team/:teamId",
  authMiddleware,
  // Same here, use VIEW_TASKS
  requirePermission(PERMISSIONS.VIEW_TASKS),
  getTasksByTeamIdHandler,
);

router.get(
  "/sprint/:sprintId",
  authMiddleware,
  // Same here, use VIEW_TASKS
  requirePermission(PERMISSIONS.VIEW_TASKS),
  getTasksBySprintIdHandler,
);

export default router;
