import { body, param } from "express-validator";
import mongoose from "mongoose";

export const createStudentValidation = [
  body("rollNumber").trim().notEmpty().withMessage("Roll number is required"),
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("phoneNumber").trim().notEmpty().withMessage("Phone number is required"),
  body("gender").trim().notEmpty().withMessage("Gender is required"),
  body("dateOfBirth")
    .notEmpty()
    .withMessage("Date of birth is required"),
  body("batchId")
    .notEmpty()
    .withMessage("Batch ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Batch ID"),
  body("mentorId")
    .notEmpty()
    .withMessage("Mentor ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Mentor ID"),
];

// Alias for backwards compatibility
export const createStudentValidator = createStudentValidation;

export const updateStudentValidation = [
  param("id")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Student ID format"),
  body("rollNumber").optional().trim().notEmpty().withMessage("Roll number cannot be empty"),
  body("firstName").optional().trim().notEmpty().withMessage("First name cannot be empty"),
  body("lastName").optional().trim().notEmpty().withMessage("Last name cannot be empty"),
  body("email").optional().trim().isEmail().withMessage("Valid email is required"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("phoneNumber").optional().trim().notEmpty().withMessage("Phone number cannot be empty"),
  body("gender").optional().trim().notEmpty().withMessage("Gender cannot be empty"),
  body("dateOfBirth").optional(),
  body("batchId")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Batch ID"),
  body("mentorId")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Mentor ID"),
];

// Alias for backwards compatibility
export const updateStudentValidator = updateStudentValidation;

export const updateStudentStatusValidation = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Student ID"),
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["active", "inactive"])
    .withMessage("Status must be either 'active' or 'inactive'"),
];

export const studentIdValidation = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Student ID"),
];

export const batchIdParamValidation = [
  param("batchId")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Batch ID"),
];
