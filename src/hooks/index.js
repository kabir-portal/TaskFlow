import { useApp } from '../context/AppContext.jsx';
import { useMemo, useCallback } from 'react';

export function useProjects() {
  const { state, dispatch } = useApp();

  const addProject = useCallback(
    (project) => {
      dispatch({ type: 'ADD_PROJECT', payload: project });
    },
    [dispatch]
  );

  const updateProject = useCallback(
    (id, updates) => {
      dispatch({ type: 'UPDATE_PROJECT', payload: { id, ...updates } });
    },
    [dispatch]
  );

  const deleteProject = useCallback(
    (id) => {
      dispatch({ type: 'DELETE_PROJECT', payload: id });
    },
    [dispatch]
  );

  return { projects: state.projects, addProject, updateProject, deleteProject };
}

export function useColumns(projectId) {
  const { state, dispatch } = useApp();

  const columns = useMemo(
    () =>
      projectId
        ? state.columns.filter((c) => c.projectId === projectId).sort((a, b) => a.position - b.position)
        : state.columns,
    [state.columns, projectId]
  );

  const addColumn = useCallback(
    (column) => {
      dispatch({ type: 'ADD_COLUMN', payload: column });
    },
    [dispatch]
  );

  const updateColumn = useCallback(
    (id, updates) => {
      dispatch({ type: 'UPDATE_COLUMN', payload: { id, ...updates } });
    },
    [dispatch]
  );

  const deleteColumn = useCallback(
    (columnId, moveToColumnId = null) => {
      dispatch({ type: 'DELETE_COLUMN', payload: { columnId, moveToColumnId } });
    },
    [dispatch]
  );

  const reorderColumns = useCallback(
    (columnIds) => {
      dispatch({ type: 'REORDER_COLUMNS', payload: { projectId, columnIds } });
    },
    [dispatch, projectId]
  );

  const toggleCollapse = useCallback(
    (columnId) => {
      dispatch({ type: 'TOGGLE_COLUMN_COLLAPSE', payload: columnId });
    },
    [dispatch]
  );

  const moveAllTasks = useCallback(
    (fromColumnId, toColumnId) => {
      dispatch({ type: 'MOVE_ALL_TASKS', payload: { fromColumnId, toColumnId } });
    },
    [dispatch]
  );

  return { columns, addColumn, updateColumn, deleteColumn, reorderColumns, toggleCollapse, moveAllTasks };
}

export function useTasks(columnId = null, projectId = null) {
  const { state, dispatch } = useApp();

  const tasks = useMemo(() => {
    let filtered = state.tasks;
    if (columnId) filtered = filtered.filter((t) => t.columnId === columnId && !t.archivedAt);
    if (projectId) filtered = filtered.filter((t) => t.projectId === projectId && !t.archivedAt);
    return filtered;
  }, [state.tasks, columnId, projectId]);

  const addTask = useCallback(
    (task) => {
      dispatch({ type: 'ADD_TASK', payload: task });
    },
    [dispatch]
  );

  const updateTask = useCallback(
    (id, updates) => {
      dispatch({ type: 'UPDATE_TASK', payload: { id, ...updates } });
    },
    [dispatch]
  );

  const deleteTask = useCallback(
    (id) => {
      dispatch({ type: 'DELETE_TASK', payload: id });
    },
    [dispatch]
  );

  const archiveTask = useCallback(
    (id) => {
      dispatch({ type: 'ARCHIVE_TASK', payload: id });
    },
    [dispatch]
  );

  const duplicateTask = useCallback(
    (originalId, newId, newTaskId) => {
      dispatch({ type: 'DUPLICATE_TASK', payload: { originalId, newId, newTaskId } });
    },
    [dispatch]
  );

  const moveTask = useCallback(
    (taskId, fromColumnId, toColumnId, newIndex) => {
      dispatch({ type: 'MOVE_TASK', payload: { taskId, fromColumnId, toColumnId, newIndex } });
    },
    [dispatch]
  );

  const addSubtask = useCallback(
    (taskId, subtask) => {
      dispatch({ type: 'ADD_SUBTASK', payload: { taskId, subtask } });
    },
    [dispatch]
  );

  const updateSubtask = useCallback(
    (taskId, subtaskId, updates) => {
      dispatch({ type: 'UPDATE_SUBTASK', payload: { taskId, subtaskId, updates } });
    },
    [dispatch]
  );

  const deleteSubtask = useCallback(
    (taskId, subtaskId) => {
      dispatch({ type: 'DELETE_SUBTASK', payload: { taskId, subtaskId } });
    },
    [dispatch]
  );

  const addComment = useCallback(
    (taskId, comment) => {
      dispatch({ type: 'ADD_COMMENT', payload: { taskId, comment } });
    },
    [dispatch]
  );

  const addActivity = useCallback(
    (taskId, activity) => {
      dispatch({ type: 'ADD_ACTIVITY', payload: { taskId, activity } });
    },
    [dispatch]
  );

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    archiveTask,
    duplicateTask,
    moveTask,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    addComment,
    addActivity,
  };
}

export function useTheme() {
  const isDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = React.useState(isDark ? 'dark' : 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('taskflow_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return { theme, toggleTheme };
}

export function useNotifications() {
  const { state, dispatch } = useApp();

  const addNotification = useCallback(
    (notification) => {
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    },
    [dispatch]
  );

  const markAsRead = useCallback(
    (notificationId) => {
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
    },
    [dispatch]
  );

  const markAllAsRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
  }, [dispatch]);

  const clearNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  }, [dispatch]);

  const unreadCount = useMemo(() => state.notifications.filter((n) => !n.isRead).length, [state.notifications]);

  return {
    notifications: state.notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };
}
