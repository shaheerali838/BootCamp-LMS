import { body } from "express-validator";

export const registerValidator = [
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
        .isEmail()
        .withMessage("Valid email is required"),

    body("phoneNumber")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required"),

    body("gender")
        .trim()
        .notEmpty()
        .withMessage("Gender is required"),

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