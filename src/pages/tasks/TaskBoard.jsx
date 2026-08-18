import { useState } from "react";
import { useTasks } from "../../hooks";
import { TASK_STATUS } from "../../constants";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import "./TaskBoard.css";

export default function TaskBoard() {
  const { tasks, loading, addTask, editTask, removeTask } = useTasks();

  const [newRows, setNewRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Add a new empty row
  function handleAddRow() {
    setNewRows((rows) => [
      ...rows,
      {
        tempId: `new-${Date.now()}`,
        title: "",
        dueDate: "",
      },
    ]);
  }

  // Change new task title
  function handleNewRowChange(tempId, value) {
    setNewRows((rows) =>
      rows.map((row) =>
        row.tempId === tempId
          ? { ...row, title: value }
          : row
      )
    );
  }

  // Change new task due date
  function handleNewRowDateChange(tempId, value) {
    setNewRows((rows) =>
      rows.map((row) =>
        row.tempId === tempId
          ? { ...row, dueDate: value }
          : row
      )
    );
  }

  // Save new task
  async function handleSaveNewRow(tempId) {
    const row = newRows.find((row) => row.tempId === tempId);

    if (!row || !row.title.trim()) {
      return;
    }

    try {
      await addTask({
        title: row.title.trim(),
        status: TASK_STATUS.TODO,
        dueDate: row.dueDate,
      });

      // Remove temporary row only after successful backend save
      setNewRows((rows) =>
        rows.filter((row) => row.tempId !== tempId)
      );
    } catch (error) {
      console.error("Failed to save task:", error);
      alert("Failed to save task. Please check the backend.");
    }
  }

  // Cancel new task
  function handleCancelNewRow(tempId) {
    setNewRows((rows) =>
      rows.filter((row) => row.tempId !== tempId)
    );
  }

  // Toggle task complete/incomplete
  function handleToggleComplete(task) {
    editTask(task.id, {
      status:
        task.status === TASK_STATUS.DONE
          ? TASK_STATUS.TODO
          : TASK_STATUS.DONE,
    });
  }

  // Start editing
  function startEdit(task) {
    setEditingId(task.id);
    setEditingTitle(task.title);
  }

  // Save edited task
  function saveEdit(task) {
    if (editingTitle.trim()) {
      editTask(task.id, {
        title: editingTitle.trim(),
      });
    }

    setEditingId(null);
    setEditingTitle("");
  }

  // Cancel editing
  function cancelEdit() {
    setEditingId(null);
    setEditingTitle("");
  }

  // Loading screen
  if (loading) {
    return (
      <div className="page-loader">
        <Loader label="Loading tasks…" />
      </div>
    );
  }

  return (
    <div className="page">
      {/* Page header */}
      <div className="page__header">
        <h1>Tasks</h1>

        <Button onClick={handleAddRow}>
          + Add
        </Button>
      </div>

      {/* Task list */}
      <div className="task-list">

        {/* Existing tasks */}
        {tasks.map((task) => {
          const isEditing = editingId === task.id;
          const isDone = task.status === TASK_STATUS.DONE;

          return (
            <div
              className={`task-row${
                isDone ? " task-row--done" : ""
              }`}
              key={task.id}
            >
              {/* Task title */}
              <input
                className="task-row__input"
                value={
                  isEditing
                    ? editingTitle
                    : task.title
                }
                readOnly={!isEditing}
                onChange={(e) =>
                  setEditingTitle(e.target.value)
                }
                onKeyDown={(e) => {
                  if (!isEditing) return;

                  if (e.key === "Enter") {
                    saveEdit(task);
                  }

                  if (e.key === "Escape") {
                    cancelEdit();
                  }
                }}
              />

              {/* Complete checkbox */}
              <input
                type="checkbox"
                className="task-row__checkbox"
                checked={isDone}
                onChange={() =>
                  handleToggleComplete(task)
                }
                aria-label={
                  isDone
                    ? "Mark task incomplete"
                    : "Mark task complete"
                }
              />

              {/* Edit / Save / Cancel */}
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => saveEdit(task)}
                  >
                    Save
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  className="task-icon-btn task-edit-btn"
                  onClick={() => startEdit(task)}
                  aria-label="Edit task"
                  title="Edit task"
                >
                  ✎
                </Button>
              )}

              {/* Delete */}
              <Button
                variant="danger"
                className="task-icon-btn task-delete-btn"
                onClick={() => removeTask(task.id)}
                aria-label="Delete task"
                title="Delete task"
              >
                🗑
              </Button>
            </div>
          );
        })}

        {/* New task rows */}
        {newRows.map((row) => (
          <div
            className="task-row task-row--new"
            key={row.tempId}
          >
            {/* New task title */}
            <input
              className="task-row__input"
              autoFocus
              placeholder="Type a new task…"
              value={row.title}
              onChange={(e) =>
                handleNewRowChange(
                  row.tempId,
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveNewRow(row.tempId);
                }

                if (e.key === "Escape") {
                  handleCancelNewRow(row.tempId);
                }
              }}
            />

            {/* Due date */}
            <input
              type="date"
              className="task-row__date"
              value={row.dueDate || ""}
              onChange={(e) =>
                handleNewRowDateChange(
                  row.tempId,
                  e.target.value
                )
              }
            />

            {/* Disabled checkbox for new task */}
            <input
              type="checkbox"
              className="task-row__checkbox"
              disabled
            />

            {/* Save */}
            <Button
              onClick={() =>
                handleSaveNewRow(row.tempId)
              }
            >
              Save
            </Button>

            {/* Cancel */}
            <Button
              variant="ghost"
              onClick={() =>
                handleCancelNewRow(row.tempId)
              }
            >
              Cancel
            </Button>
          </div>
        ))}

        {/* Empty state */}
        {tasks.length === 0 &&
          newRows.length === 0 && (
            <p className="task-list__empty">
              No tasks yet. Click “+ Add” to create one.
            </p>
          )}
      </div>
    </div>
  );
}
