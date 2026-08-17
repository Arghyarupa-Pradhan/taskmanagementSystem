const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    employeeName: {
      type: String,
      required: true,
      trim: true,
    },

    taskName: {
      type: String,
      required: true,
      trim: true,
    },

    creationDate: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

  
    completed: {
      type: Boolean,
      default: false,
    },

    note: {
      type: String,
      trim: true,
      default: "",
    },

    // User who owns this task
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