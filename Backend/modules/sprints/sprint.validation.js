import { body } from "express-validator";

const createSprintValidation = [
  body("milestoneId")
    .notEmpty()
    .withMessage("Milestone ID is required")
    .isMongoId()
    .withMessage("Invalid Milestone ID"),

  body("sprintName")
    .trim()
    .notEmpty()
    .withMessage("Sprint name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Sprint name must be between 3 and 100 characters"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Invalid start date format"),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("Invalid end date format"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive"),
];

const updateSprintValidation = [
  body("milestoneId")
    .optional()
    .isMongoId()
    .withMessage("Invalid Milestone ID"),

  body("sprintName")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Sprint name must be between 3 and 100 characters"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid start date format"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid end date format"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive"),
];

export {
  createSprintValidation,
  updateSprintValidation,
};
