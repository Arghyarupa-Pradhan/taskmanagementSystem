import { useState } from "react";
import { useTasks } from "../../hooks";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import "./TaskBoard.css";

export default function TaskBoard() {
  const {
    tasks,
    loading,
    addTask,
    editTask,
    removeTask,
  } = useTasks();

  // =========================================================
  // ADD FORM
  // =========================================================

  const [showAdd, setShowAdd] = useState(false);

  const [newTask, setNewTask] = useState({
    projectName: "",
    module: "",
    task: "",
    priority: "",
    status: "In Progress",
    timeSpent: "",
  });

  // =========================================================
  // EDIT
  // =========================================================

  const [editingId, setEditingId] = useState(null);

  const [editingTask, setEditingTask] = useState({
    projectName: "",
    module: "",
    task: "",
    priority: "",
    status: "In Progress",
    timeSpent: "",
  });

  // =========================================================
  // OPEN ADD FORM
  // =========================================================

  function handleAdd() {
    setShowAdd(true);

    setNewTask({
      projectName: "",
      module: "",
      task: "",
      priority: "",
      status: "In Progress",
      timeSpent: "",
    });
  }

  // =========================================================
  // HANDLE NEW TASK INPUT
  // =========================================================

  function handleNewTaskChange(e) {
    const { name, value } = e.target;

    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // =========================================================
  // SAVE NEW TASK
  // =========================================================

  async function handleSave() {
    const projectName = newTask.projectName.trim();
    const moduleName = newTask.module.trim();
    const task = newTask.task.trim();
    const timeSpent = newTask.timeSpent.trim();

    // =======================================================
    // REQUIRED VALIDATION
    // =======================================================

    if (!projectName) {
      alert("Please enter project name.");
      return;
    }

    if (!moduleName) {
      alert("Please enter module.");
      return;
    }

    if (!task) {
      alert("Please enter task.");
      return;
    }

    // =======================================================
    // CREATE TASK
    // Priority is OPTIONAL
    // =======================================================

    try {
      await addTask({
        projectName,
        module: moduleName,
        task,
        priority: newTask.priority,
        status: newTask.status,
        timeSpent,
      });

      // Reset form
      setNewTask({
        projectName: "",
        module: "",
        task: "",
        priority: "",
        status: "In Progress",
        timeSpent: "",
      });

      setShowAdd(false);
    } catch (error) {
      console.error(
        "Failed to create task:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to save task."
      );
    }
  }

  // =========================================================
  // CANCEL ADD
  // =========================================================

  function handleCancel() {
    setNewTask({
      projectName: "",
      module: "",
      task: "",
      priority: "",
      status: "In Progress",
      timeSpent: "",
    });

    setShowAdd(false);
  }

  // =========================================================
  // START EDIT
  // =========================================================

  function handleEdit(task) {
    const taskId = task.id || task._id;

    setEditingId(taskId);

    setEditingTask({
      projectName: task.projectName || "",

      module: task.module || "",

      task:
        task.taskName ||
        task.task ||
        "",

      priority: task.priority || "",

      status:
        task.status ||
        "In Progress",

      timeSpent:
        task.timeSpent ||
        "",
    });
  }

  // =========================================================
  // HANDLE EDIT INPUT
  // =========================================================

  function handleEditChange(e) {
    const { name, value } = e.target;

    setEditingTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // =========================================================
  // SAVE EDIT
  // =========================================================

  async function handleSaveEdit(task) {
    const taskId = task.id || task._id;

    const projectName =
      editingTask.projectName.trim();

    const moduleName =
      editingTask.module.trim();

    const taskName =
      editingTask.task.trim();

    const timeSpent =
      editingTask.timeSpent.trim();

    // =======================================================
    // REQUIRED VALIDATION
    // =======================================================

    if (!projectName) {
      alert("Project name is required.");
      return;
    }

    if (!moduleName) {
      alert("Module is required.");
      return;
    }

    if (!taskName) {
      alert("Task is required.");
      return;
    }

    // =======================================================
    // UPDATE TASK
    // Priority is OPTIONAL
    // =======================================================

    try {
      await editTask(taskId, {
        projectName,
        module: moduleName,
        task: taskName,
        priority: editingTask.priority,
        status: editingTask.status,
        timeSpent,
      });

      setEditingId(null);

      setEditingTask({
        projectName: "",
        module: "",
        task: "",
        priority: "",
        status: "In Progress",
        timeSpent: "",
      });
    } catch (error) {
      console.error(
        "Failed to update task:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to update task."
      );
    }
  }

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  function handleCancelEdit() {
    setEditingId(null);

    setEditingTask({
      projectName: "",
      module: "",
      task: "",
      priority: "",
      status: "In Progress",
      timeSpent: "",
    });
  }

  // =========================================================
  // DELETE TASK
  // =========================================================

  async function handleDelete(task) {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this task?"
      );

    if (!confirmDelete) {
      return;
    }

    const taskId =
      task.id || task._id;

    try {
      await removeTask(taskId);
    } catch (error) {
      console.error(
        "Failed to delete task:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to delete task."
      );
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="page-loader">
        <Loader label="Loading tasks..." />
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="page task-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="page__header">

        <h1>
          Tasks
        </h1>

        {/* ADD BUTTON ALWAYS VISIBLE */}

        <Button onClick={handleAdd}>
          + Add
        </Button>

      </div>


      {/* =====================================================
          ADD TASK FORM
      ===================================================== */}

      {showAdd && (
        <div className="task-form">

          <h2>
            Add Task
          </h2>


          {/* =================================================
              ROW 1
              PROJECT NAME + MODULE
          ================================================= */}

          <div className="task-form__grid task-form__grid--two">

            {/* PROJECT NAME */}

            <div className="task-form__field">

              <label>
                Project Name
              </label>

              <input
                type="text"
                name="projectName"
                placeholder="Enter project name..."
                value={
                  newTask.projectName
                }
                onChange={
                  handleNewTaskChange
                }
                autoFocus
              />

            </div>


            {/* MODULE */}

            <div className="task-form__field">

              <label>
                Module
              </label>

              <input
                type="text"
                name="module"
                placeholder="Enter module..."
                value={
                  newTask.module
                }
                onChange={
                  handleNewTaskChange
                }
              />

            </div>

          </div>


          {/* =================================================
              ROW 2
              TASK
          ================================================= */}

          <div className="task-form__field">

            <label>
              Task
            </label>

            <textarea
              name="task"
              placeholder="Enter task..."
              value={
                newTask.task
              }
              onChange={
                handleNewTaskChange
              }
              rows="3"
            />

          </div>


          {/* =================================================
              ROW 3
              PRIORITY + STATUS + TIME SPENT
          ================================================= */}

          <div className="task-form__grid task-form__grid--three">

            {/* PRIORITY - OPTIONAL */}

            <div className="task-form__field">

              <label>
                Priority
              </label>

              <select
                name="priority"
                value={
                  newTask.priority
                }
                onChange={
                  handleNewTaskChange
                }
              >

                <option value="">
                  Select Priority (Optional)
                </option>

                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

              </select>

            </div>


            {/* STATUS */}

            <div className="task-form__field">

              <label>
                Status
              </label>

              <select
                name="status"
                value={
                  newTask.status
                }
                onChange={
                  handleNewTaskChange
                }
              >

                <option value="Pending">
                  Pending
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>

              </select>

            </div>


            {/* TIME SPENT */}

            <div className="task-form__field">

              <label>
                Time Spent
              </label>

              <input
                type="text"
                name="timeSpent"
                placeholder="e.g. 2 hours"
                value={
                  newTask.timeSpent
                }
                onChange={
                  handleNewTaskChange
                }
              />

            </div>

          </div>


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="task-form__actions">

            <Button
              onClick={handleSave}
            >
              Save
            </Button>

            <Button
              variant="ghost"
              onClick={handleCancel}
            >
              Cancel
            </Button>

          </div>

        </div>
      )}


      {/* =====================================================
          TASK LIST
      ===================================================== */}

      <div className="task-list">

        {tasks.map((task) => {

          const taskId =
            task.id || task._id;

          const isEditing =
            editingId === taskId;

          return (
            <div
              className="task-item"
              key={taskId}
            >

              {/* =================================================
                  EDIT MODE
              ================================================= */}

              {isEditing ? (

                <div className="task-form task-form--edit">

                  <h2>
                    Edit Task
                  </h2>


                  {/* =================================================
                      ROW 1
                      PROJECT NAME + MODULE
                  ================================================= */}

                  <div className="task-form__grid task-form__grid--two">

                    {/* PROJECT NAME */}

                    <div className="task-form__field">

                      <label>
                        Project Name
                      </label>

                      <input
                        type="text"
                        name="projectName"
                        value={
                          editingTask.projectName
                        }
                        onChange={
                          handleEditChange
                        }
                      />

                    </div>


                    {/* MODULE */}

                    <div className="task-form__field">

                      <label>
                        Module
                      </label>

                      <input
                        type="text"
                        name="module"
                        value={
                          editingTask.module
                        }
                        onChange={
                          handleEditChange
                        }
                      />

                    </div>

                  </div>


                  {/* =================================================
                      ROW 2
                      TASK
                  ================================================= */}

                  <div className="task-form__field">

                    <label>
                      Task
                    </label>

                    <textarea
                      name="task"
                      value={
                        editingTask.task
                      }
                      onChange={
                        handleEditChange
                      }
                      rows="3"
                    />

                  </div>


                  {/* =================================================
                      ROW 3
                      PRIORITY + STATUS + TIME SPENT
                  ================================================= */}

                  <div className="task-form__grid task-form__grid--three">

                    {/* PRIORITY - OPTIONAL */}

                    <div className="task-form__field">

                      <label>
                        Priority
                      </label>

                      <select
                        name="priority"
                        value={
                          editingTask.priority
                        }
                        onChange={
                          handleEditChange
                        }
                      >

                        <option value="">
                          Select Priority (Optional)
                        </option>

                        <option value="Low">
                          Low
                        </option>

                        <option value="Medium">
                          Medium
                        </option>

                        <option value="High">
                          High
                        </option>

                      </select>

                    </div>


                    {/* STATUS */}

                    <div className="task-form__field">

                      <label>
                        Status
                      </label>

                      <select
                        name="status"
                        value={
                          editingTask.status
                        }
                        onChange={
                          handleEditChange
                        }
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="In Progress">
                          In Progress
                        </option>

                        <option value="Completed">
                          Completed
                        </option>

                      </select>

                    </div>


                    {/* TIME SPENT */}

                    <div className="task-form__field">

                      <label>
                        Time Spent
                      </label>

                      <input
                        type="text"
                        name="timeSpent"
                        placeholder="e.g. 2 hours"
                        value={
                          editingTask.timeSpent
                        }
                        onChange={
                          handleEditChange
                        }
                      />

                    </div>

                  </div>


                  {/* =================================================
                      EDIT ACTIONS
                  ================================================= */}

                  <div className="task-form__actions">

                    <Button
                      onClick={() =>
                        handleSaveEdit(task)
                      }
                    >
                      Save
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={
                        handleCancelEdit
                      }
                    >
                      Cancel
                    </Button>

                  </div>

                </div>

              ) : (

                /* =================================================
                   NORMAL TASK CARD
                ================================================= */

                <div className="task-card">

                  {/* =================================================
                      HEADER
                  ================================================= */}

                  <div className="task-card__header">

                    <div>

                      <h3>
                        {task.projectName ||
                          "No project"}
                      </h3>

                      <p>
                        {task.module ||
                          "No module"}
                      </p>

                    </div>


                    {/* ONLY SHOW PRIORITY IF SELECTED */}

                    {task.priority && (
                      <span
                        className={`priority priority--${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                    )}

                  </div>


                  {/* =================================================
                      BODY
                      TASK + STATUS + TIME SPENT
                      ONE HORIZONTAL LINE
                  ================================================= */}

                  <div className="task-card__body task-card__body--horizontal">

                    {/* TASK */}

                    <div className="task-card__info">

                      <strong>
                        Task
                      </strong>

                      <span>
                        {task.taskName ||
                          task.task ||
                          "No task"}
                      </span>

                    </div>


                    {/* STATUS */}

                    <div className="task-card__info">

                      <strong>
                        Status
                      </strong>

                      <span>
                        {task.status ||
                          "In Progress"}
                      </span>

                    </div>


                    {/* TIME SPENT */}

                    <div className="task-card__info">

                      <strong>
                        Time Spent
                      </strong>

                      <span>
                        {task.timeSpent ||
                          "-"}
                      </span>

                    </div>

                  </div>


                  {/* =================================================
                      ACTIONS
                  ================================================= */}

                  <div className="task-card__actions">

                    <Button
                      variant="ghost"
                      onClick={() =>
                        handleEdit(task)
                      }
                    >
                      ✎ Edit
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() =>
                        handleDelete(task)
                      }
                    >
                      🗑 Delete
                    </Button>

                  </div>

                </div>

              )}

            </div>
          );
        })}


        {/* =====================================================
            EMPTY
        ===================================================== */}

        {tasks.length === 0 &&
          !showAdd && (

            <p className="task-list__empty">
              No tasks yet. Click "+ Add"
              to create one.
            </p>

          )}

      </div>

    </div>
  );
}