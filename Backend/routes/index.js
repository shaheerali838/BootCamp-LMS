import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import studentRoutes from "../modules/students/student.routes.js";
import teamRoutes from "../modules/teams/team.routes.js";
import teamMemberRoutes from "../modules/teamMembers/teamMember.routes.js";
import teamProjectRoutes from "../modules/teamProjects/teamProject.routes.js";
import projectRoutes from "../modules/projects/project.routes.js";
import batchRoutes from "../modules/batches/batch.routes.js";

const mainRouter = express.Router();

mainRouter.use("/auth", authRoutes);
mainRouter.use("/students", studentRoutes);
mainRouter.use("/teams", teamRoutes);
mainRouter.use("/team-members", teamMemberRoutes);
mainRouter.use("/team-projects", teamProjectRoutes);
mainRouter.use("/projects", projectRoutes);

//batch
mainRouter.use("/batches", batchRoutes);

export default mainRouter;
