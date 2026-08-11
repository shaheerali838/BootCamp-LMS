import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import studentRoutes from "../modules/students/student.routes.js";
import batchRoutes from "../modules/batches/batch.routes.js";

const mainRouter = express.Router();

mainRouter.use("/auth", authRoutes);
mainRouter.use("/students", studentRoutes);

//batch
mainRouter.use("/batches", batchRoutes);


export default mainRouter;
