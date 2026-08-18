import { STORAGE_KEYS } from "../constants";
import { readStorage, writeStorage } from "./storage";

// This is a frontend-only demo auth layer. There is no backend: any
// well-formed email/password combination is accepted so you can wire a
// real API in later without changing the calling code.

const FAKE_DELAY = 500;

function delay(fn) {
  return new Promise((resolve) => setTimeout(() => resolve(fn()), FAKE_DELAY));
}

export function login({ email, password }) {
  return delay(() => {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }
    const user = {
      id: "user_1",
      name: email.split("@")[0].replace(/[._]/g, " "),
      email,
    };
    writeStorage(STORAGE_KEYS.AUTH, user);
    return user;
  });
}

export function logout() {
  return delay(() => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    return true;
  });
}

export function requestPasswordReset(email) {
  return delay(() => {
    if (!email) throw new Error("Email is required.");
    return { sent: true };
  });
}

export function resetPassword() {
  return delay(() => ({ success: true }));
}

export function getStoredUser() {
  return readStorage(STORAGE_KEYS.AUTH, null);
}
