import Resource from "../../model/resource.model.js";
import ResourceCategory from "../../model/resourceCategories.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../../config/cloudinary.js";
import mongoose from "mongoose";

const DEFAULT_CATEGORIES = [
  "React",
  "Node.js",
  "Database",
  "JavaScript",
  "Projects",
  "Academic",
  "CSS",
  "Lectures",
];

// Helper to resolve category ID whether given an ObjectId or a category name
const resolveCategoryId = async (categoryInput) => {
  if (!categoryInput) return null;

  // 1. If valid ObjectId, check if category exists
  if (mongoose.Types.ObjectId.isValid(categoryInput)) {
    const existing = await ResourceCategory.findById(categoryInput);
    if (existing) return existing._id;
  }

  // 2. If given a category string name
  const nameStr = String(categoryInput).trim();
  if (nameStr) {
    let cat = await ResourceCategory.findOne({
      categoryName: new RegExp(`^${nameStr}$`, "i"),
    });
    if (!cat) {
      cat = await ResourceCategory.create({ categoryName: nameStr });
    }
    return cat._id;
  }

  // 3. Fallback: first category or create "General"
  let fallback = await ResourceCategory.findOne();
  if (!fallback) {
    fallback = await ResourceCategory.create({ categoryName: "General" });
  }
  return fallback._id;
};

// ---------- CREATE RESOURCE ----------
export const createResource = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    let { fileType, file } = req.body;
    const uploadedBy = req.user?._id;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required.",
      });
    }

    if (!uploadedBy) {
      return res.status(401).json({ success: false, message: "Not authenticated." });
    }

    const resolvedCategoryId = await resolveCategoryId(category || "General");

    let fileUrl = file || "";
    let publicId = "";
    let fileSize = "";
    let fileName = "";

    // If file is uploaded via multipart form data
    if (req.file) {
      fileName = req.file.originalname;
      const extension = fileName.split(".").pop()?.toUpperCase() || "PDF";
      fileType = req.body.fileType || extension;
      fileSize = (req.file.size / (1024 * 1024)).toFixed(2) + " MB";

      // Upload buffer directly to Cloudinary
      const uploadResult = await uploadToCloudinary(req.file.buffer, {
        folder: "saylani_lms/resources",
        resource_type: "auto",
        public_id: `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`,
      });

      fileUrl = uploadResult.secure_url || uploadResult.url;
      publicId = uploadResult.public_id || "";
    }

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: "A resource file (PDF) or valid file URL is required.",
      });
    }

    const resource = await Resource.create({
      title: title.trim(),
      description: description.trim(),
      file: fileUrl,
      fileType: fileType || "PDF",
      fileName: fileName || title.trim(),
      fileSize: fileSize || "1.0 MB",
      publicId,
      category: resolvedCategoryId,
      uploadedBy,
    });

    await resource.populate("category", "categoryName");
    await resource.populate("uploadedBy", "firstName lastName email");

    return res.status(201).json({
      success: true,
      message: "Resource created successfully",
      data: resource,
    });
  } catch (error) {
    console.error("Create Resource Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create resource",
      error: error.message,
    });
  }
};

// ---------- GET ALL RESOURCES ----------
export const getAllResources = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      const re = new RegExp(search, "i");
      query.$or = [{ title: re }, { description: re }, { fileType: re }, { fileName: re }];
    }
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      query.category = category;
    }

    const resources = await Resource.find(query)
      .populate("category", "categoryName")
      .populate("uploadedBy", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch resources", error: error.message });
  }
};

// ---------- GET RESOURCE BY ID ----------
export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid resource ID." });
    }

    const resource = await Resource.findById(id)
      .populate("category", "categoryName")
      .populate("uploadedBy", "firstName lastName email");

    if (!resource) return res.status(404).json({ success: false, message: "Resource not found." });

    return res.status(200).json({ success: true, data: resource });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch resource", error: error.message });
  }
};

// ---------- UPDATE RESOURCE ----------
export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid resource ID." });
    }

    const resource = await Resource.findById(id);
    if (!resource) return res.status(404).json({ success: false, message: "Resource not found." });

    const { title, description, file, fileType, category } = req.body;
    if (title) resource.title = title.trim();
    if (description) resource.description = description.trim();
    if (category) {
      resource.category = await resolveCategoryId(category);
    }
    if (fileType) resource.fileType = fileType;

    // If new file is uploaded
    if (req.file) {
      // Clean up old Cloudinary asset if existed
      if (resource.publicId) {
        await deleteFromCloudinary(resource.publicId);
      }

      const fileName = req.file.originalname;
      const extension = fileName.split(".").pop()?.toUpperCase() || "PDF";
      const fileSize = (req.file.size / (1024 * 1024)).toFixed(2) + " MB";

      const uploadResult = await uploadToCloudinary(req.file.buffer, {
        folder: "saylani_lms/resources",
        resource_type: "auto",
        public_id: `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`,
      });

      resource.file = uploadResult.secure_url || uploadResult.url;
      resource.publicId = uploadResult.public_id || "";
      resource.fileName = fileName;
      resource.fileSize = fileSize;
      resource.fileType = req.body.fileType || extension;
    } else if (file) {
      resource.file = file;
    }

    await resource.save();
    await resource.populate("category", "categoryName");
    await resource.populate("uploadedBy", "firstName lastName email");

    return res.status(200).json({ success: true, message: "Resource updated successfully", data: resource });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update resource", error: error.message });
  }
};

// ---------- DELETE RESOURCE ----------
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid resource ID." });
    }

    const resource = await Resource.findById(id);
    if (!resource) return res.status(404).json({ success: false, message: "Resource not found." });

    // Clean up Cloudinary asset
    if (resource.publicId) {
      await deleteFromCloudinary(resource.publicId);
    }

    await Resource.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Resource deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete resource", error: error.message });
  }
};

// ---------- RESOURCE CATEGORIES: GET ALL ----------
export const getAllCategories = async (req, res) => {
  try {
    let categories = await ResourceCategory.find().sort({ categoryName: 1 });

    // Auto-seed default categories if database is empty
    if (categories.length === 0) {
      await Promise.all(
        DEFAULT_CATEGORIES.map((catName) =>
          ResourceCategory.findOneAndUpdate(
            { categoryName: catName },
            { categoryName: catName },
            { upsert: true, new: true }
          )
        )
      );
      categories = await ResourceCategory.find().sort({ categoryName: 1 });
    }

    return res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch categories", error: error.message });
  }
};

// ---------- RESOURCE CATEGORIES: CREATE ----------
export const createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName) return res.status(400).json({ success: false, message: "categoryName is required." });

    const existing = await ResourceCategory.findOne({ categoryName: new RegExp(`^${categoryName.trim()}$`, "i") });
    if (existing) return res.status(409).json({ success: false, message: "Category already exists." });

    const category = await ResourceCategory.create({ categoryName: categoryName.trim() });
    return res.status(201).json({ success: true, message: "Category created successfully", data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create category", error: error.message });
  }
};

// ---------- RESOURCE CATEGORIES: DELETE ----------
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid category ID." });
    }
    const cat = await ResourceCategory.findByIdAndDelete(id);
    if (!cat) return res.status(404).json({ success: false, message: "Category not found." });
    return res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete category", error: error.message });
  }
};
