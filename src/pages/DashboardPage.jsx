import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext.jsx';
import { Button, EmptyState } from '../components/common/index.jsx';
import { formatDate, isOverdue } from '../utils/dateUtils.js';
import { PRIORITIES } from '../utils/taskUtils.js';
import { Plus, TrendingUp } from 'lucide-react';

export function DashboardPage() {
  const { state } = useApp();

  const allTasks = state.tasks.filter((t) => !t.archivedAt);
  const completedTasks = allTasks.filter((t) => {
    const col = state.columns.find((c) => c.id === t.columnId);
    return col?.title === 'Done';
  });
  const inProgressTasks = allTasks.filter((t) => {
    const col = state.columns.find((c) => c.id === t.columnId);
    return col?.title === 'In Progress';
  });
  const overdueTasks = allTasks.filter((t) => {
    if (!isOverdue(t.dueDate)) return false;
    const col = state.columns.find((c) => c.id === t.columnId);
    return col?.title !== 'Done';
  });

  const completionRate = allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0;

  // Chart data
  const tasksByStatus = [
    { name: 'Backlog', value: allTasks.filter((t) => state.columns.find((c) => c.id === t.columnId)?.title === 'Backlog').length },
    { name: 'To Do', value: allTasks.filter((t) => state.columns.find((c) => c.id === t.columnId)?.title === 'To Do').length },
    { name: 'In Progress', value: inProgressTasks.length },
    { name: 'In Review', value: allTasks.filter((t) => state.columns.find((c) => c.id === t.columnId)?.title === 'In Review').length },
    { name: 'Done', value: completedTasks.length },
  ];

  const tasksByPriority = [
    { name: 'Urgent', value: allTasks.filter((t) => t.priority === 'urgent').length, fill: '#dc2626' },
    { name: 'High', value: allTasks.filter((t) => t.priority === 'high').length, fill: '#ea580c' },
    { name: 'Medium', value: allTasks.filter((t) => t.priority === 'medium').length, fill: '#f59e0b' },
    { name: 'Low', value: allTasks.filter((t) => t.priority === 'low').length, fill: '#3b82f6' },
  ];

  const recentActivity = state.tasks
    .filter((t) => t.activity && t.activity.length > 0)
    .sort((a, b) => new Date(b.activity[b.activity.length - 1].createdAt) - new Date(a.activity[a.activity.length - 1].createdAt))
    .slice(0, 5);

  const userTasks = allTasks.filter((t) => t.assigneeId === state.currentUserId);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome, {state.currentUser?.name || 'User'}</h1>
        <p className="text-text-secondary">Here's your project overview</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <OverviewCard title="Total Tasks" value={allTasks.length} icon="📋" />
        <OverviewCard title="In Progress" value={inProgressTasks.length} icon="🚀" />
        <OverviewCard title="Completed" value={completedTasks.length} icon="✅" />
        <OverviewCard title="Overdue" value={overdueTasks.length} icon="⚠️" accent={overdueTasks.length > 0 ? 'danger' : 'default'} />
        <OverviewCard title="Completion" value={`${completionRate}%`} icon="📈" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks by Status */}
        <div className="lg:col-span-2 bg-surface rounded-lg p-6 border border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Tasks by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tasksByStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tasks by Priority */}
        <div className="bg-surface rounded-lg p-6 border border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Tasks by Priority</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={tasksByPriority} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {tasksByPriority.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Tasks */}
        <div className="bg-surface rounded-lg p-6 border border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Your Tasks ({userTasks.length})</h2>
          <div className="space-y-2">
            {userTasks.length === 0 ? (
              <p className="text-text-tertiary text-sm">No tasks assigned to you</p>
            ) : (
              userTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center gap-2 p-3 rounded-lg hover:bg-surface-secondary cursor-pointer group">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PRIORITIES[task.priority]?.dot }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary group-hover:text-primary-600 transition-colors truncate">{task.title}</p>
                    <p className="text-xs text-text-tertiary">{task.taskId}</p>
                  </div>
                  {task.dueDate && <span className="text-xs text-text-tertiary whitespace-nowrap">{formatDate(task.dueDate)}</span>}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-surface rounded-lg p-6 border border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Projects</h2>
          <div className="space-y-2">
            {state.projects.slice(0, 5).map((project) => {
              const projectTasks = state.tasks.filter((t) => t.projectId === project.id && !t.archivedAt);
              const projectCompleted = projectTasks.filter((t) => state.columns.find((c) => c.id === t.columnId)?.title === 'Done').length;
              const projectProgress = projectTasks.length > 0 ? Math.round((projectCompleted / projectTasks.length) * 100) : 0;
              return (
                <div key={project.id} className="p-3 rounded-lg hover:bg-surface-secondary cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-text-primary">{project.name}</p>
                    <span className="text-xs font-semibold text-text-secondary">{projectProgress}%</span>
                  </div>
                  <div className="w-full bg-surface-tertiary rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full transition-all" style={{ width: `${projectProgress}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewCard({ title, value, icon, accent = 'default' }) {
  const accentStyles = {
    default: 'bg-primary-50 dark:bg-primary-900',
    danger: 'bg-danger-50 dark:bg-red-900',
  };

  return (
    <div className={`rounded-lg p-4 border border-border ${accentStyles[accent]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}
