import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import studentRoutes from "../modules/students/student.routes.js";
import teamRoutes from "../modules/teams/team.routes.js";
import teamMemberRoutes from "../modules/teamMembers/teamMember.routes.js";
import teamProjectRoutes from "../modules/teamProjects/teamProject.routes.js";
import projectRoutes from "../modules/projects/project.routes.js";
import sprintRoutes from "../modules/sprints/sprint.routes.js";
import milestoneRoutes from "../modules/milestones/milestone.routes.js";
import evaluationRoutes from "../modules/evaluations/evaluation.routes.js";
import reportRoutes from "../modules/reports/report.routes.js";

const mainRouter = express.Router();

mainRouter.use("/auth", authRoutes);
mainRouter.use("/students", studentRoutes);
mainRouter.use("/teams", teamRoutes);
mainRouter.use("/team-members", teamMemberRoutes);
mainRouter.use("/team-projects", teamProjectRoutes);
mainRouter.use("/projects", projectRoutes);
mainRouter.use("/sprints", sprintRoutes);
mainRouter.use("/milestones", milestoneRoutes);
mainRouter.use("/evaluations", evaluationRoutes);
mainRouter.use("/reports", reportRoutes);

export default mainRouter;
