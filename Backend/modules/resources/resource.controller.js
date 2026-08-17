import Resource from "../../model/resource.model.js";
import ResourceCategory from "../../model/resourceCategories.model.js";
import mongoose from "mongoose";

// ---------- CREATE RESOURCE ----------
export const createResource = async (req, res) => {
  try {
    const { title, description, file, fileType, category } = req.body;
    const uploadedBy = req.user?._id;

    if (!title || !description || !file || !fileType || !category) {
      return res.status(400).json({
        success: false,
        message: "title, description, file, fileType, and category are required.",
      });
    }

    if (!uploadedBy) {
      return res.status(401).json({ success: false, message: "Not authenticated." });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ success: false, message: "Invalid category ID." });
    }

    const resource = await Resource.create({ title, description, file, fileType, category, uploadedBy });
    await resource.populate("category", "categoryName");
    await resource.populate("uploadedBy", "firstName lastName email");

    return res.status(201).json({ success: true, message: "Resource created successfully", data: resource });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create resource", error: error.message });
  }
};

// ---------- GET ALL RESOURCES ----------
export const getAllResources = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      const re = new RegExp(search, "i");
      query.$or = [{ title: re }, { description: re }, { fileType: re }];
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
    if (title) resource.title = title;
    if (description) resource.description = description;
    if (file) resource.file = file;
    if (fileType) resource.fileType = fileType;
    if (category && mongoose.Types.ObjectId.isValid(category)) resource.category = category;

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

    const resource = await Resource.findByIdAndDelete(id);
    if (!resource) return res.status(404).json({ success: false, message: "Resource not found." });

    return res.status(200).json({ success: true, message: "Resource deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete resource", error: error.message });
  }
};

// ---------- RESOURCE CATEGORIES: GET ALL ----------
export const getAllCategories = async (req, res) => {
  try {
    const categories = await ResourceCategory.find().sort({ categoryName: 1 });
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

    const existing = await ResourceCategory.findOne({ categoryName: new RegExp(`^${categoryName}$`, "i") });
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
