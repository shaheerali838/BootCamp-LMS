import { body } from "express-validator";

const createTaskValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),
  body("assignedStudentId")
    .notEmpty()
    .withMessage("Assigned Student ID is required")
    .isMongoId()
    .withMessage("Invalid Assigned Student ID"),
  body("assignedTeamId")
    .notEmpty()
    .withMessage("Assigned Team ID is required")
    .isMongoId()
    .withMessage("Invalid Assigned Team ID"),
  body("sprintId")
    .notEmpty()
    .withMessage("Sprint ID is required")
    .isMongoId()
    .withMessage("Invalid Sprint ID"),
  body("priority")
    .notEmpty()
    .withMessage("Priority is required")
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
  body("status")
    .optional()
    .isIn(["todo", "in progress", "done"])
    .withMessage("Status must be todo, in progress, or done"),
  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Invalid due date format"),
];

const updateTaskValidation = [
  body("title")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),
  body("assignedStudentId")
    .optional()
    .isMongoId()
    .withMessage("Invalid Assigned Student ID"),
  body("assignedTeamId")
    .optional()
    .isMongoId()
    .withMessage("Invalid Assigned Team ID"),
  body("sprintId").optional().isMongoId().withMessage("Invalid Sprint ID"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
  body("status")
    .optional()
    .isIn(["todo", "in progress", "done"])
    .withMessage("Status must be todo, in progress, or done"),
  body("dueDate").optional().isISO8601().withMessage("Invalid due date format"),
];

export { createTaskValidation, updateTaskValidation };
