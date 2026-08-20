import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Dashboard from "../pages/dashboard/Dashboard";
import TaskBoard from "../pages/tasks/TaskBoard";
import TaskDetail from "../pages/tasks/TaskDetail";
import Report from "../pages/report/Report";
import Profile from "../pages/profile/Profile";

import NotFound from "../pages/NotFound";

import { ROUTES } from "../constants";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Default route */}
      <Route
        path="/"
        element={
          <Navigate
            to={ROUTES.DASHBOARD}
            replace
          />
        }
      />

      {/* ================= PUBLIC ROUTES ================= */}

      {/* Login */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Register */}
      <Route
        path={ROUTES.REGISTER}
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Forgot Password */}
      <Route
        path={ROUTES.FORGOT_PASSWORD}
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />

      {/* Reset Password */}
      <Route
        path={ROUTES.RESET_PASSWORD}
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* ================= PROTECTED ROUTES ================= */}

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route
          path={ROUTES.DASHBOARD}
          element={<Dashboard />}
        />

        {/* Tasks */}
        <Route
          path={ROUTES.TASKS}
          element={<TaskBoard />}
        />

        {/* Task Detail */}
        <Route
          path={ROUTES.TASK_DETAIL}
          element={<TaskDetail />}
        />

        {/* Report */}
        <Route
          path={ROUTES.REPORT}
          element={<Report />}
        />

        {/* Profile */}
        <Route
          path={ROUTES.PROFILE}
          element={<Profile />}
        />
      </Route>

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}