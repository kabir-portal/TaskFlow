import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { loadState, saveState, clearState } from '../services/storageService.js';
import { getInitialData } from '../data/initialData.js';
import { generateId } from '../utils/idUtils.js';

const AppContext = createContext(null);

function getStartingState() {
  const saved = loadState();
  if (saved) return saved;
  return getInitialData();
}

function appReducer(state, action) {
  switch (action.type) {
    // --- Projects ---
    case 'ADD_PROJECT': {
      const project = action.payload;
      const defaultColumns = [
        { id: generateId('col'), projectId: project.id, title: 'Backlog', position: 0, taskIds: [], wipLimit: null, isCollapsed: false },
        { id: generateId('col'), projectId: project.id, title: 'To Do', position: 1, taskIds: [], wipLimit: null, isCollapsed: false },
        { id: generateId('col'), projectId: project.id, title: 'In Progress', position: 2, taskIds: [], wipLimit: null, isCollapsed: false },
        { id: generateId('col'), projectId: project.id, title: 'In Review', position: 3, taskIds: [], wipLimit: null, isCollapsed: false },
        { id: generateId('col'), projectId: project.id, title: 'Done', position: 4, taskIds: [], wipLimit: null, isCollapsed: false },
      ];
      return {
        ...state,
        projects: [...state.projects, project],
        columns: [...state.columns, ...defaultColumns],
      };
    }
    case 'UPDATE_PROJECT': {
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload, updatedAt: new Date().toISOString() } : p
        ),
      };
    }
    case 'DELETE_PROJECT': {
      const projectId = action.payload;
      const colIds = state.columns.filter((c) => c.projectId === projectId).map((c) => c.id);
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== projectId),
        columns: state.columns.filter((c) => c.projectId !== projectId),
        tasks: state.tasks.filter((t) => t.projectId !== projectId),
      };
    }
    // --- Columns ---
    case 'ADD_COLUMN': {
      const col = action.payload;
      return { ...state, columns: [...state.columns, col] };
    }
    case 'UPDATE_COLUMN': {
      return {
        ...state,
        columns: state.columns.map((c) => (c.id === action.payload.id ? { ...c, ...action.payload } : c)),
      };
    }
    case 'DELETE_COLUMN': {
      const { columnId, moveToColumnId } = action.payload;
      const col = state.columns.find((c) => c.id === columnId);
      if (!col) return state;
      let updatedColumns = state.columns.filter((c) => c.id !== columnId);
      let updatedTasks = state.tasks;
      if (moveToColumnId) {
        updatedTasks = state.tasks.map((t) =>
          t.columnId === columnId ? { ...t, columnId: moveToColumnId, updatedAt: new Date().toISOString() } : t
        );
        updatedColumns = updatedColumns.map((c) =>
          c.id === moveToColumnId ? { ...c, taskIds: [...c.taskIds, ...col.taskIds] } : c
        );
      } else {
        updatedTasks = state.tasks.filter((t) => t.columnId !== columnId);
      }
      return { ...state, columns: updatedColumns, tasks: updatedTasks };
    }
    case 'REORDER_COLUMNS': {
      const { projectId, columnIds } = action.payload;
      return {
        ...state,
        columns: state.columns.map((c) => {
          if (c.projectId !== projectId) return c;
          const idx = columnIds.indexOf(c.id);
          return idx >= 0 ? { ...c, position: idx } : c;
        }),
      };
    }
    case 'TOGGLE_COLUMN_COLLAPSE': {
      return {
        ...state,
        columns: state.columns.map((c) =>
          c.id === action.payload ? { ...c, isCollapsed: !c.isCollapsed } : c
        ),
      };
    }
    case 'MOVE_ALL_TASKS': {
      const { fromColumnId, toColumnId } = action.payload;
      const fromCol = state.columns.find((c) => c.id === fromColumnId);
      if (!fromCol) return state;
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.columnId === fromColumnId ? { ...t, columnId: toColumnId, updatedAt: new Date().toISOString() } : t
        ),
        columns: state.columns.map((c) => {
          if (c.id === fromColumnId) return { ...c, taskIds: [] };
          if (c.id === toColumnId) return { ...c, taskIds: [...c.taskIds, ...fromCol.taskIds] };
          return c;
        }),
      };
    }
    // --- Tasks ---
    case 'ADD_TASK': {
      const task = action.payload;
      return {
        ...state,
        tasks: [...state.tasks, task],
        columns: state.columns.map((c) =>
          c.id === task.columnId ? { ...c, taskIds: [...c.taskIds, task.id] } : c
        ),
      };
    }
    case 'UPDATE_TASK': {
      const updated = action.payload;
      const oldTask = state.tasks.find((t) => t.id === updated.id);
      let updatedColumns = state.columns;
      // Handle column change
      if (oldTask && updated.columnId && oldTask.columnId !== updated.columnId) {
        updatedColumns = state.columns.map((c) => {
          if (c.id === oldTask.columnId) return { ...c, taskIds: c.taskIds.filter((id) => id !== updated.id) };
          if (c.id === updated.columnId) return { ...c, taskIds: [...c.taskIds, updated.id] };
          return c;
        });
      }
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === updated.id ? { ...t, ...updated, updatedAt: new Date().toISOString() } : t
        ),
        columns: updatedColumns,
      };
    }
    case 'DELETE_TASK': {
      const taskId = action.payload;
      const task = state.tasks.find((t) => t.id === taskId);
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== taskId),
        columns: state.columns.map((c) =>
          task && c.id === task.columnId ? { ...c, taskIds: c.taskIds.filter((id) => id !== taskId) } : c
        ),
      };
    }
    case 'ARCHIVE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload ? { ...t, archivedAt: new Date().toISOString() } : t
        ),
      };
    }
    case 'DUPLICATE_TASK': {
      const original = state.tasks.find((t) => t.id === action.payload.originalId);
      if (!original) return state;
      const newTask = {
        ...original,
        id: action.payload.newId,
        taskId: action.payload.newTaskId,
        title: `${original.title} (copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
        activity: [{ id: generateId('act'), type: 'created', userId: state.currentUserId, description: 'duplicated this task', createdAt: new Date().toISOString() }],
      };
      return {
        ...state,
        tasks: [...state.tasks, newTask],
        columns: state.columns.map((c) =>
          c.id === original.columnId ? { ...c, taskIds: [...c.taskIds, newTask.id] } : c
        ),
      };
    }
    case 'MOVE_TASK': {
      const { taskId, fromColumnId, toColumnId, newIndex } = action.payload;
      let updatedColumns = state.columns;
      if (fromColumnId === toColumnId) {
        // Reorder within same column
        updatedColumns = state.columns.map((c) => {
          if (c.id !== fromColumnId) return c;
          const ids = c.taskIds.filter((id) => id !== taskId);
          ids.splice(newIndex, 0, taskId);
          return { ...c, taskIds: ids };
        });
      } else {
        // Move between columns
        updatedColumns = state.columns.map((c) => {
          if (c.id === fromColumnId) return { ...c, taskIds: c.taskIds.filter((id) => id !== taskId) };
          if (c.id === toColumnId) {
            const ids = [...c.taskIds];
            ids.splice(newIndex, 0, taskId);
            return { ...c, taskIds: ids };
          }
          return c;
        });
      }
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, columnId: toColumnId, updatedAt: new Date().toISOString() } : t
        ),
        columns: updatedColumns,
      };
    }
    // --- Subtasks ---
    case 'ADD_SUBTASK': {
      const { taskId, subtask } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, subtasks: [...(t.subtasks || []), subtask], updatedAt: new Date().toISOString() } : t
        ),
      };
    }
    case 'UPDATE_SUBTASK': {
      const { taskId, subtaskId, updates } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === taskId
            ? { ...t, subtasks: (t.subtasks || []).map((s) => (s.id === subtaskId ? { ...s, ...updates } : s)), updatedAt: new Date().toISOString() }
            : t
        ),
      };
    }
    case 'DELETE_SUBTASK': {
      const { taskId, subtaskId } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === taskId
            ? { ...t, subtasks: (t.subtasks || []).filter((s) => s.id !== subtaskId), updatedAt: new Date().toISOString() }
            : t
        ),
      };
    }
    // --- Comments ---
    case 'ADD_COMMENT': {
      const { taskId, comment } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                comments: [...(t.comments || []), comment],
                activity: [...(t.activity || []), { id: generateId('act'), type: 'comment', userId: comment.userId, description: 'added a comment', createdAt: comment.createdAt }],
                updatedAt: new Date().toISOString(),
              }
            : t
        ),
      };
    }
    // --- Activity ---
    case 'ADD_ACTIVITY': {
      const { taskId, activity } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, activity: [...(t.activity || []), activity], updatedAt: new Date().toISOString() } : t
        ),
      };
    }
    // --- Notifications ---
    case 'ADD_NOTIFICATION': {
      return { ...state, notifications: [action.payload, ...state.notifications] };
    }
    case 'MARK_NOTIFICATION_READ': {
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, isRead: true } : n
        ),
      };
    }
    case 'MARK_ALL_NOTIFICATIONS_READ': {
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      };
    }
    case 'CLEAR_NOTIFICATIONS': {
      return { ...state, notifications: [] };
    }
    // --- Reset ---
    case 'RESET_DATA': {
      clearState();
      return getInitialData();
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, getStartingState);

  // Persist on every state change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const getUser = useCallback((userId) => state.users.find((u) => u.id === userId), [state.users]);
  const currentUser = state.users.find((u) => u.id === state.currentUserId);

  const value = {
    state,
    dispatch,
    currentUser,
    getUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export default AppContext;
