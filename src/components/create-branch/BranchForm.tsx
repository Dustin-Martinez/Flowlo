// pages/create-branch/components/BranchForm.tsx
import React, { useMemo } from 'react';
import { 
  Save, 
  X, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  FolderKanban,
  Loader
} from 'lucide-react';
import { BranchFormProps } from '@/src/app/types/create-branch';
import { WORKFLOW_TYPES } from '@/src/app/constants/create-branchConstants';
import { getWorkflowColumnsCount } from '@/src/app/utils/create-branch.utils';
import { useProjectTeamMembers } from '@/src/app/hooks/useProjectTeamMembers';

interface BranchFormWithProjectProps extends BranchFormProps {
  projectId?: string;
}

export const BranchForm: React.FC<BranchFormWithProjectProps> = ({
  branchData,
  setBranchData,
  onSubmit,
  onAddTag,
  onRemoveTag,
  onAddTeamMember,
  onRemoveTeamMember,
  onCancel,
  isSubmitting,
  error,
  parentBoard,
  setActiveTab,
  projectId
}) => {
  // Fetch team members from project database
  const { teamMembers, isLoading: isLoadingTeam } = useProjectTeamMembers(projectId || '')
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-2">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Create New Branch</h3>
          
          <form onSubmit={onSubmit} className="space-y-8">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Branch Information */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Branch Title *
                </label>
                <input
                  type="text"
                  value={branchData.title}
                  onChange={(e) => setBranchData({...branchData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-choco-500 focus:border-transparent text-gray-900"
                  placeholder="Enter branch title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Description
                </label>
                <textarea
                  value={branchData.description}
                  onChange={(e) => setBranchData({...branchData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-choco-500 focus:border-transparent resize-none text-gray-900"
                  placeholder="Describe the purpose of this branch workflow"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Department *
                </label>
                <input
                  type="text"
                  value={branchData.department}
                  onChange={(e) => setBranchData({...branchData, department: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-choco-500 focus:border-transparent text-gray-900"
                  placeholder="e.g., Marketing, Development, Design"
                  required
                />
              </div>
            </div>

            {/* Workflow Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Workflow Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {WORKFLOW_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setBranchData({...branchData, workflowType: type.value})}
                    className={`p-5 border-2 rounded-xl text-left transition-all duration-200 min-h-[100px] ${
                      branchData.workflowType === type.value
                        ? 'border-choco-500 bg-choco-50 ring-2 ring-choco-100'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-1">{type.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </div>
                    {branchData.workflowType === type.value && (
                      <div className="flex items-center gap-1 text-choco-600 text-sm mt-3">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-choco-600">Selected</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Team Members */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Team Members
              </label>
              
              <div className="space-y-6">
                {/* Loading State */}
                {isLoadingTeam && (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-5 h-5 text-choco-600 animate-spin" />
                    <span className="ml-2 text-gray-600">Loading team members...</span>
                  </div>
                )}

                {/* Selected Team Members */}
                {!isLoadingTeam && branchData.team.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {branchData.team.map((memberId) => {
                      const member = teamMembers.find(m => m.id === memberId);
                      return (
                        <div
                          key={memberId}
                          className="flex items-center gap-3 px-4 py-2.5 bg-choco-100 border border-choco-300 rounded-xl"
                        >
                          <div className="w-8 h-8 rounded-full bg-choco-600 text-white text-sm flex items-center justify-center font-medium overflow-hidden">
                            {member?.avatar ? (
                              <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              member?.name?.charAt(0).toUpperCase() || '?'
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-choco-800">{member?.name}</span>
                            <div className="text-xs text-choco-600">{member?.role}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveTeamMember(memberId)}
                            className="p-1 hover:bg-choco-200 rounded-lg ml-2 transition-colors"
                          >
                            <X className="w-4 h-4 text-choco-600" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Available Team Members */}
                {!isLoadingTeam && teamMembers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {teamMembers.map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => onAddTeamMember(member.id)}
                        disabled={branchData.team.includes(member.id)}
                        className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                          branchData.team.includes(member.id)
                            ? 'bg-choco-50 border-choco-300 text-choco-700 shadow-sm'
                            : 'border-gray-200 hover:border-choco-400 hover:bg-choco-50 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium overflow-hidden ${
                            branchData.team.includes(member.id)
                              ? 'bg-choco-600 text-white'
                              : 'bg-choco-100 text-choco-600'
                          }`}>
                            {member.avatar ? (
                              <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              member.name?.charAt(0).toUpperCase() || '?'
                            )}
                          </div>
                          <div>
                            <div className={`font-medium text-sm ${
                              branchData.team.includes(member.id)
                                ? 'text-choco-800'
                                : 'text-gray-900'
                            }`}>
                              {member.name}
                            </div>
                            <div className={`text-xs ${
                              branchData.team.includes(member.id)
                                ? 'text-choco-600'
                                : 'text-gray-500'
                            }`}>
                              {member.role}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : !isLoadingTeam && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <p className="text-gray-600 text-sm">No team members available for this project</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Tags
              </label>
              
              <div className="space-y-6">
                {/* Selected Tags */}
                {branchData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {branchData.tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-2 px-3 py-2 bg-choco-100 text-choco-800 rounded-lg"
                      >
                        <span className="text-sm">{tag}</span>
                        <button
                          type="button"
                          onClick={() => onRemoveTag(tag)}
                          className="p-1 hover:bg-choco-200 rounded transition-colors"
                        >
                          <X className="w-3 h-3 text-choco-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Tag */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={branchData.newTag}
                    onChange={(e) => setBranchData({...branchData, newTag: e.target.value})}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddTag())}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-choco-500 focus:border-transparent text-gray-900"
                    placeholder="Add a tag..."
                  />
                  <button
                    type="button"
                    onClick={onAddTag}
                    className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium"
                  >
                    <Plus className="w-4 h-4 text-gray-700" />
                    <span className="text-gray-700">Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-8 border-t border-black/40">
              <button
                type="button"
                onClick={() => setActiveTab('existing')}
                className="px-6 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-choco-600 text-black rounded-lg hover:bg-choco-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-sm hover:shadow"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-black">Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-black" />
                    <span className="text-black">Create Branch</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Preview Section */}
      <div className="lg:col-span-1">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Preview</h3>
          
          <div className="space-y-6">
            {/* Parent Board Info */}
            <div className="pb-6 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Parent Board</h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-choco-100 flex items-center justify-center">
                  <FolderKanban className="w-6 h-6 text-choco-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{parentBoard?.title}</div>
                  <div className="text-xs text-gray-500">Project: {parentBoard?.projectName}</div>
                </div>
              </div>
            </div>

            {/* Branch Preview */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Branch Details</h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Title</div>
                    <div className="text-sm text-gray-900 font-medium">{branchData.title || 'Untitled Branch'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Department</div>
                    <div className="text-sm text-gray-900">{branchData.department || 'Not specified'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Workflow Type</div>
                    <div className="text-sm text-gray-900 font-medium">
                      {WORKFLOW_TYPES.find(t => t.value === branchData.workflowType)?.label}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Preview */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Branch Setup</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Team Members</span>
                    <span className="text-sm font-medium text-choco-600">{branchData.team.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tags</span>
                    <span className="text-sm font-medium text-choco-600">{branchData.tags.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Workflow Columns</span>
                    <span className="text-sm font-medium text-choco-600">
                      {getWorkflowColumnsCount(branchData.workflowType)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Preview */}
              {branchData.description && (
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                  <p className="text-sm text-gray-600 line-clamp-3">{branchData.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Help Card */}
        <div className="mt-6 bg-choco-50 border border-choco-200 rounded-xl p-5">
          <h4 className="text-sm font-medium text-choco-900 mb-3">About Branches</h4>
          <ul className="space-y-3 text-sm text-choco-700">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-choco-600 mt-0.5 flex-shrink-0" />
              <span>Branches create specialized workflows for different departments</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-choco-600 mt-0.5 flex-shrink-0" />
              <span>Each branch gets its own workflow columns based on type</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-choco-600 mt-0.5 flex-shrink-0" />
              <span>Main board shows total progress from all branches</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-choco-600 mt-0.5 flex-shrink-0" />
              <span>Click on a branch to edit its workflow at <code>/boards/create-branch/[branchId]</code></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};