import { body } from "express-validator";

const addMemberValidation = [
  body("teamId")
    .notEmpty()
    .withMessage("Team ID is required")
    .isMongoId()
    .withMessage("Invalid Team ID"),

  body("studentId")
    .notEmpty()
    .withMessage("Student ID is required")
    .isMongoId()
    .withMessage("Invalid Student ID"),

  body("joinedAt")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),
];

const updateMemberValidation = [
  body("teamId")
    .optional()
    .isMongoId()
    .withMessage("Invalid Team ID"),

  body("studentId")
    .optional()
    .isMongoId()
    .withMessage("Invalid Student ID"),

  body("joinedAt")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),
];

export {
  addMemberValidation,
  updateMemberValidation,
};
