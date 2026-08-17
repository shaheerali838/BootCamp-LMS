import { body } from "express-validator";

export const createBatchValidator = [
  body("batchName").trim().notEmpty().withMessage("Batch name is required"),
  body("program").trim().notEmpty().withMessage("Program is required"),
  body("startDate").notEmpty().withMessage("Start date is required").isISO8601().withMessage("Valid start date is required"),
  body("endDate").notEmpty().withMessage("End date is required").isISO8601().withMessage("Valid end date is required")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
  body("status").optional().isIn(["active", "inactive"]).withMessage("Status must be active or inactive"),
];

export const updateBatchValidator = [
  body("startDate").optional().isISO8601().withMessage("Valid start date is required"),
  body("endDate").optional().isISO8601().withMessage("Valid end date is required")
    .custom((value, { req }) => {
      if (req.body.startDate && new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
  body("status").optional().isIn(["active", "inactive"]).withMessage("Status must be active or inactive"),
];
