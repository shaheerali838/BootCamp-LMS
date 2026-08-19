import { body } from "express-validator";

const createSprintValidation = [
  body("milestoneId")
    .optional(),

  body("projectId")
    .optional(),

  body("sprintName")
    .optional()
    .trim(),

  body("name")
    .optional()
    .trim(),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required"),

  body("endDate")
    .optional(),

  body("status")
    .optional(),
];

const updateSprintValidation = [
  body("milestoneId")
    .optional(),

  body("projectId")
    .optional(),

  body("sprintName")
    .optional()
    .trim(),

  body("name")
    .optional()
    .trim(),

  body("startDate")
    .optional(),

  body("endDate")
    .optional(),

  body("status")
    .optional(),
];

export {
  createSprintValidation,
  updateSprintValidation,
};
