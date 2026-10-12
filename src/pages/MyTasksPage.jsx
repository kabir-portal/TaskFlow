import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { TaskCard } from '../components/tasks/TaskCard.jsx';
import { Button, EmptyState } from '../components/common/index.jsx';
import { CheckCircle, Circle } from 'lucide-react';

export function MyTasksPage() {
  const { state } = useApp();
  const [filter, setFilter] = useState('all');

  const userTasks = state.tasks.filter((t) => t.assigneeId === state.currentUserId && !t.archivedAt);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const filtered = {
    all: userTasks,
    today: userTasks.filter((t) => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    }),
    upcoming: userTasks.filter((t) => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() > today.getTime();
    }),
    overdue: userTasks.filter((t) => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(23, 59, 59, 999);
      return dueDate < new Date();
    }),
    completed: userTasks.filter((t) => {
      const col = state.columns.find((c) => c.id === t.columnId);
      return col?.title === 'Done';
    }),
  };

  const tasks = filtered[filter] || [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">My Tasks</h1>
        <p className="text-text-secondary">Track your assigned tasks</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'All', count: filtered.all.length },
          { key: 'today', label: 'Today', count: filtered.today.length },
          { key: 'upcoming', label: 'Upcoming', count: filtered.upcoming.length },
          { key: 'overdue', label: 'Overdue', count: filtered.overdue.length },
          { key: 'completed', label: 'Completed', count: filtered.completed.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === tab.key
                ? 'bg-primary-600 text-white'
                : 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary'
            }`}
          >
            {tab.label} <span className="ml-1 text-sm opacity-75">({tab.count})</span>
          </button>
        ))}
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={filter === 'completed' ? CheckCircle : Circle}
          title="No tasks"
          description={`You have no ${filter} tasks`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
