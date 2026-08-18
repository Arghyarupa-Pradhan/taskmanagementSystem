import { STORAGE_KEYS, TASK_PRIORITY, TASK_STATUS } from "../constants";
import { generateId } from "../utils/helpers";
import { readStorage, writeStorage } from "./storage";

function seedTasks() {
  const today = new Date();
  const inDays = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };
  const createdAt = (n, hour = 9, minute = 0) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  };
  return [
    {
      id: generateId("task"),
      title: "Define sprint goals",
      description: "Align with the team on scope for the next two-week sprint.",
      status: TASK_STATUS.DONE,
      priority: TASK_PRIORITY.MEDIUM,
      projectId: "proj_1",
      assignee: "Aarav Sharma",
      dueDate: inDays(-3),
      createdAt: createdAt(-10, 9, 15),
      checklist: [
        { id: generateId("point"), text: "Collect team input", done: true },
        { id: generateId("point"), text: "Finalize scope doc", done: true },
      ],
      notes: [],
    },
    {
      id: generateId("task"),
      title: "Design task board UI",
      description: "Draft the kanban layout and column states.",
      status: TASK_STATUS.IN_PROGRESS,
      priority: TASK_PRIORITY.HIGH,
      projectId: "proj_1",
      assignee: "Priya Nair",
      dueDate: inDays(1),
      createdAt: createdAt(-6, 11, 30),
      checklist: [
        { id: generateId("point"), text: "Wireframe columns", done: true },
        { id: generateId("point"), text: "Style task cards", done: false },
      ],
      notes: [],
    },
    {
      id: generateId("task"),
      title: "Set up CI pipeline",
      description: "Add lint and build checks on pull requests.",
      status: TASK_STATUS.TODO,
      priority: TASK_PRIORITY.MEDIUM,
      projectId: "proj_2",
      assignee: "Rohan Mehta",
      dueDate: inDays(5),
      createdAt: createdAt(-2, 10, 30),
      checklist: [],
      notes: [],
    },
    {
      id: generateId("task"),
      title: "Fix overdue invoice export bug",
      description: "Export button silently fails for date ranges over 90 days.",
      status: TASK_STATUS.TODO,
      priority: TASK_PRIORITY.HIGH,
      projectId: "proj_2",
      assignee: "Rohan Mehta",
      dueDate: inDays(-1),
      createdAt: createdAt(-4, 14, 0),
      checklist: [
        { id: generateId("point"), text: "Reproduce the bug", done: true },
        { id: generateId("point"), text: "Write a fix", done: false },
      ],
      notes: [],
    },
    {
      id: generateId("task"),
      title: "Write onboarding docs",
      description: "Cover account setup and first project creation.",
      status: TASK_STATUS.TODO,
      priority: TASK_PRIORITY.LOW,
      projectId: "proj_1",
      assignee: "Sneha Iyer",
      dueDate: inDays(9),
      createdAt: createdAt(-1, 16, 45),
      checklist: [],
      notes: [],
    },
  ];
}

function seedProjects() {
  return [
    { id: "proj_1", name: "Product Launch", color: "#2F6F4E", description: "Core app launch workstream." },
    { id: "proj_2", name: "Platform Reliability", color: "#2E5EAA", description: "Bugs, infra, and tooling." },
  ];
}

export function ensureSeeded() {
  const tasks = readStorage(STORAGE_KEYS.TASKS, null);
  const projects = readStorage(STORAGE_KEYS.PROJECTS, null);
  if (!tasks) writeStorage(STORAGE_KEYS.TASKS, seedTasks());
  if (!projects) writeStorage(STORAGE_KEYS.PROJECTS, seedProjects());
}

export function getTasks() {
  return readStorage(STORAGE_KEYS.TASKS, []);
}

export function saveTasks(tasks) {
  writeStorage(STORAGE_KEYS.TASKS, tasks);
}

export function createTask(data) {
  const tasks = getTasks();
  const task = {
    id: generateId("task"),
    status: TASK_STATUS.TODO,
    priority: TASK_PRIORITY.MEDIUM,
    createdAt: new Date().toISOString(),
    ...data,
  };
  const next = [task, ...tasks];
  saveTasks(next);
  return task;
}

export function updateTask(id, updates) {
  const tasks = getTasks();
  const next = tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
  saveTasks(next);
  return next.find((t) => t.id === id);
}

export function deleteTask(id) {
  const tasks = getTasks();
  saveTasks(tasks.filter((t) => t.id !== id));
}
