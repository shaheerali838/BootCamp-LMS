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
  "/create-report",
  createReportValidation,
  validateMiddleware,
  createReportHandler
);

// Get All Reports
router.get("/get-all-reports", getAllReportsHandler);

// Get Reports by Type
router.get("/get-reports-by-type/:reportType", getReportsByTypeHandler);

// Get Reports by Date
router.get("/get-reports-by-date/:reportDate", getReportsByDateHandler);

// Get Reports by Generator
router.get("/get-reports-by-generator/:generatedBy", getReportsByGeneratorHandler);

// Get Report By ID
router.get("/get-report/:id", checkReportExists, getReportByIdHandler);

// Update Report
router.put(
  "/update-report/:id",
  updateReportValidation,
  validateMiddleware,
  checkReportExists,
  updateReportHandler
);

// Delete Report
router.delete("/delete-report/:id", checkReportExists, deleteReportHandler);

export default router;
