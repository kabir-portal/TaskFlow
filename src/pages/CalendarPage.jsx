import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { formatDate, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from '../utils/dateUtils.js';
import { Button } from '../components/common/index.jsx';

export function CalendarPage() {
  const { state } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDaysInWeek = () => {
    const firstDay = monthStart.getDay();
    const daysArray = [];
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }
    return daysArray.concat(days);
  };

  const daysInWeek = getDaysInWeek();
  const weeks = [];
  for (let i = 0; i < daysInWeek.length; i += 7) {
    weeks.push(daysInWeek.slice(i, i + 7));
  }

  const getTasksForDay = (day) => {
    if (!day) return [];
    return state.tasks.filter((t) => {
      if (!t.dueDate || t.archivedAt) return false;
      const taskDate = new Date(t.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      const dayDate = new Date(day);
      dayDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === dayDate.getTime();
    });
  };

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Calendar</h1>
        <p className="text-text-secondary">View tasks by due date</p>
      </div>

      <div className="bg-surface rounded-lg border border-border p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">{monthName}</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center font-semibold text-text-secondary text-sm py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {weeks.map((week, weekIdx) =>
            week.map((day, dayIdx) => {
              const tasks = day ? getTasksForDay(day) : [];
              const isToday = day && isSameDay(day, new Date());
              const isCurrentMonth = day && isSameMonth(day, currentDate);

              return (
                <div
                  key={`${weekIdx}-${dayIdx}`}
                  className={`min-h-24 p-2 rounded-lg border ${
                    !day || !isCurrentMonth
                      ? 'bg-surface-secondary border-transparent'
                      : isToday
                      ? 'bg-primary-50 border-primary-300 dark:bg-primary-900 dark:border-primary-700'
                      : 'bg-surface border-border hover:border-primary-400'
                  }`}
                >
                  {day && (
                    <>
                      <p className={`text-sm font-semibold mb-1 ${isToday ? 'text-primary-600' : isCurrentMonth ? 'text-text-primary' : 'text-text-tertiary'}`}>
                        {day.getDate()}
                      </p>
                      <div className="space-y-1">
                        {tasks.slice(0, 2).map((task) => (
                          <div key={task.id} className="bg-primary-100 text-primary-700 text-xs px-1.5 py-0.5 rounded line-clamp-1">
                            {task.title}
                          </div>
                        ))}
                        {tasks.length > 2 && <p className="text-xs text-text-tertiary">+{tasks.length - 2} more</p>}
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
