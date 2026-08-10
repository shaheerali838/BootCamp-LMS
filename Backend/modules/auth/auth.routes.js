import express from "express";
import {
    login,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
    changePassword,
} from "./LoginController.js";
import { register } from "./RegisterController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { adminMiddleware } from "../../middleware/adminMiddleware.js";
import { validate } from "../../middleware/validate.js";
import {
    loginValidator,
    changePasswordValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
} from "./authValidator.js";

const router = express.Router();

router.post("/login", loginValidator, validate, login);

router.post("/logout", logout);

router.post("/register", authMiddleware, adminMiddleware, register);

router.post("/refresh-token", refreshToken);

router.post("/forgot-password", forgotPasswordValidator, validate, forgotPassword);

router.post("/reset-password", resetPasswordValidator, validate, resetPassword);

router.post("/change-password", authMiddleware, changePasswordValidator, validate, changePassword);

export default router;