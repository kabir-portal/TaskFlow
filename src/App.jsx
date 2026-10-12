import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { BoardPage } from './pages/BoardPage.jsx';
import { MyTasksPage } from './pages/MyTasksPage.jsx';
import { ProjectsPage } from './pages/ProjectsPage.jsx';
import { CalendarPage } from './pages/CalendarPage.jsx';
import { TeamPage } from './pages/TeamPage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/board/:projectId" element={<BoardPage />} />
          <Route path="/my-tasks" element={<MyTasksPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
