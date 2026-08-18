export default function StatsCards({ stats }) {
  const items = [
    { label: "Total tasks", value: stats.total, tone: "neutral" },
    { label: "In progress", value: stats.inProgress, tone: "info" },
    { label: "Completed", value: stats.done, tone: "success" },
    { label: "Overdue", value: stats.overdue, tone: "danger" },
  ];

  return (
    <div className="stats-grid">
      {items.map((item) => (
        <div key={item.label} className={`stat-card stat-card--${item.tone}`}>
          <span className="stat-card__value">{item.value}</span>
          <span className="stat-card__label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
