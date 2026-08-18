# Taskline — Task Management System

A frontend-only React task management system, built with the same folder
structure and conventions as your education management system project
(Vite + React + React Router, organized into `app/`, `pages/`, `layouts/`,
`routes/`, `contexts/`, `hooks/`, `services/`, `components/`, `constants/`,
`utils/`).

There is no backend. All data (tasks, projects, the signed-in user, and
settings) is stored in the browser's `localStorage`, so it persists across
reloads but is local to your browser.

## Getting started

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

Sign in with **any email address** and a password of **6+ characters** —
there's no real backend, so any well-formed credentials work.

## What's included

- **Auth flow**: Login, Forgot password, Reset password (all frontend-only,
  see `src/services/authService.js`)
- **Dashboard**: task stats, status/priority breakdown, recent activity
- **Tasks**: kanban board (To Do / In Progress / Done) with drag-and-drop,
  search, filter by priority/project, create/edit/delete
- **Projects**: create, list, delete, and tag tasks with a project
- **Profile** and **Settings** pages
- Protected routes that redirect to `/login` when signed out

## Folder structure

```
src/
  app/            Root App component (providers + router)
  assets/         Static assets
  components/     Reusable UI: Button, Badge, Modal, EmptyState, Loader
  constants/      Enums, storage keys, route paths
  contexts/       AuthContext, TaskContext
  hooks/          useAuth, useTasks, useLocalStorage, useDebouncedValue
  layouts/        MainLayout (sidebar + topbar)
  pages/
    auth/         Login, ForgotPassword, ResetPassword
    dashboard/    Dashboard + its components
    tasks/        TaskBoard (kanban) + its components
    projects/     ProjectList + its components
    profile/      Profile
    settings/     Settings
    NotFound.jsx
  routes/         AppRoutes, ProtectedRoute, PublicRoute
  services/       storage.js, authService.js, taskService.js, projectService.js
  utils/          helpers.js, validators.js
  index.css       Design tokens and all component styles
  main.jsx        Entry point
```

## Wiring up a real backend later

Every read/write goes through the `services/` layer (`authService.js`,
`taskService.js`, `projectService.js`). Swap the `localStorage` calls inside
those files for `fetch`/axios calls to your API - the rest of the app
(contexts, hooks, pages) doesn't need to change since it only talks to
those service functions.
