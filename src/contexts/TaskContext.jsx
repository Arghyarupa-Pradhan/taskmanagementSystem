import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import * as taskService from "../services/taskService";
import * as projectService from "../services/projectService";
import * as teamService from "../services/teamService";

export const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taskService.ensureSeeded();
    teamService.ensureSeeded();
    setTasks(taskService.getTasks());
    setProjects(projectService.getProjects());
    setTeamMembers(teamService.getTeamMembers());
    setLoading(false);
  }, []);

  const addTask = useCallback((data) => {
    const task = taskService.createTask(data);
    setTasks((prev) => [task, ...prev]);
    return task;
  }, []);

  const editTask = useCallback((id, updates) => {
    const updated = taskService.updateTask(id, updates);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const removeTask = useCallback((id) => {
    taskService.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addProject = useCallback((data) => {
    const project = projectService.createProject(data);
    setProjects((prev) => [...prev, project]);
    return project;
  }, []);

  const removeProject = useCallback((id) => {
    projectService.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addTeamMember = useCallback((name) => {
    const next = teamService.addTeamMember(name);
    setTeamMembers(next);
  }, []);

  const removeTeamMember = useCallback((name) => {
    const next = teamService.removeTeamMember(name);
    setTeamMembers(next);
  }, []);

  const value = useMemo(
    () => ({
      tasks,
      projects,
      teamMembers,
      loading,
      addTask,
      editTask,
      removeTask,
      addProject,
      removeProject,
      addTeamMember,
      removeTeamMember,
    }),
    [
      tasks,
      projects,
      teamMembers,
      loading,
      addTask,
      editTask,
      removeTask,
      addProject,
      removeProject,
      addTeamMember,
      removeTeamMember,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
