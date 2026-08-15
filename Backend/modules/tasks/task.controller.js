import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByStudentId,
  getTasksByTeamId,
  getTasksBySprintId,
} from "./task.service.js";

// Create Task
const createTaskHandler = async (req, res) => {
  try {
    const task = await createTask(req.body);
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Tasks
const getTasksHandler = async (req, res) => {
  try {
    const tasks = await getTasks();
    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Task By ID
const getTaskByIdHandler = async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Task
const updateTaskHandler = async (req, res) => {
  try {
    const task = await updateTask(req.params.id, req.body);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Task
const deleteTaskHandler = async (req, res) => {
  try {
    const task = await deleteTask(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Tasks By Student ID
const getTasksByStudentIdHandler = async (req, res) => {
  try {
    const tasks = await getTasksByStudentId(req.params.studentId);
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Tasks By Team ID
const getTasksByTeamIdHandler = async (req, res) => {
  try {
    const tasks = await getTasksByTeamId(req.params.teamId);
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Tasks By Sprint ID
const getTasksBySprintIdHandler = async (req, res) => {
  try {
    const tasks = await getTasksBySprintId(req.params.sprintId);
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createTaskHandler,
  getTasksHandler,
  getTaskByIdHandler,
  updateTaskHandler,
  deleteTaskHandler,
  getTasksByStudentIdHandler,
  getTasksByTeamIdHandler,
  getTasksBySprintIdHandler,
};
