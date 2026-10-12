import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Avatar, Badge } from '../components/common/index.jsx';
import { Mail, Users } from 'lucide-react';

export function TeamPage() {
  const { state } = useApp();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Team</h1>
        <p className="text-text-secondary">Team members and their contributions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.users.map((user) => {
          const assignedTasks = state.tasks.filter(
            (t) => t.assigneeId === user.id && !t.archivedAt
          );
          const completedTasks = assignedTasks.filter((t) => {
            const col = state.columns.find((c) => c.id === t.columnId);
            return col?.title === 'Done';
          });

          return (
            <div key={user.id} className="bg-surface rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <Avatar name={user.name} size="lg" />
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">{user.name}</h3>
                  <p className="text-sm text-text-secondary">{user.role}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4 pb-4 border-b border-border">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm break-all">{user.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-secondary rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-primary-600">{assignedTasks.length}</p>
                  <p className="text-xs text-text-secondary">Assigned</p>
                </div>
                <div className="bg-surface-secondary rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-success-600">{completedTasks.length}</p>
                  <p className="text-xs text-text-secondary">Completed</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
