const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    // ==============================
    // PROJECT
    // ==============================
    projectName: {
      type: String,
      required: true,
      trim: true,
    },

    // ==============================
    // MODULE
    // ==============================
    module: {
      type: String,
      required: true,
      trim: true,
    },

    // ==============================
    // TASK
    // ==============================
    taskName: {
      type: String,
      required: true,
      trim: true,
    },

    // ==============================
    // PRIORITY
    // ==============================
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    // ==============================
    // STATUS
    // ==============================
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    // ==============================
    // TIME SPENT
    // ==============================
    timeSpent: {
      type: String,
      trim: true,
      default: "",
    },

    // ==============================
    // CREATION DATE
    // ==============================
    creationDate: {
      type: Date,
      default: Date.now,
    },

    // ==============================
    // COMPLETED
    // ==============================
    completed: {
      type: Boolean,
      default: false,
    },

    // ==============================
    // NOTE
    // ==============================
    note: {
      type: String,
      trim: true,
      default: "",
    },

    // ==============================
    // USER
    // ==============================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);