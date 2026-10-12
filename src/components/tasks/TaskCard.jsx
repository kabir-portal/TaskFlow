import React, { useState } from 'react';
import { MoreVertical, Trash2, Edit2, Copy, Archive, AlertCircle } from 'lucide-react';
import { PRIORITIES } from '../../utils/taskUtils.js';
import { formatDate, getDueDateLabel, isOverdue } from '../../utils/dateUtils.js';
import { Avatar, Badge, Button, ConfirmDialog } from '../common/index.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { generateId, generateTaskId } from '../../utils/idUtils.js';

export function TaskCard({ task, onEdit, onOpenDetails, onDelete, isDragging }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { state, dispatch } = useApp();

  const assignee = task.assigneeId ? state.users.find((u) => u.id === task.assigneeId) : null;
  const priorityInfo = PRIORITIES[task.priority];
  const dueLabel = getDueDateLabel(task.dueDate);
  const isTaskOverdue = isOverdue(task.dueDate);

  const handleDuplicate = () => {
    const newId = generateId('task');
    const newTaskId = generateTaskId('TASK');
    dispatch({
      type: 'DUPLICATE_TASK',
      payload: { originalId: task.id, newId, newTaskId },
    });
    setShowMenu(false);
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_TASK', payload: task.id });
    setShowConfirm(false);
  };

  const handleArchive = () => {
    dispatch({ type: 'ARCHIVE_TASK', payload: task.id });
    setShowMenu(false);
  };

  const subtaskProgress = task.subtasks
    ? Math.round((task.subtasks.filter((s) => s.completed).length / task.subtasks.length) * 100)
    : 0;

  return (
    <>
      <div
        className={`bg-surface rounded-lg border border-border p-3 cursor-pointer group hover:shadow-md transition-all ${
          isDragging ? 'opacity-50' : ''
        }`}
        onClick={() => onOpenDetails?.(task.id)}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-primary-600 dark:text-primary-400">{task.taskId}</p>
            <h4 className="text-sm font-semibold text-text-primary line-clamp-2 group-hover:text-primary-600 transition-colors">
              {task.title}
            </h4>
          </div>
          <div className="relative flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-surface-tertiary transition-all"
            >
              <MoreVertical className="w-4 h-4 text-text-tertiary" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-lg shadow-lg py-1 z-40 w-40">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(task);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-surface-tertiary flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicate();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-surface-tertiary flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" /> Duplicate
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArchive();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-surface-tertiary flex items-center gap-2"
                >
                  <Archive className="w-4 h-4" /> Archive
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowConfirm(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-950 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {task.description && <p className="text-xs text-text-secondary line-clamp-2 mb-2">{task.description}</p>}

        {/* Priority & Status */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge variant="default" className={`${priorityInfo.bg} border ${priorityInfo.border}`}>
            {priorityInfo.label}
          </Badge>
          {task.labels && task.labels.length > 0 && (
            <Badge variant="default" className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
              {task.labels[0]}
            </Badge>
          )}
          {isTaskOverdue && (
            <Badge variant="danger" className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Overdue
            </Badge>
          )}
        </div>

        {/* Subtasks */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-secondary">Subtasks</span>
              <span className="text-xs font-semibold text-text-primary">{subtaskProgress}%</span>
            </div>
            <div className="w-full bg-surface-tertiary rounded-full h-1.5">
              <div className="bg-success-500 h-1.5 rounded-full transition-all" style={{ width: `${subtaskProgress}%` }} />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {task.attachments && task.attachments.length > 0 && (
              <span className="text-text-tertiary">📎 {task.attachments.length}</span>
            )}
            {task.comments && task.comments.length > 0 && (
              <span className="text-text-tertiary">💬 {task.comments.length}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {assignee && <Avatar name={assignee.name} size="xs" />}
            {dueLabel && (
              <span className={`font-medium ${isTaskOverdue ? 'text-danger-600' : 'text-text-tertiary'}`}>
                {dueLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
      />
    </>
  );
}

export function TaskDetailsPanel({ taskId, onClose }) {
  const { state, dispatch } = useApp();
  const task = state.tasks.find((t) => t.id === taskId);

  if (!task) return null;

  const assignee = task.assigneeId ? state.users.find((u) => u.id === task.assigneeId) : null;
  const priorityInfo = PRIORITIES[task.priority];
  const [newComment, setNewComment] = React.useState('');
  const [editingSubtask, setEditingSubtask] = React.useState(null);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: generateId('cmt'),
        userId: state.currentUserId,
        text: newComment,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_COMMENT', payload: { taskId, comment } });
      setNewComment('');
    }
  };

  const handleAddSubtask = () => {
    const title = prompt('Enter subtask title:');
    if (title) {
      const subtask = { id: generateId('st'), title, completed: false };
      dispatch({ type: 'ADD_SUBTASK', payload: { taskId, subtask } });
    }
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-full md:w-96 bg-surface border-l border-border shadow-lg z-40 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm font-semibold text-primary-600">{task.taskId}</p>
            <h2 className="text-2xl font-bold text-text-primary">{task.title}</h2>
          </div>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Description */}
        {task.description && (
          <div className="mb-6">
            <h3 className="font-semibold text-text-primary mb-2">Description</h3>
            <p className="text-text-secondary whitespace-pre-wrap">{task.description}</p>
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-4 mb-6 pb-6 border-b border-border">
          <div>
            <label className="text-sm font-semibold text-text-secondary">Priority</label>
            <Badge className={`mt-1 ${priorityInfo.bg} border ${priorityInfo.border}`}>{priorityInfo.label}</Badge>
          </div>

          <div>
            <label className="text-sm font-semibold text-text-secondary">Assignee</label>
            {assignee ? (
              <div className="flex items-center gap-2 mt-2">
                <Avatar name={assignee.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-text-primary">{assignee.name}</p>
                  <p className="text-xs text-text-tertiary">{assignee.role}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-tertiary mt-2">Unassigned</p>
            )}
          </div>

          {task.dueDate && (
            <div>
              <label className="text-sm font-semibold text-text-secondary">Due Date</label>
              <p className="text-sm text-text-primary mt-1">{formatDate(task.dueDate)}</p>
            </div>
          )}

          {task.labels && task.labels.length > 0 && (
            <div>
              <label className="text-sm font-semibold text-text-secondary">Labels</label>
              <div className="flex flex-wrap gap-1 mt-2">
                {task.labels.map((label) => (
                  <Badge key={label} variant="default" className="bg-primary-100 text-primary-700">
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Subtasks */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-text-primary">Subtasks</h3>
              <Button variant="ghost" size="sm" onClick={handleAddSubtask}>
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2 p-2 rounded hover:bg-surface-tertiary">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={(e) =>
                      dispatch({
                        type: 'UPDATE_SUBTASK',
                        payload: { taskId, subtaskId: subtask.id, updates: { completed: e.target.checked } },
                      })
                    }
                    className="w-4 h-4 rounded border-border text-primary-600"
                  />
                  <span className={`text-sm flex-1 ${subtask.completed ? 'line-through text-text-tertiary' : 'text-text-primary'}`}>
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div>
          <h3 className="font-semibold text-text-primary mb-3">Comments</h3>
          <div className="space-y-3 mb-4">
            {task.comments && task.comments.length > 0 ? (
              task.comments.map((comment) => {
                const commenter = state.users.find((u) => u.id === comment.userId);
                return (
                  <div key={comment.id} className="bg-surface-secondary rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar name={commenter?.name || 'User'} size="xs" />
                      <span className="text-sm font-medium text-text-primary">{commenter?.name}</span>
                      <span className="text-xs text-text-tertiary">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-text-secondary">{comment.text}</p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-text-tertiary">No comments yet</p>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button size="sm" onClick={handleAddComment}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
