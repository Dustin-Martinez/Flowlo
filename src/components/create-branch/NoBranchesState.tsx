// pages/create-branch/components/NoBranchesState.tsx
import React from 'react';
import { GitBranch } from 'lucide-react';

interface NoBranchesStateProps {
  onCreateFirstBranch: () => void;
}

export const NoBranchesState: React.FC<NoBranchesStateProps> = ({ onCreateFirstBranch }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <GitBranch className="w-6 h-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No branches yet</h3>
      <p className="text-gray-600 text-sm mb-6">
        Create your first branch to start specialized workflows
      </p>
      <button
        onClick={onCreateFirstBranch}
        className="px-4 py-2.5 bg-choco-600 text-white rounded-lg hover:bg-choco-700 transition-colors text-sm font-medium"
      >
        Create First Branch
      </button>
    </div>
  );
};