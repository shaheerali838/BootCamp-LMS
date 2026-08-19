import { body } from "express-validator";

const createMilestoneValidation = [
  body("projectId")
    .notEmpty()
    .withMessage("Project ID is required"),

  body("milestoneName")
    .optional()
    .trim(),

  body("title")
    .optional()
    .trim(),

  body("description")
    .optional()
    .trim(),

  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required"),

  body("status")
    .optional(),
];

const updateMilestoneValidation = [
  body("projectId")
    .optional(),

  body("milestoneName")
    .optional()
    .trim(),

  body("title")
    .optional()
    .trim(),

  body("description")
    .optional()
    .trim(),

  body("dueDate")
    .optional(),

  body("status")
    .optional(),
];

export {
  createMilestoneValidation,
  updateMilestoneValidation,
};
