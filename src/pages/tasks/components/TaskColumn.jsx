import { STATUS_LABELS } from "../../../constants";
import TaskCard from "./TaskCard";
import EmptyState from "../../../components/EmptyState";

export default function TaskColumn({ status, tasks, projectsById, onEdit, onDelete, onDrop, onDragStart }) {
  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    onDrop(taskId, status);
  }

  return (
    <div className="task-column" onDragOver={handleDragOver} onDrop={handleDrop}>
      <div className="task-column__header">
        <h3>{STATUS_LABELS[status]}</h3>
        <span className="task-column__count">{tasks.length}</span>
      </div>

      <div className="task-column__list">
        {tasks.length === 0 ? (
          <EmptyState title="No tasks here" description="Drag a card over, or add a new task." />
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              project={projectsById[task.projectId]}
              onEdit={onEdit}
              onDelete={onDelete}
              draggable
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
}
