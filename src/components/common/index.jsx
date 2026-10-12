import React from 'react';

export function Button({
  children,
  variant = 'default',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500';

  const variants = {
    default: 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-300',
    secondary: 'bg-surface-tertiary text-text-primary hover:bg-surface-secondary dark:bg-surface-tertiary dark:hover:bg-surface border border-border',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 disabled:border-primary-300 disabled:text-primary-300',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 disabled:bg-danger-300',
    ghost: 'text-text-primary hover:bg-surface-tertiary dark:hover:bg-surface-secondary',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({
  label,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-text-primary mb-1">{label}</label>}
      <input
        className={`w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${error ? 'border-danger-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-danger-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

export function Select({
  label,
  options = [],
  error,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-text-primary mb-1">{label}</label>}
      <select
        className={`w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${error ? 'border-danger-500' : ''} ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-danger-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

export function Textarea({
  label,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-text-primary mb-1">{label}</label>}
      <textarea
        className={`w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${error ? 'border-danger-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-danger-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

export function Badge({
  children,
  variant = 'default',
  className = '',
}) {
  const variants = {
    default: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
    success: 'bg-success-50 text-success-600 dark:bg-success-900 dark:text-success-300',
    warning: 'bg-warning-50 text-warning-600 dark:bg-warning-900 dark:text-warning-300',
    danger: 'bg-danger-50 text-danger-600 dark:bg-danger-900 dark:text-danger-300',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function Avatar({
  name = '',
  size = 'md',
  initials = null,
  className = '',
}) {
  const sizeMap = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const getInitials = () => {
    if (initials) return initials;
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const colors = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-pink-100 text-pink-700', 'bg-green-100 text-green-700', 'bg-orange-100 text-orange-700'];
  const colorIndex = (name.charCodeAt(0) || 0) % colors.length;

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-semibold ${sizeMap[size]} ${colors[colorIndex]} dark:${colors[colorIndex].replace('100', '900').replace('700', '300')} ${className}`}
      title={name}
    >
      {getInitials()}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action = null,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {Icon && <Icon className="w-16 h-16 text-text-tertiary mb-4" strokeWidth={1.5} />}
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}

export function Toast({
  message,
  type = 'info',
  onClose,
}) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    info: 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900 dark:text-primary-300 dark:border-primary-800',
    success: 'bg-success-50 text-success-700 border-success-200 dark:bg-success-900 dark:text-success-300 dark:border-success-800',
    warning: 'bg-warning-50 text-warning-700 border-warning-200 dark:bg-warning-900 dark:text-warning-300 dark:border-warning-800',
    danger: 'bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-900 dark:text-danger-300 dark:border-danger-800',
  };

  return (
    <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg border ${typeStyles[type]} shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-200`}>
      {message}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer = null,
  className = '',
}) {
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      <div className={`relative bg-surface rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto ${className}`}>
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-surface z-10">
          <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="flex justify-end gap-3 p-6 border-t border-border bg-surface-secondary rounded-b-lg">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title} className="max-w-sm">
      <p className="text-text-secondary mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button variant={isDangerous ? 'danger' : 'default'} onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
