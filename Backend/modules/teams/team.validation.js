import { body } from "express-validator";

const createTeamValidation = [
  body("teamName")
    .trim()
    .notEmpty()
    .withMessage("Team name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Team name must be between 3 and 50 characters"),

  body("teamCode")
    .trim()
    .notEmpty()
    .withMessage("Team code is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Team code must be between 3 and 20 characters"),

  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("maxMembers")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Max members must be between 1 and 20"),

  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be Active or Inactive"),
];

const updateTeamValidation = [
  body("teamName")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Team name must be between 3 and 50 characters"),

  body("teamCode")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Team code must be between 3 and 20 characters"),

  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("maxMembers")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Max members must be between 1 and 20"),

  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be Active or Inactive"),
];

export {
  createTeamValidation,
  updateTeamValidation,
};
