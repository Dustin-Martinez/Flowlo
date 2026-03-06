// pages/create-branch/components/ErrorState.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onBack: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Error</h2>
        <p className="text-gray-600 text-sm mb-4">{error}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-choco-600 text-white rounded hover:bg-choco-700 transition-colors text-sm"
        >
          Back to Boards
        </button>
      </div>
    </div>
  );
};