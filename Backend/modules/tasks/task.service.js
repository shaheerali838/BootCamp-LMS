import Task from "../../model/task.model.js";

const createTask = async (task) => {
  return await Task.create(task);
};

const getTasks = async () => {
  return await Task.find();
};

const getTaskById = async (id) => {
  return await Task.findById(id);
};

const getTasksBySprintId = async (sprintId) => {
  return await Task.find({ sprintId: sprintId })
    .populate("assignedTeamId")
    .populate(
      "assignedStudentId",
      "-password -resetPasswordTokenHash -resetPasswordExpiresAt",
    );
};

const updateTask = async (id, task) => {
  return await Task.findByIdAndUpdate(id, task, { returnDocument: "after" });
};

const deleteTask = async (id) => {
  return await Task.findByIdAndDelete(id);
};

const getTasksByStudentId = async (studentId) => {
  return await Task.find({ assignedStudentId: studentId })
    .populate("sprintId")
    .populate("assignedTeamId");
};

const getTasksByTeamId = async (teamId) => {
  return await Task.find({ assignedTeamId: teamId })
    .populate("sprintId")
    .populate(
      "assignedStudentId",
      "-password -resetPasswordTokenHash -resetPasswordExpiresAt",
    );
};

export {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByStudentId,
  getTasksByTeamId,
  getTasksBySprintId,
};
