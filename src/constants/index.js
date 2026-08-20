export const TASK_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  DONE: "done",
};

export const STATUS_LABELS = {
  [TASK_STATUS.TODO]: "To Do",
  [TASK_STATUS.IN_PROGRESS]: "In Progress",
  [TASK_STATUS.DONE]: "Done",
};

export const TASK_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

export const PRIORITY_LABELS = {
  [TASK_PRIORITY.LOW]: "Low",
  [TASK_PRIORITY.MEDIUM]: "Medium",
  [TASK_PRIORITY.HIGH]: "High",
};

export const STORAGE_KEYS = {
  AUTH: "tms_auth_user",
  TASKS: "tms_tasks",
  PROJECTS: "tms_projects",
  TEAM: "tms_team",
};

// Default team members, seeded into storage on first run.
// After that, the list is managed from the UI (Report → Add person) and
// stored in localStorage, so edit it there rather than here.
export const DEFAULT_TEAM_MEMBERS = [
  "Aarav Sharma",
  "Priya Nair",
  "Rohan Mehta",
  "Sneha Iyer",
  "Karan Patel",
];

export const ROUTES = {
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
  TASKS: "/tasks",
  TASK_DETAIL: "/tasks/:id",
  REPORT: "/report",
  PROFILE: "/profile",
  REGISTER: "/register",  
};