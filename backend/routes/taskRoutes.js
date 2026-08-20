const express = require("express");

const router = express.Router();

const {
  createTask,
  getTasks,
  getReport,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// GET REPORT - ALL USERS
// ==========================================

router.get(
  "/report",
  authMiddleware,
  getReport
);

// ==========================================
// GET ALL TASKS
// ==========================================

router.get(
  "/",
  authMiddleware,
  getTasks
);

// ==========================================
// CREATE TASK
// ==========================================

router.post(
  "/",
  authMiddleware,
  createTask
);

// ==========================================
// UPDATE TASK
// ==========================================

router.patch(
  "/:id",
  authMiddleware,
  updateTask
);

// ==========================================
// DELETE TASK
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  deleteTask
);

module.exports = router;