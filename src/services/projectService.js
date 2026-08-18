import { STORAGE_KEYS } from "../constants";
import { generateId } from "../utils/helpers";
import { readStorage, writeStorage } from "./storage";

const PALETTE = ["#2F6F4E", "#2E5EAA", "#C0392B", "#8A5FBF", "#B8752E"];

export function getProjects() {
  return readStorage(STORAGE_KEYS.PROJECTS, []);
}

export function saveProjects(projects) {
  writeStorage(STORAGE_KEYS.PROJECTS, projects);
}

export function createProject(data) {
  const projects = getProjects();
  const project = {
    id: generateId("proj"),
    color: PALETTE[projects.length % PALETTE.length],
    ...data,
  };
  const next = [...projects, project];
  saveProjects(next);
  return project;
}

export function deleteProject(id) {
  saveProjects(getProjects().filter((p) => p.id !== id));
}
