import Task from "../../model/task.model.js";

const createTask = async (task) => {
  const newTask = await Task.create(task);
  return await Task.findById(newTask._id)
    .populate("assignedTeamId")
    .populate(
      "assignedStudentId",
      "-password -resetPasswordTokenHash -resetPasswordExpiresAt",
    )
    .populate("sprintId");
};

const getTasks = async () => {
  return await Task.find()
    .populate("assignedTeamId")
    .populate(
      "assignedStudentId",
      "-password -resetPasswordTokenHash -resetPasswordExpiresAt",
    )
    .populate("sprintId");
};

const getTaskById = async (id) => {
  return await Task.findById(id)
    .populate("assignedTeamId")
    .populate(
      "assignedStudentId",
      "-password -resetPasswordTokenHash -resetPasswordExpiresAt",
    )
    .populate("sprintId");
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
  return await Task.findByIdAndUpdate(id, task, { returnDocument: "after" })
    .populate("assignedTeamId")
    .populate(
      "assignedStudentId",
      "-password -resetPasswordTokenHash -resetPasswordExpiresAt",
    )
    .populate("sprintId");
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
