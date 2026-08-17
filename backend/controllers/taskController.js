const Task = require("../models/Task");

// Create a new task
const createTask = async (req, res) => {
  try {
    const {
  employeeName,
  taskName,
  creationDate,
  time,
  priority,
  completed,
  note,
} = req.body;

const task = await Task.create({
  employeeName,
  taskName,
  creationDate,
  time,
  priority,
  completed: completed ?? false,
  note,
  user: req.user.id,
});

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Error creating task:", error);

    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
};

// Get all tasks for logged-in user
const getTasks = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {
      user: req.user.id,
    };

    if (search) {
      filter.$or = [
        { employeeName: { $regex: search, $options: "i" } },
        { taskName: { $regex: search, $options: "i" } },
      ];
    }

    const tasks = await Task.find(filter).sort({ creationDate: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);

    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

// Get completed and pending task counts
const getTaskCounts = async (req, res) => {
  try {
    const completed = await Task.countDocuments({
      user: req.user.id,
      completed: true,
    });

    const pending = await Task.countDocuments({
      user: req.user.id,
      completed: false,
    });

    res.status(200).json({
      completed,
      pending,
    });
  } catch (error) {
    console.error("Error fetching task counts:", error);

    res.status(500).json({
      message: "Failed to fetch task counts",
      error: error.message,
    });
  }
};

// Update task completion status
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        user: req.user.id,
      },
      { completed },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    console.error("Error updating task status:", error);

    res.status(500).json({
      message: "Failed to update task status",
      error: error.message,
    });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);

    res.status(500).json({
      message: "Failed to delete task",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskCounts,
  updateTaskStatus,
  deleteTask,
};