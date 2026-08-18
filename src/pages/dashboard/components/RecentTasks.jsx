import { Link } from "react-router-dom";
import Badge from "../../../components/Badge";
import { STATUS_LABELS } from "../../../constants";
import { formatDate, isOverdue } from "../../../utils/helpers";
import { ROUTES } from "../../../constants";

const STATUS_TONE = { todo: "neutral", "in-progress": "info", done: "success" };

export default function RecentTasks({ tasks }) {
  const recent = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="panel">
      <div className="panel__header">
        <h3 className="panel__title">Recent activity</h3>
        <Link to={ROUTES.TASKS} className="panel__link">View all</Link>
      </div>

      {recent.length === 0 ? (
        <p className="panel__empty">No tasks yet.</p>
      ) : (
        <table className="activity-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Status</th>
              <th>Due</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td><Badge tone={STATUS_TONE[task.status]}>{STATUS_LABELS[task.status]}</Badge></td>
                <td className={isOverdue(task.dueDate, task.status) ? "text-danger" : ""}>
                  {formatDate(task.dueDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
