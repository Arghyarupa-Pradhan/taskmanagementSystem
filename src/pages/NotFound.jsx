import { Link } from "react-router-dom";
import { ROUTES } from "../constants";

export default function NotFound() {
  return (
    <div className="not-found">
      <span className="not-found__code">404</span>
      <h1>This page wandered off</h1>
      <p>The page you're looking for doesn't exist or was moved.</p>
      <Link to={ROUTES.DASHBOARD}>Back to dashboard</Link>
    </div>
  );
}
