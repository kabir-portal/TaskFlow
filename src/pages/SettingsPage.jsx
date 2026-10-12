import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Button, Input, ConfirmDialog } from '../components/common/index.jsx';
import { Moon, Sun, RotateCcw } from 'lucide-react';

export function SettingsPage() {
  const { state, dispatch } = useApp();
  const [theme, setTheme] = useState(localStorage.getItem('taskflow_theme') || 'light');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [displayName, setDisplayName] = useState(state.currentUser?.name || '');

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('taskflow_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleResetData = () => {
    dispatch({ type: 'RESET_DATA' });
    setShowResetConfirm(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Settings</h1>
        <p className="text-text-secondary">Manage your preferences</p>
      </div>

      {/* Profile Section */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Profile</h2>
        <div className="space-y-4">
          <Input label="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          <Input label="Email" value={state.currentUser?.email || ''} disabled />
          <Input label="Role" value={state.currentUser?.role || ''} disabled />
          <div className="pt-4">
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>

      {/* Theme Section */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Appearance</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">Theme</label>
            <div className="flex gap-3">
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                  theme === 'light'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-border hover:border-primary-300'
                }`}
              >
                <Sun className="w-5 h-5" />
                Light
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                  theme === 'dark'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-border hover:border-primary-300'
                }`}
              >
                <Moon className="w-5 h-5" />
                Dark
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Board Settings Section */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Board Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-text-primary">Show task IDs</span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-text-primary">Show subtask progress</span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-text-primary">Enable animations</span>
            </label>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Notifications</h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-text-primary">Task assigned to me</span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-text-primary">Task due soon</span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-text-primary">New comments on my tasks</span>
            </label>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Data Management</h2>
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            TaskFlow stores all data locally in your browser using LocalStorage. This data is not synced to any server and will only be available on this device.
          </p>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowResetConfirm(true)}
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Demo Data
            </Button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">About</h2>
        <div className="space-y-2 text-sm text-text-secondary">
          <p>
            <strong>TaskFlow</strong> — A modern, open-source project management application built with React.
          </p>
          <p>Version: 1.0.0</p>
          <p>Built with React, Vite, Tailwind CSS, and @dnd-kit</p>
        </div>
      </div>

      <ConfirmDialog
        open={showResetConfirm}
        onConfirm={handleResetData}
        onCancel={() => setShowResetConfirm(false)}
        title="Reset to Demo Data"
        message="This will replace all your data with the default demo data. This action cannot be undone."
        confirmText="Reset"
        isDangerous
      />
    </div>
  );
}
