import { useMemo } from "react";
import { useAuth, useTasks } from "../../hooks";
import { isOverdue } from "../../utils/helpers";
import Loader from "../../components/Loader";
import StatsCards from "./components/StatsCards";
import StatusChart from "./components/StatusChart";
import PriorityBreakdown from "./components/PriorityBreakdown";
import RecentTasks from "./components/RecentTasks";

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, loading } = useTasks();

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      done: tasks.filter((t) => t.status === "done").length,
      overdue: tasks.filter((t) => isOverdue(t.dueDate, t.status)).length,
    };
  }, [tasks]);

  if (loading) {
    return (
      <div className="page-loader">
        <Loader label="Loading your dashboard…" />
      </div>
    );
  }

  const firstName = (user?.name || "there").split(" ")[0];

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1>Good to see you, {firstName}</h1>
          <p className="page__subtitle">Here's where things stand across your work today.</p>
        </div>
      </div>

      <StatsCards stats={stats} />

      <div className="dashboard-grid">
        <StatusChart tasks={tasks} />
        <PriorityBreakdown tasks={tasks} />
      </div>

      <RecentTasks tasks={tasks} />
    </div>
  );
}
