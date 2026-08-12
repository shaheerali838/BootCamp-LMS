import Evaluation from "../../model/evaluation.model.js";

// Check Evaluation Exists
const checkEvaluationExists = async (req, res, next) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: "Evaluation not found",
      });
    }

    req.evaluation = evaluation;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  checkEvaluationExists,
};
