import { body, param } from "express-validator";

export const createStudentValidation = [
  body("rollNumber")
    .trim()
    .notEmpty()
    .withMessage("Roll number is required"),

  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .toLowerCase(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required"),

  body("gender")
    .trim()
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),

  body("dateOfBirth")
    .notEmpty()
    .withMessage("Date of birth is required"),

  body("batchId")
    .trim()
    .notEmpty()
    .withMessage("Batch ID is required")
    .isMongoId()
    .withMessage("Invalid Batch ID format"),

  body("mentorId")
    .trim()
    .notEmpty()
    .withMessage("Mentor ID is required")
    .isMongoId()
    .withMessage("Invalid Mentor ID format"),
];

export const updateStudentValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid student ID format"),

  body("rollNumber")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Roll number cannot be empty"),

  body("firstName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("First name cannot be empty"),

  body("lastName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Last name cannot be empty"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .toLowerCase(),

  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  body("phoneNumber")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Phone number cannot be empty"),

  body("gender")
    .optional()
    .trim()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),

  body("dateOfBirth")
    .optional(),

  body("batchId")
    .optional()
    .isMongoId()
    .withMessage("Invalid Batch ID format"),

  body("mentorId")
    .optional()
    .isMongoId()
    .withMessage("Invalid Mentor ID format"),
];

export const updateStudentStatusValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid student ID format"),

  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["active", "inactive"])
    .withMessage("Status must be either 'active' or 'inactive'"),
];

export const studentIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid student ID format"),
];

export const batchIdParamValidation = [
  param("batchId")
    .isMongoId()
    .withMessage("Invalid batch ID format"),
];
