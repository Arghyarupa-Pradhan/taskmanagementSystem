import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import * as projectService from "../services/projectService";
import * as teamService from "../services/teamService";
import * as taskApi from "../api/taskapi";

import { useAuth } from "../hooks/useAuth";

export const TaskContext = createContext(null);


// =========================================================
// NORMALIZE BACKEND TASK
// =========================================================

function normalizeTask(task) {
  return {
    ...task,

    // MongoDB ID
    id: task._id || task.id,

    // New task fields
    projectName: task.projectName || "",

    module: task.module || "",

    taskName:
      task.taskName ||
      task.task ||
      "",

    priority:
      task.priority ||
      "Medium",

    status:
      task.status ||
      "Pending",

    timeSpent:
      task.timeSpent ||
      "",

    note:
      task.note ||
      "",

    // Existing fields
    completed:
      Boolean(task.completed),

    employeeName:
      task.employeeName ||
      "",
  };
}


// =========================================================
// TASK PROVIDER
// =========================================================

export function TaskProvider({ children }) {

  const {
    user,
    loading: authLoading,
  } = useAuth();


  const [tasks, setTasks] = useState([]);

  const [projects, setProjects] = useState([]);

  const [teamMembers, setTeamMembers] = useState([]);

  const [loading, setLoading] = useState(true);


  // =========================================================
  // LOAD TASKS
  // =========================================================

  useEffect(() => {

    if (authLoading) {
      return;
    }


    if (!user) {

      setTasks([]);

      setLoading(false);

      return;
    }


    const loadTasks = async () => {

      try {

        setLoading(true);


        const response =
          await taskApi.getTasks();


        console.log(
          "Tasks from backend:",
          response.data
        );


        const backendTasks =
          Array.isArray(response.data)
            ? response.data
            : response.data?.tasks || [];


        const formattedTasks =
          backendTasks.map(
            normalizeTask
          );


        setTasks(
          formattedTasks
        );

      } catch (error) {

        console.error(
          "Failed to load tasks:",
          error.response?.data ||
            error.message
        );


        setTasks([]);

      } finally {

        setLoading(false);

      }

    };


    // Existing project/team data
    teamService.ensureSeeded();


    setProjects(
      projectService.getProjects()
    );


    setTeamMembers(
      teamService.getTeamMembers()
    );


    loadTasks();

  }, [user, authLoading]);


  // =========================================================
  // ADD TASK
  // =========================================================

  const addTask = useCallback(
    async (data) => {

      try {

        // =====================================================
        // DATA SENT TO BACKEND
        // =====================================================

        const taskData = {

          projectName:
            data.projectName || "",

          module:
            data.module || "",

          taskName:
            data.taskName || data.task || "",

          priority:
            data.priority || "Medium",

          status:
            data.status || "Pending",

          timeSpent:
            data.timeSpent || "",

          note:
            data.note || "",

          employeeName:
            data.employeeName ||
            user?.name ||
            "User",
        };


        console.log(
          "Creating task with data:",
          taskData
        );


        // =====================================================
        // API REQUEST
        // =====================================================

        const response =
          await taskApi.createTask(
            taskData
          );


        console.log(
          "Created task:",
          response.data
        );


        // =====================================================
        // GET CREATED TASK
        // =====================================================

        const createdRaw =
          response.data?.task ||
          response.data?.data ||
          response.data;


        const task =
          normalizeTask(
            createdRaw
          );


        // =====================================================
        // UPDATE FRONTEND LIST
        // =====================================================

        setTasks((prev) => [
          task,
          ...prev,
        ]);


        return task;

      } catch (error) {

        console.error(
          "Failed to create task:",
          error.response?.data ||
            error.message
        );


        throw error;
      }
    },
    [user]
  );


  // =========================================================
  // EDIT TASK
  // =========================================================

  const editTask = useCallback(
    async (id, updates) => {

      try {

        const updateData = {

          projectName:
            updates.projectName,

          module:
            updates.module,

          taskName:
            updates.taskName ||
            updates.task,

          priority:
            updates.priority,

          status:
            updates.status,

          timeSpent:
            updates.timeSpent,

          note:
            updates.note || "",

          employeeName:
            updates.employeeName,
        };


        console.log(
          "Updating task:",
          updateData
        );


        const response =
          await taskApi.updateTask(
            id,
            updateData
          );


        console.log(
          "Updated task:",
          response.data
        );


        const updatedRaw =
          response.data?.task ||
          response.data?.data ||
          response.data;


        const updatedTask =
          normalizeTask(
            updatedRaw
          );


        setTasks((prev) =>
          prev.map((task) =>
            task.id === id
              ? updatedTask
              : task
          )
        );


        return updatedTask;

      } catch (error) {

        console.error(
          "Failed to update task:",
          error.response?.data ||
            error.message
        );


        throw error;
      }

    },
    []
  );


  // =========================================================
  // DELETE TASK
  // =========================================================

  const removeTask = useCallback(
    async (id) => {

      try {

        await taskApi.deleteTask(
          id
        );


        console.log(
          "Deleted task:",
          id
        );


        setTasks((prev) =>
          prev.filter(
            (task) =>
              task.id !== id
          )
        );

      } catch (error) {

        console.error(
          "Failed to delete task:",
          error.response?.data ||
            error.message
        );


        throw error;
      }

    },
    []
  );


  // =========================================================
  // PROJECTS
  // =========================================================

  const addProject = useCallback(
    (data) => {

      const project =
        projectService.createProject(
          data
        );


      setProjects((prev) => [
        ...prev,
        project,
      ]);


      return project;
    },
    []
  );


  const removeProject =
    useCallback((id) => {

      projectService.deleteProject(
        id
      );


      setProjects((prev) =>
        prev.filter(
          (project) =>
            project.id !== id
        )
      );

    }, []);


  // =========================================================
  // TEAM MEMBERS
  // =========================================================

  const addTeamMember =
    useCallback((name) => {

      const next =
        teamService.addTeamMember(
          name
        );


      setTeamMembers(next);

    }, []);


  const removeTeamMember =
    useCallback((name) => {

      const next =
        teamService.removeTeamMember(
          name
        );


      setTeamMembers(next);

    }, []);


  // =========================================================
  // CONTEXT VALUE
  // =========================================================

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


  // =========================================================
  // PROVIDER
  // =========================================================

  return (
    <TaskContext.Provider
      value={value}
    >
      {children}
    </TaskContext.Provider>
  );
}