import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportType: {
      type: String,
      required: true,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    reportDate: {
      type: Date,
      required: true,
    },
    reportFile: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
