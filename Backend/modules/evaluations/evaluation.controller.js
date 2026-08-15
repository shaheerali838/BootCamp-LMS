import {
  createEvaluation,
  getAllEvaluations,
  getEvaluationById,
  updateEvaluation,
  deleteEvaluation,
  getEvaluationsByStudent,
  getEvaluationsByProject,
  getEvaluationsByEvaluator,
} from "./evaluation.service.js";

// Create Evaluation
const createEvaluationHandler = async (req, res) => {
  try {
    const evaluation = await createEvaluation(req.body);

    res.status(201).json({
      success: true,
      message: "Evaluation created successfully",
      data: evaluation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Evaluations
const getAllEvaluationsHandler = async (req, res) => {
  try {
    const evaluations = await getAllEvaluations();

    res.status(200).json({
      success: true,
      count: evaluations.length,
      data: evaluations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Evaluation By ID
const getEvaluationByIdHandler = async (req, res) => {
  try {
    const evaluation = await getEvaluationById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: "Evaluation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Evaluation
const updateEvaluationHandler = async (req, res) => {
  try {
    const evaluation = await updateEvaluation(req.params.id, req.body);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: "Evaluation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Evaluation updated successfully",
      data: evaluation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Evaluation
const deleteEvaluationHandler = async (req, res) => {
  try {
    const evaluation = await deleteEvaluation(req.params.id);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: "Evaluation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Evaluation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Evaluations by Student
const getEvaluationsByStudentHandler = async (req, res) => {
  try {
    const { studentId } = req.params;
    const evaluations = await getEvaluationsByStudent(studentId);

    res.status(200).json({
      success: true,
      count: evaluations.length,
      data: evaluations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Evaluations by Project
const getEvaluationsByProjectHandler = async (req, res) => {
  try {
    const { projectId } = req.params;
    const evaluations = await getEvaluationsByProject(projectId);

    res.status(200).json({
      success: true,
      count: evaluations.length,
      data: evaluations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Evaluations by Evaluator
const getEvaluationsByEvaluatorHandler = async (req, res) => {
  try {
    const { evaluatorId } = req.params;
    const evaluations = await getEvaluationsByEvaluator(evaluatorId);

    res.status(200).json({
      success: true,
      count: evaluations.length,
      data: evaluations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createEvaluationHandler,
  getAllEvaluationsHandler,
  getEvaluationByIdHandler,
  updateEvaluationHandler,
  deleteEvaluationHandler,
  getEvaluationsByStudentHandler,
  getEvaluationsByProjectHandler,
  getEvaluationsByEvaluatorHandler,
};
