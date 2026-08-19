import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResourceCategory",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
      default: "PDF",
    },
    fileName: {
      type: String,
      default: "",
    },
    fileSize: {
      type: String,
      default: "",
    },
    publicId: {
      type: String,
      default: "",
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true },
);

const Resource = mongoose.model("Resource", resourceSchema);
export default Resource;