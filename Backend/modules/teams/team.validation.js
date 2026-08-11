import { body } from "express-validator";

const createTeamValidation = [
  body("teamName")
    .trim()
    .notEmpty()
    .withMessage("Team name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Team name must be between 3 and 50 characters"),

  body("batchId")
    .notEmpty()
    .withMessage("Batch ID is required")
    .isMongoId()
    .withMessage("Invalid Batch ID"),

  body("mentor")
    .notEmpty()
    .withMessage("Mentor ID is required")
    .isMongoId()
    .withMessage("Invalid Mentor ID"),

  body("teamLead")
    .notEmpty()
    .withMessage("Team Lead ID is required")
    .isMongoId()
    .withMessage("Invalid Team Lead ID"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive"),
];

const updateTeamValidation = [
  body("teamName")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Team name must be between 3 and 50 characters"),

  body("batchId")
    .optional()
    .isMongoId()
    .withMessage("Invalid Batch ID"),

  body("mentor")
    .optional()
    .isMongoId()
    .withMessage("Invalid Mentor ID"),

  body("teamLead")
    .optional()
    .isMongoId()
    .withMessage("Invalid Team Lead ID"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive"),
];

export {
  createTeamValidation,
  updateTeamValidation,
};
