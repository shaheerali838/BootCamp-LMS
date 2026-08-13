import { body } from "express-validator";
import mongoose from "mongoose";

export const createStudentValidator = [
  body("rollNumber").trim().notEmpty().withMessage("Roll number is required"),
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("phoneNumber").trim().notEmpty().withMessage("Phone number is required"),
  body("gender").trim().notEmpty().withMessage("Gender is required"),
  body("dateOfBirth").notEmpty().withMessage("Date of birth is required").isISO8601().withMessage("Valid date is required"),
  body("batchId")
    .notEmpty().withMessage("Batch ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Batch ID"),
  body("mentorId")
    .notEmpty().withMessage("Mentor ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Mentor ID"),
];

export const updateStudentValidator = [
  body("email").optional().trim().isEmail().withMessage("Valid email is required"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("batchId")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Batch ID"),
  body("mentorId")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Mentor ID"),
];
