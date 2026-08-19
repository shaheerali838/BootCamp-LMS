import { body } from "express-validator";

const createProjectValidation = [
  body("projectName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Project name must be between 2 and 150 characters"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Project name must be between 2 and 150 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 5, max: 2000 })
    .withMessage("Description must be at least 5 characters"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required"),

  body("deadline")
    .notEmpty()
    .withMessage("Deadline is required"),

  body("batch")
    .optional(),

  body("teamId")
    .optional(),

  body("status")
    .optional(),

  body("createdBy")
    .optional(),
];

const updateProjectValidation = [
  body("projectName")
    .optional()
    .trim(),

  body("name")
    .optional()
    .trim(),

  body("description")
    .optional()
    .trim(),

  body("startDate")
    .optional(),

  body("deadline")
    .optional(),

  body("batch")
    .optional(),

  body("teamId")
    .optional(),

  body("status")
    .optional(),

  body("createdBy")
    .optional(),
];

export {
  createProjectValidation,
  updateProjectValidation,
};
