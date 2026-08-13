import express from "express";

import {
    createBatch,
    getAllBatches,
    getBatchById,
    updateBatch,
    deleteBatch,
} from "./batch.controller.js"

import { authMiddleware } from "../../middleware/authMiddleware.js";
import { requirePermission } from "../../middleware/permissionMiddleware.js";
import { validate } from "../../middleware/validate.js";
import PERMISSIONS from "../../constants/permission.js";
import { createBatchValidator, updateBatchValidator } from "./batch.validation.js";

const router = express.Router();

// Create Batch
router.post(
    "/",
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_BATCHES),
    createBatchValidator,
    validate,
    createBatch
);

// Get All Batches
router.get(
    "/",
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_BATCHES),
    getAllBatches
);

// Get Single Batch
router.get(
    "/:id",
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_BATCHES),
    getBatchById
);

// Update Batch
router.put(
    "/:id",
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_BATCHES),
    updateBatchValidator,
    validate,
    updateBatch
);

// Delete Batch
router.delete(
    "/:id",
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_BATCHES),
    deleteBatch
);

export default router;