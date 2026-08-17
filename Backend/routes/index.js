import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import adminRoutes from "../modules/admins/admin.routes.js";
import studentRoutes from "../modules/students/student.routes.js";
import teamRoutes from "../modules/teams/team.routes.js";
import teamMemberRoutes from "../modules/teamMembers/teamMember.routes.js";
import teamProjectRoutes from "../modules/teamProjects/teamProject.routes.js";
import projectRoutes from "../modules/projects/project.routes.js";
import batchRoutes from "../modules/batches/batch.routes.js";
import taskRoutes from "../modules/tasks/task.routes.js";
import sprintRoutes from "../modules/sprints/sprint.routes.js";
import milestoneRoutes from "../modules/milestones/milestone.routes.js";
import evaluationRoutes from "../modules/evaluations/evaluation.routes.js";
import reportRoutes from "../modules/reports/report.routes.js";
import announcementRoutes from "../modules/announcements/announcement.routes.js";
import resourceRoutes from "../modules/resources/resource.routes.js";

const mainRouter = express.Router();

//auth
mainRouter.use("/auth", authRoutes);

//admins
mainRouter.use("/admins", adminRoutes);

//students
mainRouter.use("/students", studentRoutes);

//teams
mainRouter.use("/teams", teamRoutes);

//team members
mainRouter.use("/team-members", teamMemberRoutes);

//team projects
mainRouter.use("/team-projects", teamProjectRoutes);

mainRouter.use("/projects", projectRoutes);
mainRouter.use("/sprints", sprintRoutes);
mainRouter.use("/milestones", milestoneRoutes);
mainRouter.use("/evaluations", evaluationRoutes);
mainRouter.use("/reports", reportRoutes);

//batch
mainRouter.use("/batches", batchRoutes);

//task
mainRouter.use("/tasks", taskRoutes);

//announcements
mainRouter.use("/announcements", announcementRoutes);

//resources
mainRouter.use("/resources", resourceRoutes);

export default mainRouter;
