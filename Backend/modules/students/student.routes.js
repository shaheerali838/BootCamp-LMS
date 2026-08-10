import express from "express";
import { createStudent } from "./StudentController.js";

const router = express.Router();

router.post("/", createStudent);

export default router;