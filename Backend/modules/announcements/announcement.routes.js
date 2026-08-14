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

router
  .route("/")
  .post(requirePermission(PERMISSIONS.CREATE_ANNOUNCEMENTS), createAnnouncement)
  .get(requirePermission(PERMISSIONS.VIEW_ANNOUNCEMENTS), getAllAnnouncements);

router
  .route("/:id")
  .get(requirePermission(PERMISSIONS.VIEW_ANNOUNCEMENTS), getAnnouncementById)
  .put(requirePermission(PERMISSIONS.UPDATE_ANNOUNCEMENTS), updateAnnouncement)
  .delete(
    requirePermission(PERMISSIONS.DELETE_ANNOUNCEMENTS),
    deleteAnnouncement,
  );

export default router;
