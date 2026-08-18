import { useAuth, useTasks } from "../../hooks";
import { initials } from "../../utils/helpers";

export default function Profile() {
  const { user } = useAuth();
  const { tasks } = useTasks();

  const completed = tasks.filter((t) => t.status === "done").length;

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1>Profile</h1>
          <p className="page__subtitle">Your account details.</p>
        </div>
      </div>

      <div className="panel profile-panel">
        <span className="avatar avatar--lg" aria-hidden="true">{initials(user?.name || user?.email || "U")}</span>
        <div>
          <h3>{user?.name || "User"}</h3>
          <p>{user?.email}</p>
          <p className="profile-panel__stat">{completed} task{completed === 1 ? "" : "s"} completed</p>
        </div>
      </div>
    </div>
  );
}
