import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { KanbanBoard } from '../components/board/KanbanBoard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { Button } from '../components/common/index.jsx';
import { Plus } from 'lucide-react';

export function BoardPage() {
  const { state } = useApp();
  const { projectId } = useParams();
  const currentProjectId = projectId || state.projects[0]?.id;

  if (!currentProjectId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">No Projects</h2>
          <p className="text-text-secondary mb-4">Create a project to get started</p>
          <Button variant="default">Create Project</Button>
        </div>
      </div>
    );
  }

  const project = state.projects.find((p) => p.id === currentProjectId);

  return (
    <div className="h-full flex flex-col bg-surface-secondary">
      <div className="flex-shrink-0 p-6 border-b border-border bg-surface">
        <h1 className="text-3xl font-bold text-text-primary">{project?.name}</h1>
        {project?.description && (
          <p className="text-text-secondary mt-1">{project.description}</p>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <KanbanBoard projectId={currentProjectId} />
      </div>
    </div>
  );
}
