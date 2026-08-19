import Evaluation from "../../model/evaluation.model.js";

// Create Evaluation
const createEvaluation = async (evaluationData) => {
  const evaluation = await Evaluation.create(evaluationData);
  return evaluation;
};

// Get All Evaluations
const getAllEvaluations = async () => {
  return await Evaluation.find()
    .populate("student", "firstName lastName email")
    .populate("project", "projectName description")
    .populate("evaluator", "firstName lastName email");
};

// Get Evaluation By ID
const getEvaluationById = async (id) => {
  return await Evaluation.findById(id)
    .populate("student", "firstName lastName email")
    .populate("project", "projectName description")
    .populate("evaluator", "firstName lastName email");
};

// Update Evaluation
const updateEvaluation = async (id, data) => {
  return await Evaluation.findByIdAndUpdate(
    id,
    data,
    {
      returnDocument: "after",
      runValidators: true,
    }
  )
    .populate("student", "firstName lastName email")
    .populate("project", "projectName description")
    .populate("evaluator", "firstName lastName email");
};

// Delete Evaluation
const deleteEvaluation = async (id) => {
  return await Evaluation.findByIdAndDelete(id);
};

// Get Evaluations by Student
const getEvaluationsByStudent = async (studentId) => {
  return await Evaluation.find({ student: studentId })
    .populate("student", "firstName lastName email")
    .populate("project", "projectName description")
    .populate("evaluator", "firstName lastName email");
};

// Get Evaluations by Project
const getEvaluationsByProject = async (projectId) => {
  return await Evaluation.find({ project: projectId })
    .populate("student", "firstName lastName email")
    .populate("project", "projectName description")
    .populate("evaluator", "firstName lastName email");
};

// Get Evaluations by Evaluator
const getEvaluationsByEvaluator = async (evaluatorId) => {
  return await Evaluation.find({ evaluator: evaluatorId })
    .populate("student", "firstName lastName email")
    .populate("project", "projectName description")
    .populate("evaluator", "firstName lastName email");
};

export {
  createEvaluation,
  getAllEvaluations,
  getEvaluationById,
  updateEvaluation,
  deleteEvaluation,
  getEvaluationsByStudent,
  getEvaluationsByProject,
  getEvaluationsByEvaluator,
};
