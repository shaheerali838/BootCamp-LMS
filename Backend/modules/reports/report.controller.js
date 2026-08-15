import {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
  getReportsByType,
  getReportsByDate,
  getReportsByGenerator,
} from "./report.service.js";

// Create Report
const createReportHandler = async (req, res) => {
  try {
    const report = await createReport(req.body);

    res.status(201).json({
      success: true,
      message: "Report created successfully",
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Reports
const getAllReportsHandler = async (req, res) => {
  try {
    const reports = await getAllReports();

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Report By ID
const getReportByIdHandler = async (req, res) => {
  try {
    const report = await getReportById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Report
const updateReportHandler = async (req, res) => {
  try {
    const report = await updateReport(req.params.id, req.body);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Report
const deleteReportHandler = async (req, res) => {
  try {
    const report = await deleteReport(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Reports by Type
const getReportsByTypeHandler = async (req, res) => {
  try {
    const { reportType } = req.params;
    const reports = await getReportsByType(reportType);

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Reports by Date
const getReportsByDateHandler = async (req, res) => {
  try {
    const { reportDate } = req.params;
    const reports = await getReportsByDate(reportDate);

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Reports by Generator
const getReportsByGeneratorHandler = async (req, res) => {
  try {
    const { generatedBy } = req.params;
    const reports = await getReportsByGenerator(generatedBy);

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createReportHandler,
  getAllReportsHandler,
  getReportByIdHandler,
  updateReportHandler,
  deleteReportHandler,
  getReportsByTypeHandler,
  getReportsByDateHandler,
  getReportsByGeneratorHandler,
};
