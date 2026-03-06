// pages/create-branch/components/DeleteModal.tsx
import React from 'react';
import { X } from 'lucide-react';

interface DeleteModalProps {
  branchId: string;
  onClose: () => void;
  onConfirm: (branchId: string) => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({ branchId, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Delete Branch</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-3">
            Are you sure you want to delete this branch?
          </p>
          <p className="text-sm text-gray-500">
            This action cannot be undone. All cards and workflow data in this branch will be permanently deleted.
          </p>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(branchId)}
            className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Branch
          </button>
        </div>
      </div>
    </div>
  );
};