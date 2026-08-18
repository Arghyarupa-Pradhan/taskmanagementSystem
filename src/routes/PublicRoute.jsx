import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { ROUTES } from "../constants";

export default function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} replace />;

  return children;
}
