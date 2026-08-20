const Task = require("../models/Task");


// ==========================================
// CREATE TASK
// ==========================================
const createTask = async (req, res) => {
  try {
    const {
      projectName,
      module,
      taskName,
      task,
      priority,
      status,
      timeSpent,
      note,
    } = req.body;

    // ==========================================
    // SUPPORT BOTH taskName AND task
    // ==========================================
    const finalTaskName =
      taskName || task || "";

    // ==========================================
    // VALIDATION
    // ==========================================
    if (!projectName || !projectName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    if (!module || !module.trim()) {
      return res.status(400).json({
        success: false,
        message: "Module is required",
      });
    }

    if (!finalTaskName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task name is required",
      });
    }

    // ==========================================
    // CREATE TASK
    // ==========================================
    const taskData = {
      projectName: projectName.trim(),

      module: module.trim(),

      taskName: finalTaskName.trim(),

      priority: priority || "Medium",

      status: status || "Pending",

      timeSpent: timeSpent
        ? timeSpent.trim()
        : "",

      note: note
        ? note.trim()
        : "",

      completed:
        status === "Completed",

      user: req.user.id,
    };

    const createdTask =
      await Task.create(taskData);

    // ==========================================
    // POPULATE USER
    // ==========================================
    await createdTask.populate(
      "user",
      "name email"
    );

    // ==========================================
    // RESPONSE
    // ==========================================
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: createdTask,
    });

  } catch (error) {
    console.error(
      "Error creating task:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
};


// ==========================================
// GET TASKS
// ==========================================
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
    })
      .populate(
        "user",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      tasks,
    });

  } catch (error) {
    console.error(
      "Error fetching tasks:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};


// ==========================================
// GET REPORT
// ==========================================
const getReport = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: {
        $exists: true,
        $ne: null,
      },
    })
      .populate(
        "user",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      tasks,
    });

  } catch (error) {
    console.error(
      "Error fetching report:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch report",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE TASK
// ==========================================
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      projectName,
      module,
      taskName,
      task,
      priority,
      status,
      timeSpent,
      note,
      completed,
    } = req.body;

    const updateData = {};

    // ==========================================
    // PROJECT NAME
    // ==========================================
    if (projectName !== undefined) {
      if (!projectName.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Project name is required",
        });
      }

      updateData.projectName =
        projectName.trim();
    }

    // ==========================================
    // MODULE
    // ==========================================
    if (module !== undefined) {
      if (!module.trim()) {
        return res.status(400).json({
          success: false,
          message: "Module is required",
        });
      }

      updateData.module =
        module.trim();
    }

    // ==========================================
    // TASK NAME
    // ==========================================
    const finalTaskName =
      taskName !== undefined
        ? taskName
        : task;

    if (finalTaskName !== undefined) {
      if (!finalTaskName.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Task name is required",
        });
      }

      updateData.taskName =
        finalTaskName.trim();
    }

    // ==========================================
    // PRIORITY
    // ==========================================
    if (priority !== undefined) {
      updateData.priority =
        priority;
    }

    // ==========================================
    // STATUS
    // ==========================================
    if (status !== undefined) {
      updateData.status =
        status;

      updateData.completed =
        status === "Completed";
    }

    // ==========================================
    // TIME SPENT
    // ==========================================
    if (timeSpent !== undefined) {
      updateData.timeSpent =
        timeSpent.trim();
    }

    // ==========================================
    // NOTE
    // ==========================================
    if (note !== undefined) {
      updateData.note =
        note.trim();
    }

    // ==========================================
    // COMPLETED
    // ==========================================
    if (completed !== undefined) {
      updateData.completed =
        Boolean(completed);
    }

    // ==========================================
    // CHECK UPDATE DATA
    // ==========================================
    if (
      Object.keys(updateData).length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No data provided for update",
      });
    }

    // ==========================================
    // UPDATE
    // ==========================================
    const updatedTask =
      await Task.findOneAndUpdate(
        {
          _id: id,
          user: req.user.id,
        },
        updateData,
        {
          returnDocument: "after",
          runValidators: true,
        }
      ).populate(
        "user",
        "name email"
      );

    // ==========================================
    // NOT FOUND
    // ==========================================
    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // ==========================================
    // RESPONSE
    // ==========================================
    res.status(200).json({
      success: true,
      message:
        "Task updated successfully",
      task: updatedTask,
    });

  } catch (error) {
    console.error(
      "Error updating task:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update task",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE TASK
// ==========================================
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task =
      await Task.findOneAndDelete({
        _id: id,
        user: req.user.id,
      });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Task deleted successfully",
    });

  } catch (error) {
    console.error(
      "Error deleting task:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete task",
      error: error.message,
    });
  }
};


// ==========================================
// EXPORT
// ==========================================
module.exports = {
  createTask,
  getTasks,
  getReport,
  updateTask,
  deleteTask,
};