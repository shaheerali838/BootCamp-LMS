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

router.route("/").post(createAdmin).get(getAllAdmins);

router.route("/:id").get(getAdminById).put(updateAdmin).delete(deleteAdmin);

export default router;
