import Report from "../../model/report.model.js";

// Create Report
const createReport = async (reportData) => {
  const report = await Report.create(reportData);
  return report;
};

// Get All Reports
const getAllReports = async () => {
  return await Report.find().populate(
    "generatedBy",
    "firstName lastName email",
  );
};

// Get Report By ID
const getReportById = async (id) => {
  return await Report.findById(id).populate(
    "generatedBy",
    "firstName lastName email",
  );
};

// Update Report
const updateReport = async (id, data) => {
  return await Report.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("generatedBy", "firstName lastName email");
};

// Delete Report
const deleteReport = async (id) => {
  return await Report.findByIdAndDelete(id);
};

// Get Reports by Type
const getReportsByType = async (reportType) => {
  return await Report.find({ reportType }).populate(
    "generatedBy",
    "firstName lastName email",
  );
};

// Get Reports by Date
const getReportsByDate = async (reportDate) => {
  return await Report.find({ reportDate }).populate(
    "generatedBy",
    "firstName lastName email",
  );
};

// Get Reports by Generator
const getReportsByGenerator = async (generatedBy) => {
  return await Report.find({ generatedBy }).populate(
    "generatedBy",
    "firstName lastName email",
  );
};

export {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
  getReportsByType,
  getReportsByDate,
  getReportsByGenerator,
};
