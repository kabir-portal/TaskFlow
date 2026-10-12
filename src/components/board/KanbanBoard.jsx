import React, { useState } from 'react';
import {
  useDroppable,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, Plus, MoreVertical, Trash2, Eye, EyeOff } from 'lucide-react';
import { TaskCard, TaskDetailsPanel } from '../tasks/TaskCard.jsx';
import { TaskModal } from '../tasks/TaskModal.jsx';
import { Button, ConfirmDialog } from '../common/index.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { useTasks, useColumns } from '../../hooks/index.js';
import { generateId } from '../../utils/idUtils.js';

function KanbanColumn({ column, projectId, tasks, onAddTask, onEditTask, onOpenTask, onDeleteTask }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { columnId: column.id },
  });

  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [moveToColumn, setMoveToColumn] = useState(null);
  const { state, dispatch } = useApp();
  const { columns } = useColumns(projectId);
  const { toggleCollapse } = useColumns(projectId);

  const handleDeleteColumn = () => {
    if (moveToColumn) {
      dispatch({
        type: 'DELETE_COLUMN',
        payload: { columnId: column.id, moveToColumnId: moveToColumn },
      });
    } else {
      dispatch({ type: 'DELETE_COLUMN', payload: { columnId: column.id } });
    }
    setShowConfirm(false);
  };

  const handleMoveAllTasks = (targetColumnId) => {
    dispatch({
      type: 'MOVE_ALL_TASKS',
      payload: { fromColumnId: column.id, toColumnId: targetColumnId },
    });
    setShowMenu(false);
  };

  const wipLimitReached = column.wipLimit && tasks.length >= column.wipLimit;

  return (
    <>
      <div
        ref={setNodeRef}
        className={`flex flex-col bg-surface-secondary rounded-lg min-w-80 max-h-full transition-all ${
          isOver ? 'ring-2 ring-primary-500' : ''
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleCollapse(column.id)}
                className="p-1 hover:bg-surface-tertiary rounded transition-colors"
              >
                <ChevronDown
                  className={`w-5 h-5 text-text-secondary transition-transform ${column.isCollapsed ? '-rotate-90' : ''}`}
                />
              </button>
              <h3 className="font-semibold text-text-primary">{column.title}</h3>
              <span className="text-xs bg-surface text-text-secondary px-2 py-1 rounded-full">
                {tasks.length}
                {column.wipLimit ? `/${column.wipLimit}` : ''}
              </span>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded hover:bg-surface-tertiary transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-text-tertiary" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-lg shadow-lg py-1 z-40 w-48">
                  <button
                    onClick={() => onAddTask(column.id)}
                    className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-surface-tertiary flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Task
                  </button>
                  {tasks.length > 0 && (
                    <>
                      <div className="my-1 h-px bg-border" />
                      <button
                        onClick={() => setShowConfirm(true)}
                        className="w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-950 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Column
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          {wipLimitReached && (
            <p className="text-xs text-warning-600 font-medium">WIP limit reached</p>
          )}
        </div>

        {/* Tasks */}
        {!column.isCollapsed && (
          <div
            className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin"
            ref={setNodeRef}
          >
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-text-tertiary">
                <p className="text-sm">No tasks yet</p>
              </div>
            ) : (
              <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                {tasks.map((task) => (
                  <SortableTaskItem
                    key={task.id}
                    task={task}
                    columnId={column.id}
                    onEdit={onEditTask}
                    onOpenDetails={onOpenTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </SortableContext>
            )}
          </div>
        )}

        {/* Add Task Button */}
        {!column.isCollapsed && (
          <div className="p-3 border-t border-border flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-text-secondary"
              onClick={() => onAddTask(column.id)}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Task
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showConfirm}
        onConfirm={handleDeleteColumn}
        onCancel={() => setShowConfirm(false)}
        title="Delete Column"
        message={
          tasks.length > 0
            ? `This column contains ${tasks.length} task(s). Move them to another column or delete them?`
            : 'Are you sure you want to delete this column?'
        }
        confirmText="Delete"
        isDangerous
      />
    </>
  );
}

function SortableTaskItem({ task, columnId, onEdit, onOpenDetails, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { columnId, taskId: task.id },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        onEdit={onEdit}
        onOpenDetails={onOpenDetails}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </div>
  );
}

export function KanbanBoard({ projectId }) {
  const { state, dispatch } = useApp();
  const { columns } = useColumns(projectId);
  const project = state.projects.find((p) => p.id === projectId);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    })
  );

  const allTasks = state.tasks.filter((t) => t.projectId === projectId && !t.archivedAt);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const activeTask = state.tasks.find((t) => t.id === taskId);
    if (!activeTask) return;

    const fromColumnId = activeTask.columnId;
    const toColumnId = over.data?.columnId || over.id;

    if (fromColumnId === toColumnId) {
      // Reorder within same column
      const columnTasks = allTasks.filter((t) => t.columnId === fromColumnId);
      const oldIndex = columnTasks.findIndex((t) => t.id === taskId);
      const newIndex = columnTasks.findIndex((t) => t.id === over.id);
      if (oldIndex !== newIndex) {
        dispatch({
          type: 'MOVE_TASK',
          payload: {
            taskId,
            fromColumnId,
            toColumnId: fromColumnId,
            newIndex: Math.min(oldIndex, newIndex),
          },
        });
      }
    } else {
      // Move between columns
      const toColumnTasks = allTasks.filter((t) => t.columnId === toColumnId);
      const newIndex = toColumnTasks.length;
      dispatch({
        type: 'MOVE_TASK',
        payload: { taskId, fromColumnId, toColumnId, newIndex },
      });
    }
  };

  if (!project) return <div>Project not found</div>;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-6 overflow-x-auto overflow-y-hidden h-full bg-surface-secondary rounded-lg">
        {columns.map((column) => {
          const columnTasks = allTasks
            .filter((t) => t.columnId === column.id)
            .sort((a, b) => column.taskIds.indexOf(a.id) - column.taskIds.indexOf(b.id));

          return (
            <KanbanColumn
              key={column.id}
              column={column}
              projectId={projectId}
              tasks={columnTasks}
              onAddTask={(colId) => {
                setActiveColumnId(colId);
                setEditingTask(null);
                setShowTaskModal(true);
              }}
              onEditTask={(task) => {
                setEditingTask(task);
                setShowTaskModal(true);
              }}
              onOpenTask={(taskId) => setSelectedTaskId(taskId)}
              onDeleteTask={(taskId) => dispatch({ type: 'DELETE_TASK', payload: taskId })}
            />
          );
        })}

        {/* Add Column Button */}
        <button
          onClick={() => {
            const title = prompt('Column name:');
            if (title) {
              const newCol = {
                id: generateId('col'),
                projectId,
                title,
                position: columns.length,
                taskIds: [],
                wipLimit: null,
                isCollapsed: false,
              };
              dispatch({ type: 'ADD_COLUMN', payload: newCol });
            }
          }}
          className="min-w-80 h-12 rounded-lg border-2 border-dashed border-border text-text-tertiary hover:border-primary-500 hover:text-primary-600 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" /> Add Column
        </button>
      </div>

      <TaskModal
        open={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        projectId={projectId}
        columnId={activeColumnId}
        editingTask={editingTask}
      />

      {selectedTaskId && (
        <TaskDetailsPanel
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </DndContext>
  );
}
