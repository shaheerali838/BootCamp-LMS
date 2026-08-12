import express from "express";
import {
  createReportHandler,
  getAllReportsHandler,
  getReportByIdHandler,
  updateReportHandler,
  deleteReportHandler,
  getReportsByTypeHandler,
  getReportsByDateHandler,
  getReportsByGeneratorHandler,
} from "./report.controller.js";
import { createReportValidation, updateReportValidation } from "./report.validation.js";
import validateMiddleware from "../../middleware/validateMiddleware.js";
import { checkReportExists } from "./report.middleware.js";

const router = express.Router();

// Create Report
router.post(
  "/",
  createReportValidation,
  validateMiddleware,
  createReportHandler
);

// Get All Reports
router.get("/", getAllReportsHandler);

// Get Reports by Type
router.get("/type/:reportType", getReportsByTypeHandler);

// Get Reports by Date
router.get("/date/:reportDate", getReportsByDateHandler);

// Get Reports by Generator
router.get("/generator/:generatedBy", getReportsByGeneratorHandler);

// Get Report By ID
router.get("/:id", checkReportExists, getReportByIdHandler);

// Update Report
router.put(
  "/:id",
  updateReportValidation,
  validateMiddleware,
  checkReportExists,
  updateReportHandler
);

// Delete Report
router.delete("/:id", checkReportExists, deleteReportHandler);

export default router;
