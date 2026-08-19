import express from "express";
import {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
  getAllCategories,
  createCategory,
  deleteCategory,
} from "./resource.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { requirePermission } from "../../middleware/permissionMiddleware.js";
import { uploadResource } from "../../middleware/uploadMiddleware.js";
import PERMISSIONS from "../../constants/permission.js";

const router = express.Router();

router.use(authMiddleware);

// ── Resources ──────────────────────────────────────────────
router.get("/get-all-resources",   requirePermission(PERMISSIONS.VIEW_RESOURCES),   getAllResources);
router.get("/get-resource/:id",    requirePermission(PERMISSIONS.VIEW_RESOURCES),   getResourceById);
router.post("/create-resource",    requirePermission(PERMISSIONS.MANAGE_RESOURCES), uploadResource.single("file"), createResource);
router.put("/update-resource/:id", requirePermission(PERMISSIONS.MANAGE_RESOURCES), uploadResource.single("file"), updateResource);
router.delete("/delete-resource/:id", requirePermission(PERMISSIONS.MANAGE_RESOURCES), deleteResource);

// ── Resource Categories ─────────────────────────────────────
router.get("/categories",              requirePermission(PERMISSIONS.VIEW_RESOURCES),   getAllCategories);
router.post("/categories/create",      requirePermission(PERMISSIONS.MANAGE_RESOURCES), createCategory);
router.delete("/categories/:id",       requirePermission(PERMISSIONS.MANAGE_RESOURCES), deleteCategory);

export default router;
