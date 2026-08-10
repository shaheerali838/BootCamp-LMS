import express from "express";
import {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from "./admin.controller.js";
import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("SUPER_ADMIN"));

router.route("/").post(createAdmin).get(getAllAdmins);

router.route("/:id").get(getAdminById).put(updateAdmin).delete(deleteAdmin);

export default router;
