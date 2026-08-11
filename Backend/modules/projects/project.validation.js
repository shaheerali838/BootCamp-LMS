import { body } from "express-validator";

const createProjectValidation = [
  body("projectName")
    .trim()
    .notEmpty()
    .withMessage("Project name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Project name must be between 3 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Invalid start date format"),

  body("deadline")
    .notEmpty()
    .withMessage("Deadline is required")
    .isISO8601()
    .withMessage("Invalid deadline format"),

  body("batch")
    .notEmpty()
    .withMessage("Batch ID is required")
    .isMongoId()
    .withMessage("Invalid Batch ID"),

  body("status")
    .optional()
    .isIn(["pending", "in progress", "completed"])
    .withMessage("Status must be pending, in progress, or completed"),

  body("createdBy")
    .notEmpty()
    .withMessage("Created by is required")
    .isMongoId()
    .withMessage("Invalid Admin ID"),
];

const updateProjectValidation = [
  body("projectName")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Project name must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid start date format"),

  body("deadline")
    .optional()
    .isISO8601()
    .withMessage("Invalid deadline format"),

  body("batch")
    .optional()
    .isMongoId()
    .withMessage("Invalid Batch ID"),

  body("status")
    .optional()
    .isIn(["pending", "in progress", "completed"])
    .withMessage("Status must be pending, in progress, or completed"),

  body("createdBy")
    .optional()
    .isMongoId()
    .withMessage("Invalid Admin ID"),
];

export {
  createProjectValidation,
  updateProjectValidation,
};
