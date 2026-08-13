import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import studentRoutes from "../modules/students/student.routes.js";
import teamRoutes from "../modules/teams/team.routes.js";
import teamMemberRoutes from "../modules/teamMembers/teamMember.routes.js";
import teamProjectRoutes from "../modules/teamProjects/teamProject.routes.js";
import projectRoutes from "../modules/projects/project.routes.js";
import batchRoutes from "../modules/batches/batch.routes.js";
import taskRoutes from "../modules/tasks/task.routes.js";

const mainRouter = express.Router();

//auth
mainRouter.use("/auth", authRoutes);

//students
mainRouter.use("/students", studentRoutes);

//teams
mainRouter.use("/teams", teamRoutes);

//team members
mainRouter.use("/team-members", teamMemberRoutes);

//team projects
mainRouter.use("/team-projects", teamProjectRoutes);
mainRouter.use("/projects", projectRoutes);

//batch
mainRouter.use("/batches", batchRoutes);

//task
mainRouter.use("/tasks", taskRoutes);

export default mainRouter;
