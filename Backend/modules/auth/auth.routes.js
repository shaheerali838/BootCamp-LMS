import express from "express";
import {
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  register,
  getProfile,
  updateProfile,
} from "./auth.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { adminMiddleware } from "../../middleware/adminMiddleware.js";
import { validate } from "../../middleware/validate.js";
import {
  loginValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  registerValidator,
} from "./auth.validation.js";

import { uploadResource } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/login", loginValidator, validate, login);

router.post("/logout", logout);

router.post(
  "/register",
  authMiddleware,
  adminMiddleware,
  registerValidator,
  validate,
  register
);

router.post("/refresh-token", refreshToken);

// ================= PASSWORD MANAGEMENT ROUTES =================
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validate,
  forgotPassword
);

router.post("/reset-password", resetPasswordValidator, validate, resetPassword);

// Support both POST and PUT for change-password
router.post(
  "/change-password",
  authMiddleware,
  changePasswordValidator,
  validate,
  changePassword
);

router.put(
  "/change-password",
  authMiddleware,
  changePasswordValidator,
  validate,
  changePassword
);
// ==============================================================

// ================= PROFILE ROUTES (ADDED) =================
// Get currently authenticated profile (Super Admin, Admin, Student)
router.get("/profile", authMiddleware, getProfile);

// Update profile details (including Cloudinary photo upload)
router.put("/profile", authMiddleware, uploadResource.single("profilePicture"), updateProfile);
// ==========================================================

export default router;
