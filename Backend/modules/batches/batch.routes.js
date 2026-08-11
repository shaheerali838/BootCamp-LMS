import express from "express";

import {
    createBatch,
    getAllBatches,
    getBatchById,
    updateBatch,
    deleteBatch,
} from "./BatchController.js"

import { authMiddleware } from "../../middleware/authMiddleware.js";
import { requirePermission } from "../../middleware/permissionMiddleware.js";

import PERMISSIONS from "../../constants/permission.js";

const router = express.Router();

// Create Batch
router.post(
    "/",
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_BATCHES),
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