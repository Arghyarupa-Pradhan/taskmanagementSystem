import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTasks } from "../../hooks";
import { PRIORITY_LABELS, ROUTES, STATUS_LABELS, TASK_STATUS } from "../../constants";
import { formatDate, generateId, isOverdue } from "../../utils/helpers";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import TaskForm from "./components/TaskForm";

const PRIORITY_TONE = { low: "neutral", medium: "warning", high: "danger" };
const STATUS_TONE = { todo: "neutral", "in-progress": "info", done: "success" };

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, projects, loading, editTask, removeTask } = useTasks();

  const task = useMemo(() => tasks.find((t) => t.id === id), [tasks, id]);
  const project = useMemo(
    () => projects.find((p) => p.id === task?.projectId),
    [projects, task]
  );

  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [newPointText, setNewPointText] = useState("");
  const [editingPointId, setEditingPointId] = useState(null);
  const [editingPointText, setEditingPointText] = useState("");

  const [newNoteText, setNewNoteText] = useState("");

  if (loading) {
    return (
      <div className="page-loader">
        <Loader label="Loading task…" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="page">
        <p>Task not found.</p>
        <Link to={ROUTES.TASKS}>Back to tasks</Link>
      </div>
    );
  }

  const checklist = task.checklist || [];
  const notes = task.notes || [];
  const overdue = isOverdue(task.dueDate, task.status);
  const isDone = task.status === TASK_STATUS.DONE;

  function updateChecklist(nextChecklist) {
    editTask(task.id, { checklist: nextChecklist });
  }

  function handleToggleTaskDone() {
    editTask(task.id, { status: isDone ? TASK_STATUS.TODO : TASK_STATUS.DONE });
  }

  function handleAddPoint(e) {
    e.preventDefault();
    const text = newPointText.trim();
    if (!text) return;
    updateChecklist([...checklist, { id: generateId("point"), text, done: false }]);
    setNewPointText("");
  }

  function handleTogglePoint(pointId) {
    updateChecklist(
      checklist.map((p) => (p.id === pointId ? { ...p, done: !p.done } : p))
    );
  }

  function handleDeletePoint(pointId) {
    updateChecklist(checklist.filter((p) => p.id !== pointId));
    if (editingPointId === pointId) setEditingPointId(null);
  }

  function startEditPoint(point) {
    setEditingPointId(point.id);
    setEditingPointText(point.text);
  }

  function handleSaveEditPoint(e) {
    e.preventDefault();
    const text = editingPointText.trim();
    if (!text) return;
    updateChecklist(
      checklist.map((p) => (p.id === editingPointId ? { ...p, text } : p))
    );
    setEditingPointId(null);
    setEditingPointText("");
  }

  function handleAddNote(e) {
    e.preventDefault();
    const text = newNoteText.trim();
    if (!text) return;
    const note = { id: generateId("note"), text, createdAt: new Date().toISOString() };
    editTask(task.id, { notes: [note, ...notes] });
    setNewNoteText("");
  }

  function handleDeleteNote(noteId) {
    editTask(task.id, { notes: notes.filter((n) => n.id !== noteId) });
  }

  function handleEditFormSubmit(data) {
    editTask(task.id, data);
    setShowEditForm(false);
  }

  function handleConfirmDelete() {
    removeTask(task.id);
    navigate(ROUTES.TASKS, { replace: true });
  }

  return (
    <div className="page">
      <Link to={ROUTES.TASKS} className="panel__link" style={{ display: "inline-block", marginBottom: 16 }}>
        ← Back to tasks
      </Link>

      <div className="page__header">
        <div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
            <Badge tone={STATUS_TONE[task.status]}>{STATUS_LABELS[task.status]}</Badge>
            <Badge tone={PRIORITY_TONE[task.priority]}>{PRIORITY_LABELS[task.priority]}</Badge>
            {project && <span className="task-card__project" style={{ "--dot-color": project.color }}>{project.name}</span>}
          </div>
          <p className={`page__subtitle${overdue ? " text-danger" : ""}`}>
            Due {formatDate(task.dueDate)}{overdue ? " · overdue" : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="ghost" onClick={() => setShowEditForm(true)}>Edit</Button>
          <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>Delete</Button>
        </div>
      </div>

      {/* Dark task card: title + points ("Aaj ka kaam") + note */}
      <div className="task-detail-card">
        <div className="task-detail-card__header">
          <h2 className="task-detail-card__title">{task.title}</h2>
          <input
            type="checkbox"
            className="task-detail-card__check"
            checked={isDone}
            onChange={handleToggleTaskDone}
            title={isDone ? "Mark as not done" : "Mark as done"}
          />
        </div>

        {task.description && (
          <p className="task-detail-card__description">{task.description}</p>
        )}

        <div className="task-detail-card__divider" />

        <div className="task-detail-card__section">
          <span className="task-detail-card__label">Aaj ka kaam</span>

          <form className="task-detail-card__add-row" onSubmit={handleAddPoint}>
            <input
              className="task-detail-card__input"
              value={newPointText}
              onChange={(e) => setNewPointText(e.target.value)}
              placeholder="Aaj ka kaam likho…"
            />
            <button type="submit" className="task-detail-card__icon-btn" title="Add">
              +
            </button>
          </form>

          {checklist.length > 0 && (
            <ul className="task-detail-card__points">
              {checklist.map((point) => (
                <li key={point.id} className="task-detail-card__point-row">
                  {editingPointId === point.id ? (
                    <form className="task-detail-card__edit-row" onSubmit={handleSaveEditPoint}>
                      <input
                        autoFocus
                        className="task-detail-card__input"
                        value={editingPointText}
                        onChange={(e) => setEditingPointText(e.target.value)}
                      />
                      <button type="submit" className="task-detail-card__icon-btn" title="Save">
                        ✓
                      </button>
                      <button
                        type="button"
                        className="task-detail-card__icon-btn"
                        title="Cancel"
                        onClick={() => setEditingPointId(null)}
                      >
                        ✕
                      </button>
                    </form>
                  ) : (
                    <>
                      <label className="task-detail-card__point-label">
                        <input
                          type="checkbox"
                          checked={point.done}
                          onChange={() => handleTogglePoint(point.id)}
                        />
                        <span
                          className={
                            point.done
                              ? "task-detail-card__point-text task-detail-card__point-text--done"
                              : "task-detail-card__point-text"
                          }
                        >
                          {point.text}
                        </span>
                      </label>
                      <div className="task-detail-card__point-actions">
                        <button
                          type="button"
                          className="task-detail-card__icon-btn task-detail-card__icon-btn--ghost"
                          title="Edit"
                          onClick={() => startEditPoint(point)}
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className="task-detail-card__icon-btn task-detail-card__icon-btn--ghost"
                          title="Delete"
                          onClick={() => handleDeletePoint(point.id)}
                        >
                          🗑
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="task-detail-card__divider" />

        <div className="task-detail-card__section">
          <span className="task-detail-card__label">Note</span>

          <form className="task-detail-card__note-form" onSubmit={handleAddNote}>
            <textarea
              className="task-detail-card__textarea"
              rows={3}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Note likho…"
            />
            <button type="submit" className="task-detail-card__icon-btn task-detail-card__note-add" title="Add note">
              +
            </button>
          </form>

          {notes.length > 0 && (
            <ul className="task-detail-card__notes">
              {notes.map((note) => (
                <li key={note.id} className="task-detail-card__note-row">
                  <div>
                    <p className="task-detail-card__note-text">{note.text}</p>
                    <span className="task-detail-card__note-date">
                      {formatDate(note.createdAt.slice(0, 10))}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="task-detail-card__icon-btn task-detail-card__icon-btn--ghost"
                    title="Delete note"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    🗑
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showEditForm && (
        <Modal title="Edit task" onClose={() => setShowEditForm(false)}>
          <TaskForm
            initialTask={task}
            projects={projects}
            onSubmit={handleEditFormSubmit}
            onCancel={() => setShowEditForm(false)}
          />
        </Modal>
      )}

      {showDeleteConfirm && (
        <Modal
          title="Delete task"
          onClose={() => setShowDeleteConfirm(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
              <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
            </>
          }
        >
          <p>Delete "{task.title}"? This can't be undone.</p>
        </Modal>
      )}
    </div>
  );
}
