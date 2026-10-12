import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema } from '../../utils/validation.js';
import { generateId, generateTaskId } from '../../utils/idUtils.js';
import { Button, Input, Select, Textarea, Modal, Badge } from '../common/index.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { useTasks, useColumns } from '../../hooks/index.js';
import { Calendar, X } from 'lucide-react';

export function TaskModal({ open, onClose, projectId, columnId, editingTask = null }) {
  const { state, dispatch } = useApp();
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: editingTask || {
      title: '',
      description: '',
      priority: 'medium',
      assigneeId: '',
      labels: [],
      startDate: '',
      dueDate: '',
      estimatedEffort: '',
    },
  });

  const users = state.users;
  const priority = watch('priority');
  const labels = watch('labels');

  React.useEffect(() => {
    if (open && editingTask) {
      reset(editingTask);
    } else if (open) {
      reset({
        title: '',
        description: '',
        priority: 'medium',
        assigneeId: '',
        labels: [],
        startDate: '',
        dueDate: '',
        estimatedEffort: '',
      });
    }
  }, [open, editingTask, reset]);

  const onSubmit = (data) => {
    if (editingTask) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: {
          id: editingTask.id,
          ...data,
          columnId: editingTask.columnId,
        },
      });
    } else {
      const newTask = {
        id: generateId('task'),
        projectId,
        columnId,
        taskId: generateTaskId('TASK'),
        title: data.title,
        description: data.description,
        priority: data.priority,
        assigneeId: data.assigneeId,
        collaboratorIds: [],
        labels: data.labels,
        startDate: data.startDate,
        dueDate: data.dueDate,
        estimatedEffort: data.estimatedEffort,
        subtasks: [],
        comments: [],
        attachments: [],
        activity: [
          {
            id: generateId('act'),
            type: 'created',
            userId: state.currentUserId,
            description: 'created this task',
            createdAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archivedAt: null,
      };
      dispatch({ type: 'ADD_TASK', payload: newTask });
    }
    onClose();
    reset();
  };

  return (
    <Modal open={open} onClose={onClose} title={editingTask ? 'Edit Task' : 'Create Task'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Task Title"
          placeholder="Enter task title"
          {...register('title')}
          error={errors.title?.message}
        />

        <Textarea
          label="Description"
          placeholder="Add task description"
          rows="4"
          {...register('description')}
          error={errors.description?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' },
            ]}
            {...register('priority')}
            error={errors.priority?.message}
          />

          <Select
            label="Assignee"
            options={[{ value: '', label: 'Unassigned' }, ...users.map((u) => ({ value: u.id, label: u.name }))]}
            {...register('assigneeId')}
            error={errors.assigneeId?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            {...register('startDate')}
            error={errors.startDate?.message}
          />
          <Input
            label="Due Date"
            type="date"
            {...register('dueDate')}
            error={errors.dueDate?.message}
          />
        </div>

        <Input
          label="Estimated Effort"
          placeholder="e.g., 4h, 1d"
          {...register('estimatedEffort')}
          error={errors.estimatedEffort?.message}
        />

        <div className="flex gap-2 flex-wrap">
          {['Bug', 'Feature', 'Enhancement', 'Documentation', 'Design'].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                const current = labels || [];
                const updated = current.includes(label) ? current.filter((l) => l !== label) : [...current, label];
                setValue('labels', updated);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                (labels || []).includes(label)
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'bg-surface-tertiary text-text-secondary hover:bg-surface-secondary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="default">
            {editingTask ? 'Update' : 'Create'} Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
