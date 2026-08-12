import { body } from "express-validator";

const createEvaluationValidation = [
  body("student")
    .notEmpty()
    .withMessage("Student ID is required")
    .isMongoId()
    .withMessage("Invalid Student ID"),

  body("project")
    .notEmpty()
    .withMessage("Project ID is required")
    .isMongoId()
    .withMessage("Invalid Project ID"),

  body("evaluator")
    .notEmpty()
    .withMessage("Evaluator ID is required")
    .isMongoId()
    .withMessage("Invalid Evaluator ID"),

  body("attendance_percentage")
    .notEmpty()
    .withMessage("Attendance percentage is required")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Attendance percentage must be between 0 and 100"),

  body("task_score")
    .notEmpty()
    .withMessage("Task score is required")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Task score must be between 0 and 100"),

  body("project_score")
    .notEmpty()
    .withMessage("Project score is required")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Project score must be between 0 and 100"),

  body("behavior_score")
    .notEmpty()
    .withMessage("Behavior score is required")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Behavior score must be between 0 and 100"),

  body("overall_performance")
    .notEmpty()
    .withMessage("Overall performance is required")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Overall performance must be between 0 and 100"),

  body("remarks")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Remarks must not exceed 500 characters"),
];

const updateEvaluationValidation = [
  body("student")
    .optional()
    .isMongoId()
    .withMessage("Invalid Student ID"),

  body("project")
    .optional()
    .isMongoId()
    .withMessage("Invalid Project ID"),

  body("evaluator")
    .optional()
    .isMongoId()
    .withMessage("Invalid Evaluator ID"),

  body("attendance_percentage")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Attendance percentage must be between 0 and 100"),

  body("task_score")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Task score must be between 0 and 100"),

  body("project_score")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Project score must be between 0 and 100"),

  body("behavior_score")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Behavior score must be between 0 and 100"),

  body("overall_performance")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Overall performance must be between 0 and 100"),

  body("remarks")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Remarks must not exceed 500 characters"),
];

export {
  createEvaluationValidation,
  updateEvaluationValidation,
};
