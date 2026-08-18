import { Link } from "react-router-dom";
import Badge from "../../../components/Badge";
import { PRIORITY_LABELS } from "../../../constants";
import { formatDate, isOverdue, isDueSoon } from "../../../utils/helpers";

const PRIORITY_TONE = { low: "neutral", medium: "warning", high: "danger" };

export default function TaskCard({ task, project, onEdit, onDelete, draggable, onDragStart }) {
  const overdue = isOverdue(task.dueDate, task.status);
  const dueSoon = isDueSoon(task.dueDate, task.status);
  const checklist = task.checklist || [];
  const checklistDone = checklist.filter((i) => i.done).length;

  return (
    <article
      className="task-card"
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, task)}
    >
      <header className="task-card__header">
        <Badge tone={PRIORITY_TONE[task.priority]}>{PRIORITY_LABELS[task.priority]}</Badge>
        {project && (
          <span className="task-card__project" style={{ "--dot-color": project.color }}>
            {project.name}
          </span>
        )}
      </header>

      <Link to={`/tasks/${task.id}`} className="task-card__title-link">
        <h4 className="task-card__title">{task.title}</h4>
      </Link>
      {task.description && <p className="task-card__description">{task.description}</p>}

      {(checklist.length > 0 || task.assignee) && (
        <div className="task-card__meta">
          {task.assignee && <span className="task-card__meta-item">👤 {task.assignee}</span>}
          {checklist.length > 0 && (
            <span className="task-card__meta-item">
              ☑ {checklistDone}/{checklist.length}
            </span>
          )}
        </div>
      )}

      <footer className="task-card__footer">
        <span className={overdue ? "text-danger" : dueSoon ? "text-warning" : ""}>
          {formatDate(task.dueDate)}
          {overdue && " · overdue"}
        </span>
        <div className="task-card__actions">
          <button type="button" onClick={() => onEdit(task)}>Edit</button>
          <button type="button" onClick={() => onDelete(task)} className="text-danger">Delete</button>
        </div>
      </footer>
    </article>
  );
}
