import express from "express";
import {
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
router.use(requirePermission(PERMISSIONS.MANAGE_SUPER_ADMINS));

router.post("/create-admin", createAdmin);
router.get("/get-all-admins", getAllAdmins);
router.get("/get-admin/:id", getAdminById);
router.put("/update-admin/:id", updateAdmin);
router.delete("/delete-admin/:id", deleteAdmin);

export default router;
