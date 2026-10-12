import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { Button, Modal, Input, Textarea, ConfirmDialog, EmptyState } from '../components/common/index.jsx';
import { Plus, Folder, Settings, Trash2, Edit2 } from 'lucide-react';

export function ProjectsPage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', color: '#3b82f6' });

  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    if (editingProject) {
      dispatch({ type: 'UPDATE_PROJECT', payload: { id: editingProject.id, ...formData } });
    } else {
      const newProject = {
        id: `proj_${Date.now()}`,
        name: formData.name,
        description: formData.description,
        color: formData.color,
        memberIds: [state.currentUserId],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueDate: '',
      };
      dispatch({ type: 'ADD_PROJECT', payload: newProject });
    }
    setShowModal(false);
    setFormData({ name: '', description: '', color: '#3b82f6' });
    setEditingProject(null);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({ name: project.name, description: project.description, color: project.color });
    setShowModal(true);
  };

  const handleDelete = () => {
    if (editingProject) {
      dispatch({ type: 'DELETE_PROJECT', payload: editingProject.id });
      setEditingProject(null);
      setShowConfirm(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Projects</h1>
          <p className="text-text-secondary">Manage your projects</p>
        </div>
        <Button
          onClick={() => {
            setEditingProject(null);
            setFormData({ name: '', description: '', color: '#3b82f6' });
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> New Project
        </Button>
      </div>

      {state.projects.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="No projects yet"
          description="Create your first project to get started"
          action={
            <Button
              onClick={() => {
                setEditingProject(null);
                setFormData({ name: '', description: '', color: '#3b82f6' });
                setShowModal(true);
              }}
            >
              Create Project
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.projects.map((project) => {
            const taskCount = state.tasks.filter((t) => t.projectId === project.id && !t.archivedAt).length;
            const completedCount = state.tasks.filter((t) => {
              if (t.projectId !== project.id || t.archivedAt) return false;
              const col = state.columns.find((c) => c.id === t.columnId);
              return col?.title === 'Done';
            }).length;

            return (
              <div
                key={project.id}
                className="bg-surface rounded-lg border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => navigate(`/board/${project.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: project.color }} />
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(project);
                      }}
                      className="p-2 rounded-lg hover:bg-surface-secondary transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-text-secondary" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProject(project);
                        setShowConfirm(true);
                      }}
                      className="p-2 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-950 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-danger-600" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-1 group-hover:text-primary-600 transition-colors">{project.name}</h3>
                <p className="text-sm text-text-secondary mb-4 line-clamp-2">{project.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-sm text-text-tertiary">{taskCount} tasks</span>
                  <span className="text-sm font-medium text-success-600">{completedCount} completed</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingProject ? 'Edit Project' : 'New Project'}>
        <div className="space-y-4">
          <Input
            label="Project Name"
            placeholder="Enter project name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Textarea
            label="Description"
            placeholder="Project description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Color</label>
            <div className="flex gap-2">
              {['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'].map((color) => (
                <button
                  key={color}
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-lg transition-transform ${formData.color === color ? 'ring-2 ring-offset-2 ring-primary-500 scale-110' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <Button variant="ghost" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editingProject ? 'Update' : 'Create'} Project
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={showConfirm}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        title="Delete Project"
        message={`Are you sure you want to delete "${editingProject?.name}"? This will also delete all associated tasks.`}
        confirmText="Delete"
        isDangerous
      />
    </div>
  );
}
