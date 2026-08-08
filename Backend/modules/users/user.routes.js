const express = require("express");
const router = express.Router();

const userController = require("./user.controller");
const {
  createUserValidation,
  updateUserValidation,
} = require("./user.validation");

const validateMiddleware = require("../middleware/validateMiddleware");

// Create User
router.post(
  "/",
  createUserValidation,
  validateMiddleware,
  userController.createUser
);

// Get All Users
router.get("/", userController.getAllUsers);

// Get User By ID
router.get("/:id", userController.getUserById);

// Update User
router.put(
  "/:id",
  updateUserValidation,
  validateMiddleware,
  userController.updateUser
);

// Delete User
router.delete("/:id", userController.deleteUser);

module.exports = router;
