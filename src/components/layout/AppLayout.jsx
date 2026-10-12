import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, CheckSquare, FolderOpen, Calendar, Users, Settings, HelpCircle, Moon, Sun, Bell, LogOut, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Avatar, Button } from '../common/index.jsx';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { state } = useApp();

  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/' },
    { icon: CheckSquare, label: 'My Tasks', path: '/my-tasks' },
    { icon: FolderOpen, label: 'Projects', path: '/projects' },
    { icon: LayoutGrid, label: 'Board', path: '/board' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: Users, label: 'Team', path: '/team' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  const NavContent = () => (
    <>
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">T</div>
          <h1 className="text-xl font-bold text-text-primary">TaskFlow</h1>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-text-secondary hover:bg-surface-tertiary'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar name={state.currentUserId ? state.users.find((u) => u.id === state.currentUserId)?.name : 'User'} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{state.users.find((u) => u.id === state.currentUserId)?.name || 'User'}</p>
            <p className="text-xs text-text-tertiary truncate">{state.users.find((u) => u.id === state.currentUserId)?.role || 'Team Member'}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start text-text-secondary">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-surface border border-border hover:bg-surface-secondary"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed md:static left-0 top-0 h-screen w-64 bg-surface border-r border-border flex flex-col transition-transform z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <NavContent />
      </aside>
    </>
  );
}

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { state, dispatch } = useApp();

  const unreadNotifications = state.notifications.filter((n) => !n.isRead);

  return (
    <header className="sticky top-0 z-20 bg-surface border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Left: Title */}
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-text-primary">Dashboard</h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Search */}
          <div className="hidden md:flex items-center">
            <input
              type="text"
              placeholder="Search tasks..."
              className="px-3 py-2 rounded-lg border border-border bg-surface-secondary text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-surface-secondary transition-colors"
            >
              <Bell className="w-5 h-5 text-text-secondary" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-lg shadow-lg p-4 z-40">
                <h3 className="font-semibold text-text-primary mb-3">Notifications</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {unreadNotifications.length === 0 ? (
                    <p className="text-text-tertiary text-sm text-center py-4">No new notifications</p>
                  ) : (
                    unreadNotifications.slice(0, 5).map((notif) => (
                      <div
                        key={notif.id}
                        className="p-3 rounded-lg bg-surface-secondary hover:bg-surface-tertiary cursor-pointer"
                        onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notif.id })}
                      >
                        <p className="text-sm font-medium text-text-primary">{notif.title}</p>
                        <p className="text-xs text-text-tertiary">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={() => dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' })}
                    className="text-xs text-primary-600 hover:text-primary-700 mt-3 font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="p-1 rounded-lg hover:bg-surface-secondary transition-colors"
            >
              <Avatar name={state.users.find((u) => u.id === state.currentUserId)?.name || 'User'} size="sm" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg py-2 z-40">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium text-text-primary">{state.users.find((u) => u.id === state.currentUserId)?.name}</p>
                  <p className="text-xs text-text-tertiary">{state.users.find((u) => u.id === state.currentUserId)?.email}</p>
                </div>
                <a href="/settings" className="block px-4 py-2 text-sm text-text-secondary hover:bg-surface-secondary">
                  Settings
                </a>
                <button className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-surface-secondary">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function AppLayout({ children }) {
  return (
    <div className="flex h-screen bg-surface-secondary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden md:pl-0">
        <Header />
        <main className="flex-1 overflow-auto pt-16 md:pt-0">{children}</main>
      </div>
    </div>
  );
}
