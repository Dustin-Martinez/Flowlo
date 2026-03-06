// components/ProjectCard.tsx
"use client";

import React, { useState } from "react";

type Project = {
  id: string;
  name: string;
  description?: string;
  progress?: number;
  status?: "active" | "completed" | "planning";
  teamSize?: number;
  deadline?: string;
  tags?: string[];
  color?: string;
};

type ProjectCardProps = {
  project: Project;
  onUpdate?: (id: string, updates: Partial<Project>) => void;
  onDelete?: (id: string) => void;
  viewMode?: "grid" | "list";
};

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onUpdate, 
  onDelete,
  viewMode = "grid" 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<Project>(project);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(project.id, editedProject);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProject(project);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete && window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      onDelete(project.id);
    }
  };

  const statusColors = {
    active: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
    planning: "bg-blue-100 text-blue-800"
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No deadline";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow duration-200">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editedProject.name}
              onChange={(e) => setEditedProject({...editedProject, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Project name"
            />
            <textarea
              value={editedProject.description}
              onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Description"
              rows={2}
            />
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={editedProject.progress || 0}
                onChange={(e) => setEditedProject({...editedProject, progress: parseInt(e.target.value)})}
                className="flex-1"
              />
              <span className="text-sm text-gray-600">{editedProject.progress}%</span>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-2 h-2 rounded-full ${statusColors[project.status || 'planning']}`}></div>
                <h3 className="font-medium text-gray-900">{project.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[project.status || 'planning']}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{project.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">👥</span>
                  <span>{project.teamSize} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">📅</span>
                  <span>{formatDate(project.deadline)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="text-right">
                <div className="text-lg font-medium text-gray-900">{project.progress}%</div>
                <div className="text-xs text-gray-500">Progress</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-all duration-200 h-full">
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editedProject.name}
            onChange={(e) => setEditedProject({...editedProject, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Project name"
          />
          <textarea
            value={editedProject.description}
            onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Description"
            rows={3}
          />
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              value={editedProject.progress || 0}
              onChange={(e) => setEditedProject({...editedProject, progress: parseInt(e.target.value)})}
              className="flex-1"
            />
            <span className="text-sm text-gray-600">{editedProject.progress}%</span>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${statusColors[project.status || 'planning']}`}></div>
                <h3 className="font-medium text-gray-900">{project.name}</h3>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {project.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div 
                className="h-1.5 rounded-full bg-gradient-to-r from-gray-700 to-gray-800"
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">👥</span>
                <span>{project.teamSize}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">📅</span>
                <span>{formatDate(project.deadline)}</span>
              </div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[project.status || 'planning']}`}>
              {project.status}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectCard;