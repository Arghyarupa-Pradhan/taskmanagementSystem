

// import {
//   createContext,
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import * as projectService from "../services/projectService";
// import * as teamService from "../services/teamService";
// import * as taskApi from "../api/taskapi";

// import { useAuth } from "../hooks/useAuth";
// import { TASK_STATUS } from "../constants";

// export const TaskContext = createContext(null);

// // Convert backend task → frontend task
// function normalizeTask(task) {
//   return {
//     ...task,

//     // MongoDB ID
//     id: task._id || task.id,

//     // Backend taskName → frontend title
//     title: task.taskName || task.title || "",

//     // Backend completed → frontend status
//     status: task.completed
//       ? TASK_STATUS.DONE
//       : TASK_STATUS.TODO,

//     // Backend creationDate → frontend dueDate
//     dueDate: task.creationDate
//       ? new Date(task.creationDate).toISOString().split("T")[0]
//       : "",
//   };
// }

// export function TaskProvider({ children }) {
//   const { user, loading: authLoading } = useAuth();

//   const [tasks, setTasks] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [teamMembers, setTeamMembers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // =========================
//   // LOAD TASKS
//   // =========================

//   useEffect(() => {
//     if (authLoading) {
//       return;
//     }

//     if (!user) {
//       setTasks([]);
//       setLoading(false);
//       return;
//     }

//     const loadTasks = async () => {
//       try {
//         setLoading(true);

//         const response = await taskApi.getTasks();

//         console.log("Tasks from backend:", response.data);

//         const backendTasks = Array.isArray(response.data)
//           ? response.data
//           : response.data.tasks || [];

//         const formattedTasks = backendTasks.map(normalizeTask);

//         setTasks(formattedTasks);
//       } catch (error) {
//         console.error(
//           "Failed to load tasks:",
//           error.response?.data || error.message
//         );

//         setTasks([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     teamService.ensureSeeded();

//     setProjects(projectService.getProjects());
//     setTeamMembers(teamService.getTeamMembers());

//     loadTasks();
//   }, [user, authLoading]);

//   // =========================
//   // ADD TASK
//   // =========================

//   const addTask = useCallback(
//     async (data) => {
//       try {
//         const response = await taskApi.createTask({
//           employeeName: user?.name || "User",
//           taskName: data.title,
//           creationDate:
//             data.dueDate || new Date().toISOString(),
//           time: new Date().toTimeString().slice(0, 5),
//           completed: false,
//           note: data.note || "",
//         });

//         console.log("Created task:", response.data);

//         const createdRaw =
//   response.data?.task ||
//   response.data?.data ||
//   response.data;

// const task = normalizeTask(createdRaw);

// setTasks((prev) => [task, ...prev]);

// return task;
//       } catch (error) {
//         console.error(
//           "Failed to create task:",
//           error.response?.data || error.message
//         );

//         throw error;
//       }
//     },
//     [user]
//   );

//   // =========================
//   // EDIT / COMPLETE TASK
//   // =========================

//   const editTask = useCallback(async (id, updates) => {
//     try {
//       const backendUpdates = {};

//       // Frontend status → backend completed
//       if (updates.status !== undefined) {
//         backendUpdates.completed =
//           updates.status === TASK_STATUS.DONE;
//       }

//       // Frontend title → backend taskName
//       if (updates.title !== undefined) {
//         backendUpdates.taskName = updates.title;
//       }

//       const response = await taskApi.updateTask(
//         id,
//         backendUpdates
//       );

//       console.log("Updated task:", response.data);

//       const updatedTask = normalizeTask(response.data);

//       setTasks((prev) =>
//         prev.map((task) =>
//           task.id === id ? updatedTask : task
//         )
//       );

//       return updatedTask;
//     } catch (error) {
//       console.error(
//         "Failed to update task:",
//         error.response?.data || error.message
//       );

//       throw error;
//     }
//   }, []);

//   // =========================
//   // DELETE TASK
//   // =========================

//   const removeTask = useCallback(async (id) => {
//     try {
//       await taskApi.deleteTask(id);

//       console.log("Deleted task:", id);

//       setTasks((prev) =>
//         prev.filter((task) => task.id !== id)
//       );
//     } catch (error) {
//       console.error(
//         "Failed to delete task:",
//         error.response?.data || error.message
//       );

//       throw error;
//     }
//   }, []);

//   // =========================
//   // PROJECTS
//   // =========================

//   const addProject = useCallback((data) => {
//     const project = projectService.createProject(data);

//     setProjects((prev) => [...prev, project]);

//     return project;
//   }, []);

//   const removeProject = useCallback((id) => {
//     projectService.deleteProject(id);

//     setProjects((prev) =>
//       prev.filter((project) => project.id !== id)
//     );
//   }, []);

//   // =========================
//   // TEAM MEMBERS
//   // =========================

//   const addTeamMember = useCallback((name) => {
//     const next = teamService.addTeamMember(name);

//     setTeamMembers(next);
//   }, []);

//   const removeTeamMember = useCallback((name) => {
//     const next = teamService.removeTeamMember(name);

//     setTeamMembers(next);
//   }, []);

//   // =========================
//   // CONTEXT VALUE
//   // =========================

//   const value = useMemo(
//     () => ({
//       tasks,
//       projects,
//       teamMembers,
//       loading,

//       addTask,
//       editTask,
//       removeTask,

//       addProject,
//       removeProject,

//       addTeamMember,
//       removeTeamMember,
//     }),
//     [
//       tasks,
//       projects,
//       teamMembers,
//       loading,
//       addTask,
//       editTask,
//       removeTask,
//       addProject,
//       removeProject,
//       addTeamMember,
//       removeTeamMember,
//     ]
//   );

//   return (
//     <TaskContext.Provider value={value}>
//       {children}
//     </TaskContext.Provider>
//   );
// }



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
import { TASK_STATUS } from "../constants";

export const TaskContext = createContext(null);

// Convert backend task → frontend task
function normalizeTask(task) {
  return {
    ...task,

    // MongoDB ID
    id: task._id || task.id,

    // Backend taskName → frontend title
    title: task.taskName || task.title || "",

    // Backend completed → frontend status
    status: task.completed
      ? TASK_STATUS.DONE
      : TASK_STATUS.TODO,

    // Backend creationDate → frontend dueDate
    dueDate: task.creationDate
      ? new Date(task.creationDate).toISOString().split("T")[0]
      : "",
  };
}

export function TaskProvider({ children }) {
  const { user, loading: authLoading } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD TASKS
  // =========================

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

        const response = await taskApi.getTasks();

        console.log("Tasks from backend:", response.data);

        const backendTasks = Array.isArray(response.data)
          ? response.data
          : response.data.tasks || [];

        const formattedTasks = backendTasks.map(normalizeTask);

        setTasks(formattedTasks);
      } catch (error) {
        console.error(
          "Failed to load tasks:",
          error.response?.data || error.message
        );

        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    teamService.ensureSeeded();

    setProjects(projectService.getProjects());
    setTeamMembers(teamService.getTeamMembers());

    loadTasks();
  }, [user, authLoading]);

  // =========================
  // ADD TASK
  // =========================

  const addTask = useCallback(
    async (data) => {
      try {
        const response = await taskApi.createTask({
          employeeName: user?.name || "User",
          taskName: data.title,
          creationDate:
            data.dueDate || new Date().toISOString(),
          time: new Date().toTimeString().slice(0, 5),
          completed: false,
          note: data.note || "",
        });

        console.log("Created task:", response.data);

        // Backend may wrap the created task in { task: {...} } or
        // { data: {...} } instead of returning it directly — unwrap safely.
        const createdRaw =
          response.data?.task ||
          response.data?.data ||
          response.data;

        const task = normalizeTask(createdRaw);

        setTasks((prev) => [task, ...prev]);

        return task;
      } catch (error) {
        console.error(
          "Failed to create task:",
          error.response?.data || error.message
        );

        throw error;
      }
    },
    [user]
  );

  // =========================
  // EDIT / COMPLETE TASK
  // =========================

  const editTask = useCallback(async (id, updates) => {
    try {
      const backendUpdates = {};

      // Frontend status → backend completed
      if (updates.status !== undefined) {
        backendUpdates.completed =
          updates.status === TASK_STATUS.DONE;
      }

      // Frontend title → backend taskName
      if (updates.title !== undefined) {
        backendUpdates.taskName = updates.title;
      }

      const response = await taskApi.updateTask(
        id,
        backendUpdates
      );

      console.log("Updated task:", response.data);

      // Backend may wrap the updated task in { task: {...} } or
      // { data: {...} } instead of returning it directly — unwrap safely.
      const updatedRaw =
        response.data?.task ||
        response.data?.data ||
        response.data;

      const updatedTask = normalizeTask(updatedRaw);

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? updatedTask : task
        )
      );

      return updatedTask;
    } catch (error) {
      console.error(
        "Failed to update task:",
        error.response?.data || error.message
      );

      throw error;
    }
  }, []);

  // =========================
  // DELETE TASK
  // =========================

  const removeTask = useCallback(async (id) => {
    try {
      await taskApi.deleteTask(id);

      console.log("Deleted task:", id);

      setTasks((prev) =>
        prev.filter((task) => task.id !== id)
      );
    } catch (error) {
      console.error(
        "Failed to delete task:",
        error.response?.data || error.message
      );

      throw error;
    }
  }, []);

  // =========================
  // PROJECTS
  // =========================

  const addProject = useCallback((data) => {
    const project = projectService.createProject(data);

    setProjects((prev) => [...prev, project]);

    return project;
  }, []);

  const removeProject = useCallback((id) => {
    projectService.deleteProject(id);

    setProjects((prev) =>
      prev.filter((project) => project.id !== id)
    );
  }, []);

  // =========================
  // TEAM MEMBERS
  // =========================

  const addTeamMember = useCallback((name) => {
    const next = teamService.addTeamMember(name);

    setTeamMembers(next);
  }, []);

  const removeTeamMember = useCallback((name) => {
    const next = teamService.removeTeamMember(name);

    setTeamMembers(next);
  }, []);

  // =========================
  // CONTEXT VALUE
  // =========================

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

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}