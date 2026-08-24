import { body } from "express-validator";

export const loginValidator = [
    body().custom((value, { req }) => {
        const id = req.body?.email || req.body?.rollNumber || req.body?.identifier;
        if (!id || !String(id).trim()) {
            throw new Error("Email or Roll number is required");
        }
        return true;
    }),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];

export const changePasswordValidator = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),

    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters"),
];

export const forgotPasswordValidator = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Valid email is required"),
];

export const resetPasswordValidator = [
    body("token")
        .notEmpty()
        .withMessage("Reset token is required"),

    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters"),
];


