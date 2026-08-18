import { PRIORITY_LABELS, TASK_PRIORITY } from "../../../constants";
import Badge from "../../../components/Badge";

const ORDER = [TASK_PRIORITY.HIGH, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.LOW];
const TONE = { high: "danger", medium: "warning", low: "neutral" };

export default function PriorityBreakdown({ tasks }) {
  return (
    <div className="panel">
      <h3 className="panel__title">By priority</h3>
      <ul className="priority-list">
        {ORDER.map((priority) => {
          const count = tasks.filter((t) => t.priority === priority).length;
          return (
            <li key={priority} className="priority-list__item">
              <Badge tone={TONE[priority]}>{PRIORITY_LABELS[priority]}</Badge>
              <span>{count} task{count === 1 ? "" : "s"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
