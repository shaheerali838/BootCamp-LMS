import express from "express";
import { login } from "./LoginController.js";
import { register } from "./RegisterController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { adminMiddleware } from "../../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/login", login);

router.post("/register", authMiddleware, adminMiddleware, register);

export default router;