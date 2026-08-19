import { body } from "express-validator";

const createTaskValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .optional()
    .trim(),

  body("assignedStudentId")
    .optional(),

  body("assignedTeamId")
    .optional(),

  body("sprintId")
    .optional(),

  body("priority")
    .optional(),

  body("status")
    .optional(),

  body("dueDate")
    .optional(),
];

const updateTaskValidation = [
  body("title")
    .optional()
    .trim(),

  body("description")
    .optional()
    .trim(),

  body("assignedStudentId")
    .optional(),

  body("assignedTeamId")
    .optional(),

  body("sprintId")
    .optional(),

  body("priority")
    .optional(),

  body("status")
    .optional(),

  body("dueDate")
    .optional(),
];

export { createTaskValidation, updateTaskValidation };
