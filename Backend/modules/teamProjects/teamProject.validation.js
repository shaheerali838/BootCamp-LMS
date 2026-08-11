import { body } from "express-validator";

const assignProjectValidation = [
  body("teamId")
    .notEmpty()
    .withMessage("Team ID is required")
    .isMongoId()
    .withMessage("Invalid Team ID"),

  body("projectId")
    .notEmpty()
    .withMessage("Project ID is required")
    .isMongoId()
    .withMessage("Invalid Project ID"),

  body("assignedDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),
];

const updateTeamProjectValidation = [
  body("teamId")
    .optional()
    .isMongoId()
    .withMessage("Invalid Team ID"),

  body("projectId")
    .optional()
    .isMongoId()
    .withMessage("Invalid Project ID"),

  body("assignedDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),
];

export {
  assignProjectValidation,
  updateTeamProjectValidation,
};
