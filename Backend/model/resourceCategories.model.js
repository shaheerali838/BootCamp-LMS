import mongoose from "mongoose";

const resourceCategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const ResourceCategory = mongoose.model(
  "ResourceCategory",
  resourceCategorySchema,
);
export default ResourceCategory;
