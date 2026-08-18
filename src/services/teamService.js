import { DEFAULT_TEAM_MEMBERS, STORAGE_KEYS } from "../constants";
import { readStorage, writeStorage } from "./storage";

export function ensureSeeded() {
  const existing = readStorage(STORAGE_KEYS.TEAM, null);
  if (existing === null) {
    writeStorage(STORAGE_KEYS.TEAM, DEFAULT_TEAM_MEMBERS);
  }
}

export function getTeamMembers() {
  return readStorage(STORAGE_KEYS.TEAM, DEFAULT_TEAM_MEMBERS);
}

export function saveTeamMembers(members) {
  writeStorage(STORAGE_KEYS.TEAM, members);
}

export function addTeamMember(name) {
  const trimmed = name.trim();
  if (!trimmed) return getTeamMembers();
  const members = getTeamMembers();
  if (members.some((m) => m.toLowerCase() === trimmed.toLowerCase())) {
    return members;
  }
  const next = [...members, trimmed];
  saveTeamMembers(next);
  return next;
}

export function removeTeamMember(name) {
  const next = getTeamMembers().filter((m) => m !== name);
  saveTeamMembers(next);
  return next;
}
