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
  "/create-evaluation",
  createEvaluationValidation,
  validateMiddleware,
  createEvaluationHandler
);

// Get All Evaluations
router.get("/get-all-evaluations", getAllEvaluationsHandler);

// Get Evaluations by Student
router.get("/get-evaluations-by-student/:studentId", getEvaluationsByStudentHandler);

// Get Evaluations by Project
router.get("/get-evaluations-by-project/:projectId", getEvaluationsByProjectHandler);

// Get Evaluations by Evaluator
router.get("/get-evaluations-by-evaluator/:evaluatorId", getEvaluationsByEvaluatorHandler);

// Get Evaluation By ID
router.get("/get-evaluation/:id", checkEvaluationExists, getEvaluationByIdHandler);

// Update Evaluation
router.put(
  "/update-evaluation/:id",
  updateEvaluationValidation,
  validateMiddleware,
  checkEvaluationExists,
  updateEvaluationHandler
);

// Delete Evaluation
router.delete("/delete-evaluation/:id", checkEvaluationExists, deleteEvaluationHandler);

export default router;
