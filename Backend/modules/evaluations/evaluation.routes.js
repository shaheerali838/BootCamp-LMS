import express from "express";
import {
  createEvaluationHandler,
  getAllEvaluationsHandler,
  getEvaluationByIdHandler,
  updateEvaluationHandler,
  deleteEvaluationHandler,
  getEvaluationsByStudentHandler,
  getEvaluationsByProjectHandler,
  getEvaluationsByEvaluatorHandler,
} from "./evaluation.controller.js";
import { createEvaluationValidation, updateEvaluationValidation } from "./evaluation.validation.js";
import validateMiddleware from "../../middleware/validateMiddleware.js";
import { checkEvaluationExists } from "./evaluation.middleware.js";

const router = express.Router();

// Create Evaluation
router.post(
  "/",
  createEvaluationValidation,
  validateMiddleware,
  createEvaluationHandler
);

// Get All Evaluations
router.get("/", getAllEvaluationsHandler);

// Get Evaluations by Student
router.get("/student/:studentId", getEvaluationsByStudentHandler);

// Get Evaluations by Project
router.get("/project/:projectId", getEvaluationsByProjectHandler);

// Get Evaluations by Evaluator
router.get("/evaluator/:evaluatorId", getEvaluationsByEvaluatorHandler);

// Get Evaluation By ID
router.get("/:id", checkEvaluationExists, getEvaluationByIdHandler);

// Update Evaluation
router.put(
  "/:id",
  updateEvaluationValidation,
  validateMiddleware,
  checkEvaluationExists,
  updateEvaluationHandler
);

// Delete Evaluation
router.delete("/:id", checkEvaluationExists, deleteEvaluationHandler);

export default router;
