import { useContext } from "react";
import { TaskContext } from "../contexts/TaskContext";

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within a TaskProvider");
  return ctx;
}
