import { PRIORITY_LABELS, TASK_PRIORITY } from "../../../constants";

export default function TaskFilters({ search, onSearchChange, priority, onPriorityChange, projectId, onProjectChange, projects }) {
  return (
    <div className="task-filters">
      <input
        type="search"
        placeholder="Search tasks…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="task-filters__search"
      />

      <select value={priority} onChange={(e) => onPriorityChange(e.target.value)}>
        <option value="">All priorities</option>
        {Object.values(TASK_PRIORITY).map((p) => (
          <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
        ))}
      </select>

      <select value={projectId} onChange={(e) => onProjectChange(e.target.value)}>
        <option value="">All projects</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>
  );
}
