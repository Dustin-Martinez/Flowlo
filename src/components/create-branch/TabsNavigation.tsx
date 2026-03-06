// pages/create-branch/components/TabsNavigation.tsx
import React from 'react';
import { GitBranch, Plus } from 'lucide-react';

interface TabsNavigationProps {
  activeTab: 'existing' | 'create';
  onTabChange: (tab: 'existing' | 'create') => void;
  existingBranchesCount: number;
}

export const TabsNavigation: React.FC<TabsNavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  existingBranchesCount 
}) => {
  return (
    <div className="mb-8">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => onTabChange('existing')}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'existing'
              ? 'border-choco-600 text-choco-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          Existing Branches ({existingBranchesCount})
        </button>
        <button
          onClick={() => onTabChange('create')}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'create'
              ? 'border-choco-600 text-choco-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Plus className="w-4 h-4" />
          Create New Branch
        </button>
      </div>
    </div>
  );
};