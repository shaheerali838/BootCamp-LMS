import express from "express";
import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} from "./announcement.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { requirePermission } from "../../middleware/permissionMiddleware.js";
import PERMISSIONS from "../../constants/permission.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/create-announcement", requirePermission(PERMISSIONS.CREATE_ANNOUNCEMENTS), createAnnouncement);
router.get("/get-all-announcements", requirePermission(PERMISSIONS.VIEW_ANNOUNCEMENTS), getAllAnnouncements);

router.get("/get-announcement/:id", requirePermission(PERMISSIONS.VIEW_ANNOUNCEMENTS), getAnnouncementById);
router.put("/update-announcement/:id", requirePermission(PERMISSIONS.UPDATE_ANNOUNCEMENTS), updateAnnouncement);
router.delete("/delete-announcement/:id", requirePermission(PERMISSIONS.DELETE_ANNOUNCEMENTS), deleteAnnouncement);

export default router;
