import { body } from "express-validator";

const createMilestoneValidation = [
  body("projectId")
    .notEmpty()
    .withMessage("Project ID is required")
    .isMongoId()
    .withMessage("Invalid Project ID"),

  body("milestoneName")
    .trim()
    .notEmpty()
    .withMessage("Milestone name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Milestone name must be between 3 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),

  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Invalid due date format"),

  body("status")
    .optional()
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Status must be Pending, In Progress, or Completed"),
];

const updateMilestoneValidation = [
  body("projectId")
    .optional()
    .isMongoId()
    .withMessage("Invalid Project ID"),

  body("milestoneName")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Milestone name must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid due date format"),

  body("status")
    .optional()
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Status must be Pending, In Progress, or Completed"),
];

export {
  createMilestoneValidation,
  updateMilestoneValidation,
};
