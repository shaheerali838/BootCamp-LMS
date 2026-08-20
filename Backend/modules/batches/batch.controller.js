import mongoose from "mongoose";
import Batch from "../../model/batch.model.js";

// CREATE BATCH
export const createBatch = async (req, res) => {
  try {
    const { batchName, program, startDate, endDate, status } = req.body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check duplicate batch
    const existingBatch = await Batch.findOne({
      batchName: batchName.trim(),
    });

    if (existingBatch) {
      return res.status(409).json({
        success: false,
        message: "Batch with this name already exists",
      });
    }

    // Create batch
    const batch = await Batch.create({
      batchName: batchName.trim(),
      program: program.trim(),
      startDate: start,
      endDate: end,
      status: status || "active",
    });

    return res.status(201).json({
      success: true,
      message: "Batch created successfully",
      batch,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create batch",
      error: error.message,
    });
  }
};

// GET ALL BATCHES
// GET ALL BATCHES
export const getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "batchId",
          as: "students",
        },
      },
      {
        $addFields: {
          totalStudents: { $size: "$students" },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: batches.length,
      batches,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch batches",
      error: error.message,
    });
  }
};

// GET BATCH BY ID
export const getBatchById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID",
      });
    }

    const batch = await Batch.findById(id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    return res.status(200).json({
      success: true,
      batch,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch batch",
      error: error.message,
    });
  }
};

// UPDATE BATCH
export const updateBatch = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID",
      });
    }

    const batch = await Batch.findById(id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    const { batchName, program, startDate, endDate, status } = req.body;

    // Check duplicate batch name
    if (batchName && batchName.trim() !== batch.batchName) {
      const existingBatch = await Batch.findOne({
        batchName: batchName.trim(),
        _id: { $ne: id },
      });

      if (existingBatch) {
        return res.status(409).json({
          success: false,
          message: "Batch with this name already exists",
        });
      }
    }

    // Use existing values if not provided
    const newStartDate = startDate ? new Date(startDate) : batch.startDate;

    const newEndDate = endDate ? new Date(endDate) : batch.endDate;

    // Update only provided fields
    if (batchName) batch.batchName = batchName.trim();
    if (program) batch.program = program.trim();
    if (startDate) batch.startDate = newStartDate;
    if (endDate) batch.endDate = newEndDate;
    if (status) batch.status = status;

    await batch.save();

    return res.status(200).json({
      success: true,
      message: "Batch updated successfully",
      batch,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update batch",
      error: error.message,
    });
  }
};

// DELETE BATCH
export const deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID",
      });
    }

    const batch = await Batch.findById(id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    await Batch.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Batch deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete batch",
      error: error.message,
    });
  }
};
