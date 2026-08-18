import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { initials } from "../utils/helpers";
import { ROUTES } from "../constants";
import "./MainLayout.css";

const NAV_ITEMS = [
  {
    to: ROUTES.DASHBOARD,
    label: "Dashboard",
    icon: "◇",
  },
  {
    to: ROUTES.TASKS,
    label: "Tasks",
    icon: "▤",
  },
  {
    to: ROUTES.REPORT,
    label: "Report",
    icon: "▦",
  },
];

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);

  async function handleLogout() {
    await logout();
    navigate(ROUTES.LOGIN, {
      replace: true,
    });
  }

  return (
    <div className="app-shell">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="sidebar">

        <div className="sidebar__brand">
          <span
            className="brand-mark"
            aria-hidden="true"
          />

          <span>Taskline</span>
        </div>

        <nav className="sidebar__nav">

          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar__link${
                  isActive
                    ? " sidebar__link--active"
                    : ""
                }`
              }
            >
              <span
                className="sidebar__icon"
                aria-hidden="true"
              >
                {item.icon}
              </span>

              {item.label}
            </NavLink>
          ))}

        </nav>

        {/* =========================
            SIDEBAR USER
        ========================= */}

        <button
          type="button"
          className="sidebar__user"
          onClick={() =>
            navigate(ROUTES.PROFILE)
          }
        >
          <span
            className="avatar"
            aria-hidden="true"
          >
            {initials(
              user?.name ||
                user?.email ||
                "U"
            )}
          </span>

          <span className="sidebar__user-info">

            <strong>
              {user?.name || "User"}
            </strong>

            <small>
              {user?.email}
            </small>

          </span>
        </button>

      </aside>


      {/* =========================
          MAIN AREA
      ========================= */}

      <div className="app-shell__main">

        {/* =========================
            TOPBAR
        ========================= */}

        <header className="topbar">

          <div className="topbar__spacer" />


          {/* =========================
              USER AVATAR
          ========================= */}

          <div className="user-menu">

            <button
              type="button"
              className="user-avatar-button"
              onClick={() =>
                setShowUserMenu(
                  (value) => !value
                )
              }
              aria-label="Show email"
            >
              <span
                className="avatar avatar--sm"
                aria-hidden="true"
              >
                {initials(
                  user?.name ||
                    user?.email ||
                    "U"
                )}
              </span>
            </button>


            {/* =========================
                EMAIL ONLY
            ========================= */}

            {showUserMenu && (
              <div className="user-email-popup">
                {user?.email?.toLowerCase() ||
                  "No email available"}
              </div>
            )}

          </div>


          {/* =========================
              SIGN OUT
          ========================= */}

          <button
            type="button"
            className="topbar__logout"
            onClick={handleLogout}
          >
            Sign out
          </button>

        </header>


        {/* =========================
            PAGE CONTENT
        ========================= */}

        <main className="app-shell__content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}