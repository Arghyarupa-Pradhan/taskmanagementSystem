import { STATUS_LABELS, TASK_STATUS } from "../../../constants";

const ORDER = [TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE];

export default function StatusChart({ tasks }) {
  const total = tasks.length || 1;
  const counts = ORDER.map((status) => ({
    status,
    count: tasks.filter((t) => t.status === status).length,
  }));

  return (
    <div className="panel">
      <h3 className="panel__title">Tasks by status</h3>
      <div className="bar-chart">
        {counts.map(({ status, count }) => (
          <div className="bar-chart__row" key={status}>
            <span className="bar-chart__label">{STATUS_LABELS[status]}</span>
            <div className="bar-chart__track">
              <div
                className={`bar-chart__fill bar-chart__fill--${status}`}
                style={{ width: `${(count / total) * 100}%` }}
              />
            </div>
            <span className="bar-chart__count">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
