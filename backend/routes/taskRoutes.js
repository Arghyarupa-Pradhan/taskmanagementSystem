const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskCounts,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");
// Get completed and pending task counts
router.get("/counts",authMiddleware, getTaskCounts);

// Create a task
router.post("/", authMiddleware, createTask);

// Get all tasks
router.get("/",authMiddleware, getTasks);

// Update task completion status
router.patch("/:id",authMiddleware, updateTaskStatus);
// Delete a task
router.delete("/:id",authMiddleware, deleteTask);

module.exports = router;