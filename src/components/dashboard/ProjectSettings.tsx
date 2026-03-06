// src/components/dashboard/ProjectSettings.tsx
"use client";

import { useState } from "react";
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Users, 
  Calendar,
  Tag as TagIcon
} from "lucide-react";
import { updateProject } from "@/src/app/lib/projectService";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar: string;
};

// FIXED: Add "archived" to the status union type
type Project = {
  id: string;
  name: string;
  description: string;
  progress: number;
  color: string;
  tasks: number;
  members: number;
  lastUpdated: string;
  status?: "active" | "completed" | "on-hold" | "archived"; // ADD "archived" HERE
  deadline?: string;
  tags?: string[];
  team?: TeamMember[];
};

interface ProjectSettingsProps {
  project: Project;
  onSave: (updatedProject: Project) => void;
  onCancel: () => void;
}

export default function ProjectSettings({ project, onSave, onCancel }: ProjectSettingsProps) {
  const [editedProject, setEditedProject] = useState<Project>({ ...project });
  const [isSaving, setIsSaving] = useState(false);

  // Handle form field changes
  const handleFieldChange = (field: keyof Project, value: any) => {
    setEditedProject(prev => ({ ...prev, [field]: value }));
  };

  // Add team member
  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: "New Member",
      role: "Team Member",
      avatar: "NM"
    };
    
    const updatedTeam = [...(editedProject.team || []), newMember];
    setEditedProject(prev => ({
      ...prev,
      team: updatedTeam,
      members: updatedTeam.length
    }));
  };

  // Remove team member
  const removeTeamMember = (memberId: string) => {
    const updatedTeam = editedProject.team?.filter(member => member.id !== memberId) || [];
    setEditedProject(prev => ({
      ...prev,
      team: updatedTeam,
      members: updatedTeam.length
    }));
  };

  // Update team member field
  const updateTeamMember = (memberId: string, field: keyof TeamMember, value: string) => {
    const updatedTeam = editedProject.team?.map(member => 
      member.id === memberId ? { ...member, [field]: value } : member
    ) || [];
    setEditedProject(prev => ({ ...prev, team: updatedTeam }));
  };

  // Add tag
  const addTag = () => {
    const newTag = "New Tag";
    const updatedTags = [...(editedProject.tags || []), newTag];
    setEditedProject(prev => ({ ...prev, tags: updatedTags }));
  };

  // Update tag
  const updateTag = (index: number, value: string) => {
    const updatedTags = editedProject.tags?.map((tag, i) => 
      i === index ? value : tag
    ) || [];
    setEditedProject(prev => ({ ...prev, tags: updatedTags }));
  };

  // Remove tag
  const removeTag = (index: number) => {
    const updatedTags = editedProject.tags?.filter((_, i) => i !== index) || [];
    setEditedProject(prev => ({ ...prev, tags: updatedTags }));
  };

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update timestamp
      const updatedProject = {
        ...editedProject,
        lastUpdated: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      
      // Save to service
      await updateProject(project.id, updatedProject);
      onSave(updatedProject);
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Project Settings</h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <X size={20} />
        </button>
      </div>

      {/* Settings Form */}
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Basic Information</h3>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">Project Name</label>
            <input
              type="text"
              value={editedProject.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">Description</label>
            <textarea
              value={editedProject.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Status</label>
              <select
                value={editedProject.status || 'active'}
                onChange={(e) => handleFieldChange('status', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
                <option value="archived">Archived</option> {/* ADD ARCHIVED OPTION */}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Color Theme</label>
              <select
                value={editedProject.color}
                onChange={(e) => handleFieldChange('color', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="from-gray-700 to-gray-800">Gray</option>
                <option value="from-blue-600 to-blue-700">Blue</option>
                <option value="from-green-600 to-green-700">Green</option>
                <option value="from-purple-600 to-purple-700">Purple</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2 flex items-center gap-2">
              <Calendar size={14} />
              Deadline
            </label>
            <input
              type="date"
              value={editedProject.deadline || ''}
              onChange={(e) => handleFieldChange('deadline', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        {/* Team Members */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Users size={16} />
              Team Members
            </h3>
            <button
              onClick={addTeamMember}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Plus size={14} />
              Add Member
            </button>
          </div>
          
          <div className="space-y-3">
            {editedProject.team?.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    <input
                      type="text"
                      value={member.avatar}
                      onChange={(e) => updateTeamMember(member.id, 'avatar', e.target.value)}
                      className="w-8 text-center bg-transparent text-white text-sm font-medium"
                      maxLength={2}
                    />
                  </div>
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                      className="bg-transparent font-medium text-gray-900 focus:outline-none border-b border-transparent focus:border-gray-300"
                    />
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                      className="bg-transparent text-sm text-gray-500 focus:outline-none border-b border-transparent focus:border-gray-300"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeTeamMember(member.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            
            {(!editedProject.team || editedProject.team.length === 0) && (
              <div className="text-center py-8 text-gray-500 border border-dashed border-gray-200 rounded-lg">
                No team members added yet
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <TagIcon size={16} />
              Project Tags
            </h3>
            <button
              onClick={addTag}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Plus size={14} />
              Add Tag
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {editedProject.tags?.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg"
              >
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => updateTag(index, e.target.value)}
                  className="bg-transparent focus:outline-none text-sm"
                />
                <button
                  onClick={() => removeTag(index)}
                  className="ml-1 text-gray-400 hover:text-red-600"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            
            {(!editedProject.tags || editedProject.tags.length === 0) && (
              <div className="text-gray-500 text-sm">No tags added yet</div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}