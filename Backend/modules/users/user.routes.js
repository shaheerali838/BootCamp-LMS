import express from "express";
import {
  createUserHandler,
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler,
} from "./user.controller.js";
import { createUserValidation, updateUserValidation } from "./user.validation.js";
import validateMiddleware from "../middleware/validateMiddleware.js";

const router = express.Router();

// Create User
router.post("/", createUserValidation, validateMiddleware, createUserHandler);

// Get All Users
router.get("/", getAllUsersHandler);

// Get User By ID
router.get("/:id", getUserByIdHandler);

// Update User
router.put("/:id", updateUserValidation, validateMiddleware, updateUserHandler);

// Delete User
router.delete("/:id", deleteUserHandler);

export default router;
